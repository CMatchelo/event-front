import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Event, EventsState, EventStatus } from '@/src/types';

const BASE_API = 'http://localhost:3001';

export const fetchEvents = createAsyncThunk<Event[], void, { rejectValue: string }>(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_API}/events`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: Event[] = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch events');
    }
  }
);

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all',
  sortDateDirection: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<EventStatus | 'all'>) {
      state.statusFilter = action.payload;
    },
    toggleSortDate(state) {
      if (state.sortDateDirection === null) state.sortDateDirection = 'asc';
      else if (state.sortDateDirection === 'asc') state.sortDateDirection = 'desc';
      else state.sortDateDirection = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { setSearchQuery, setStatusFilter, toggleSortDate } = eventsSlice.actions;
export default eventsSlice.reducer;
