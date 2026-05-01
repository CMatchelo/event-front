import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { Checkin } from '../types/checkin';
import { AppEvent } from '../types/Event';
import { Participant } from '../types/Participant';

const BASE_API = 'http://localhost:3001';

interface EventDetailState {
  event: AppEvent | null;
  checkins: Checkin[];
  participants: Participant[];
  loading: boolean;
  error: string | null;
}

const initialState: EventDetailState = {
  event: null,
  checkins: [],
  participants: [],
  loading: false,
  error: null,
};

export const fetchEventDetail = createAsyncThunk<
  { event: AppEvent; checkins: Checkin[] },
  string,
  { rejectValue: string }
>('eventDetail/fetch', async (eventId, { rejectWithValue }) => {
  try {
    const [eventRes, checkinsRes, participantsRes] = await Promise.all([
      fetch(`${BASE_API}/events/${eventId}`),
      fetch(`${BASE_API}/checkins?event_id=${eventId}`),
      fetch(`${BASE_API}/participants?event_id=${eventId}`),
    ]);

    if (!eventRes.ok) throw new Error(`Failed to load event (HTTP ${eventRes.status})`);
    if (!checkinsRes.ok) throw new Error(`Failed to load checkins (HTTP ${checkinsRes.status})`);
    if (!participantsRes.ok) throw new Error(`Failed to load participants (HTTP ${participantsRes.status})`);

    const event: AppEvent = await eventRes.json();
    const checkins: Checkin[] = await checkinsRes.json();
    const participants: Participant[] = await participantsRes.json();

    return { event, checkins, participants };
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
  }
});

export const performCheckin = createAsyncThunk<
  { checkin: Checkin; participant: Participant; event: AppEvent },
  { eventId: string; participantId: string; action: 'entry' | 'exit' },
  { rejectValue: string }
>('eventDetail/performCheckin', async ({ eventId, participantId, action }, { rejectWithValue }) => {
  try {
    const checkinRes = await fetch(`${BASE_API}/checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        participant_id: participantId,
        action,
        timestamp: new Date().toISOString(),
        success: true,
        error_reason: null,
      }),
    });
    if (!checkinRes.ok) throw new Error(`Checkin failed (HTTP ${checkinRes.status})`);
    const checkin: Checkin = await checkinRes.json();

    const newStatus = action === 'entry' ? 'inside' : 'outside';
    const participantRes = await fetch(`${BASE_API}/participants/${participantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!participantRes.ok) throw new Error(`Participant update failed (HTTP ${participantRes.status})`);
    const participant: Participant = await participantRes.json();

    // Fetch updated event metrics
    const eventRes = await fetch(`${BASE_API}/events/${eventId}`);
    if (!eventRes.ok) throw new Error(`Event update failed (HTTP ${eventRes.status})`);
    const event: AppEvent = await eventRes.json();

    return { checkin, participant, event };
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
  }
});

const eventDetailSlice = createSlice({
  name: 'eventDetail',
  initialState,
  reducers: {
    resetEventDetail(state) {
      state.event = null;
      state.checkins = [];
      state.participants = [];
      state.loading = false;
      state.error = null;
    },
    optimisticCheckin(
      state,
      action: { payload: { participantId: string; newStatus: 'inside' | 'outside' } }
    ) {
      const p = state.participants.find((p) => p.id === action.payload.participantId);
      if (p) {
        p.status = action.payload.newStatus;
        p.checkin_count = (p.checkin_count ?? 0) + 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.event = null;
        state.checkins = [];
        state.participants = [];
      })
      .addCase(fetchEventDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload.event;
        state.checkins = action.payload.checkins;
        state.participants = action.payload.participants;
      })
      .addCase(fetchEventDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(performCheckin.fulfilled, (state, action) => {
        state.checkins.push(action.payload.checkin);
        const idx = state.participants.findIndex((p) => p.id === action.payload.participant.id);
        if (idx !== -1) state.participants[idx] = action.payload.participant;
        state.event = action.payload.event;
      });
      
  },
});

export const { resetEventDetail, optimisticCheckin } = eventDetailSlice.actions;
export default eventDetailSlice.reducer;
