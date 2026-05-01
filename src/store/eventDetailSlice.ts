import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { Checkin } from '../types/checkin';
import { AppEvent } from '../types/Event';

const BASE_API = 'http://localhost:3001';

interface EventDetailState {
  event: AppEvent | null;
  checkins: Checkin[];
  loading: boolean;
  error: string | null;
}

const initialState: EventDetailState = {
  event: null,
  checkins: [],
  loading: false,
  error: null,
};

export const fetchEventDetail = createAsyncThunk<
  { event: AppEvent; checkins: Checkin[] },
  string,
  { rejectValue: string }
>('eventDetail/fetch', async (eventId, { rejectWithValue }) => {
  try {
    const [eventRes, checkinsRes] = await Promise.all([
      fetch(`${BASE_API}/events/${eventId}`),
      fetch(`${BASE_API}/checkins?event_id=${eventId}`),
    ]);

    if (!eventRes.ok) throw new Error(`Failed to load event (HTTP ${eventRes.status})`);
    if (!checkinsRes.ok) throw new Error(`Failed to load checkins (HTTP ${checkinsRes.status})`);

    const event: AppEvent = await eventRes.json();
    const checkins: Checkin[] = await checkinsRes.json();

    return { event, checkins };
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
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.event = null;
        state.checkins = [];
      })
      .addCase(fetchEventDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload.event;
        state.checkins = action.payload.checkins;
      })
      .addCase(fetchEventDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { resetEventDetail } = eventDetailSlice.actions;
export default eventDetailSlice.reducer;
