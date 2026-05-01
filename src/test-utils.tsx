import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import eventsReducer from './store/eventsSlice';
import eventDetailReducer from './store/eventDetailSlice';
import { ToastProvider } from './components/ToastProvider';
import type { RootState } from './store';

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      events: eventsReducer,
      eventDetail: eventDetailReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    ...renderOptions
  }: { preloadedState?: Partial<RootState> } & RenderOptions = {},
) {
  const store = makeStore(preloadedState);
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ToastProvider>{children}</ToastProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
