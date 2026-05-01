import { canCheckin, canCheckout } from '../utils/CheckinUtils';
import type { AppEvent } from '../types/Event';
import type { Participant } from '../types/Participant';

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

function makeVip(overrides: Partial<Participant> = {}): Participant {
  return {
    id: 'p1', event_id: 'e1', name: 'VIP User',
    type: 'vip', status: 'outside', checkin_count: 0,
    ...overrides,
  };
}

function makeNormal(overrides: Partial<Participant> = {}): Participant {
  return {
    id: 'p2', event_id: 'e1', name: 'Normal User',
    type: 'normal', status: 'outside', checkin_count: 0,
    ...overrides,
  };
}

describe('Business rules – canCheckin', () => {
  it('allows a VIP to check in on an active event', () => {
    expect(canCheckin(makeVip(), activeEvent).allowed).toBe(true);
  });

  it('allows a VIP to check in again after multiple previous check-ins', () => {
    expect(canCheckin(makeVip({ checkin_count: 5 }), activeEvent).allowed).toBe(true);
  });

  it('allows a normal participant to check in for the first time', () => {
    expect(canCheckin(makeNormal({ checkin_count: 0 }), activeEvent).allowed).toBe(true);
  });

  it('blocks a normal participant from a second check-in', () => {
    const result = canCheckin(makeNormal({ checkin_count: 1 }), activeEvent);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/already checked in/i);
  });

  it('blocks check-in when the event is closed', () => {
    expect(canCheckin(makeVip(), { ...activeEvent, status: 'closed' }).allowed).toBe(false);
  });

  it('blocks check-in when the event is cancelled', () => {
    expect(canCheckin(makeVip(), { ...activeEvent, status: 'cancelled' }).allowed).toBe(false);
  });
});

describe('Business rules – canCheckout', () => {
  it('allows a VIP to check out when inside', () => {
    expect(canCheckout(makeVip({ status: 'inside' }), activeEvent).allowed).toBe(true);
  });

  it('allows a VIP to check out again after multiple check-ins', () => {
    expect(canCheckout(makeVip({ status: 'inside', checkin_count: 4 }), activeEvent).allowed).toBe(true);
  });

  it('blocks check-out when the participant is outside', () => {
    const result = canCheckout(makeVip({ status: 'outside' }), activeEvent);
    expect(result.allowed).toBe(false);
  });

  it('blocks check-out when the event is closed', () => {
    const result = canCheckout(makeVip({ status: 'inside' }), { ...activeEvent, status: 'closed' });
    expect(result.allowed).toBe(false);
  });
});
