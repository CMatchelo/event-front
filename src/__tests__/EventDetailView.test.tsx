import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import EventDetailView from '../components/EventDetailView';
import type { AppEvent } from '../types/Event';
import { renderWithProviders } from '../test-utils';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockEvent: AppEvent = {
  id: 'e1',
  name: 'Test Event',
  date: '2026-05-01',
  location: 'Venue',
  status: 'active',
  description: '',
  expected_count: 100,
  checkin_count: 50,
  error_count: 2,
  entry_rate: 0.5,
};

describe('EventDetailView – component behavior', () => {
  afterEach(() => {
    (global as { fetch?: unknown }).fetch = undefined;
  });

  it('displays the loading skeleton while the event is being fetched', async () => {
    (global as { fetch: unknown }).fetch = jest.fn(() => new Promise(() => {}));

    renderWithProviders(<EventDetailView id="e1" />);

    await waitFor(() => {
      expect(screen.getByTestId('skeleton-detail')).toBeInTheDocument();
    });
  });

  it('displays the error state when the API throws an error', async () => {
    (global as { fetch: unknown }).fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 500 } as Response),
    );

    renderWithProviders(<EventDetailView id="e1" />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /failed to load event/i })).toBeInTheDocument();
    });
  });

  it('displays the empty state when the API returns an empty participants array', async () => {
    (global as { fetch: unknown }).fetch = jest.fn((url: string) => {
      if (url.includes('/participants')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) } as Response);
      }
      if (url.includes('/checkins')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) } as Response);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockEvent) } as Response);
    });

    renderWithProviders(<EventDetailView id="e1" />);

    await waitFor(() => {
      expect(screen.getByText(/no participants registered/i)).toBeInTheDocument();
    });
  });
});
