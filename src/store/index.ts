import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventsSlice';
import eventDetailReducer from './eventDetailSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    eventDetail: eventDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
