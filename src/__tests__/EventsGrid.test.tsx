import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import EventsGrid from '../components/EventsGrid';
import type { AppEvent } from '../types/Event';
import { renderWithProviders } from '../test-utils';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const eventOne: AppEvent = {
  id: 'e1',
  name: 'React Conference',
  date: '2026-06-01',
  location: 'São Paulo',
  status: 'active',
  description: '',
  expected_count: 200,
  checkin_count: 100,
  error_count: 0,
  entry_rate: 0.5,
};

const eventTwo: AppEvent = {
  id: 'e2',
  name: 'Node Summit',
  date: '2026-07-15',
  location: 'Rio de Janeiro',
  status: 'active',
  description: '',
  expected_count: 150,
  checkin_count: 75,
  error_count: 0,
  entry_rate: 0.5,
};

describe('EventsGrid – search', () => {
  afterEach(() => {
    (global as { fetch?: unknown }).fetch = undefined;
  });

  it('only shows events matching the search input', async () => {
    (global as { fetch: unknown }).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([eventOne, eventTwo]),
      } as Response),
    );

    renderWithProviders(<EventsGrid />);

    // Wait for both events to load
    await waitFor(() => {
      expect(screen.getByText('React Conference')).toBeInTheDocument();
      expect(screen.getByText('Node Summit')).toBeInTheDocument();
    });

    // Type in the search input
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: 'React' } });

    // Wait for the debounce to fire and results to update
    await waitFor(
      () => {
        expect(screen.getByText('React Conference')).toBeInTheDocument();
        expect(screen.queryByText('Node Summit')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });
});
