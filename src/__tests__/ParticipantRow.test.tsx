import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ParticipantRow } from '../components/ParticipantRow';
import { ToastProvider } from '../components/ToastProvider';
import { useParticipantCheckin } from '../hooks/useParticipantCheckin';
import type { AppEvent } from '../types/Event';
import type { Participant } from '../types/Participant';
import { renderWithProviders, makeStore } from '../test-utils';

const activeEvent: AppEvent = {
  id: 'e1',
  name: 'Test Event',
  date: '2026-05-01',
  location: 'Venue',
  status: 'active',
  description: '',
  expected_count: 100,
  checkin_count: 0,
  error_count: 0,
  entry_rate: 0,
};

const vipParticipant: Participant = {
  id: 'p1', event_id: 'e1', name: 'VIP User',
  type: 'vip', status: 'outside', checkin_count: 0,
};

const normalParticipantReturning: Participant = {
  id: 'p2', event_id: 'e1', name: 'Normal User',
  type: 'normal', status: 'outside', checkin_count: 1,
};

describe('ParticipantRow – component behavior', () => {
  afterEach(() => {
    (global as { fetch?: unknown }).fetch = undefined;
  });

  it('displays an error toast when a normal participant attempts a second check-in', async () => {
    const store = makeStore();
    function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <Provider store={store}>
          <ToastProvider>{children}</ToastProvider>
        </Provider>
      );
    }

    const { result } = renderHook(
      () => useParticipantCheckin(normalParticipantReturning, activeEvent),
      { wrapper: Wrapper },
    );

    await act(async () => {
      result.current.handleCheckin();
    });

    await waitFor(() => {
      expect(screen.getByText(/already checked in/i)).toBeInTheDocument();
    });
  });

  it('calls POST /checkins with the correct payload when the check-in button is clicked', async () => {
    const mockCheckin = {
      id: 'c1', event_id: 'e1', participant_id: 'p1',
      action: 'entry', timestamp: '2026-05-01T10:00:00.000Z',
      success: true, error_reason: null,
    };

    const calls: [string, RequestInit | undefined][] = [];
    (global as { fetch: unknown }).fetch = jest.fn((url: string, options?: RequestInit) => {
      calls.push([url, options]);
      if (options?.method === 'POST') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockCheckin) } as Response);
      }
      if (url.includes('/participants/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...vipParticipant, status: 'inside', checkin_count: 1 }),
        } as Response);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(activeEvent) } as Response);
    });

    renderWithProviders(
      <table><tbody>
        <ParticipantRow participant={vipParticipant} event={activeEvent} />
      </tbody></table>,
    );

    await act(async () => {
      screen.getByRole('button', { name: /check-in/i }).click();
    });

    await waitFor(() => {
      const postCall = calls.find(([, opts]) => opts?.method === 'POST');
      expect(postCall).toBeDefined();
      const body = JSON.parse(postCall![1]!.body as string);
      expect(body).toMatchObject({
        event_id: 'e1',
        participant_id: 'p1',
        action: 'entry',
        success: true,
        error_reason: null,
      });
    });
  });
});
