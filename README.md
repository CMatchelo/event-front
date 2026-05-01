# Event Management Panel

A Next.js dashboard for monitoring and managing events in real time. Operators can browse all events, view per-event statistics and charts, and check participants in and out.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| State management | Redux Toolkit |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Testing | Jest + React Testing Library |

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout — Redux + Toast providers
│   ├── page.tsx                 # / → EventsGrid
│   └── events/[id]/page.tsx     # /events/:id → EventDetailView
├── components/                  # UI components
├── constants/                   # Shared constants (API URL, styles, config)
├── hooks/
│   └── useParticipantCheckin.ts # Check-in / check-out logic
├── store/
│   ├── eventsSlice.ts           # Events list state
│   └── eventDetailSlice.ts      # Single event + participants state
├── types/                       # TypeScript interfaces
├── utils/                       # Pure helper functions
└── __tests__/                   # Jest test suites
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A running JSON API at `http://localhost:3001` (see [API](#api))

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest test suite |
| `npm run test:watch` | Run tests in watch mode |

---

## API

The app expects a REST API at `http://localhost:3001` (configured in `src/constants/api.constant.ts`) with the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/events` | List all events |
| `GET` | `/events/:id` | Get a single event |
| `GET` | `/checkins?event_id=:id` | Get check-in records for an event |
| `GET` | `/participants?event_id=:id` | Get participants for an event |
| `POST` | `/checkins` | Record a check-in or check-out |
| `PATCH` | `/participants/:id` | Update a participant's status |

---

## Features

### Events list (`/`)

- Displays all events as cards with status badge, date, location, and check-in progress bar
- Real-time search with 350 ms debounce
- Filter by status: All / Active / Closed / Cancelled
- Sort by date ascending or descending

### Event detail (`/events/:id`)

- Header with event name, location, date, and status badge
- Four stat cards: Expected, Check-ins, Errors, Entry Rate
- **Entries Over Time** — cumulative area chart grouped by hour
- **Check-in Breakdown** — pie chart showing successful vs. failed check-ins
- Participants table with search and status filter (All / Inside / Outside)

### Check-in / Check-out

- Optimistic UI update — the participant's status changes immediately before the API confirms
- **VIP** participants can check in and out any number of times
- **Normal** participants can only check in once; further attempts show an error toast
- Both actions are blocked if the event is `closed` or `cancelled`
- Failed API calls roll back the optimistic update and show an error toast

---

## Business rules

| Rule | VIP | Normal |
|---|---|---|
| Check-in on active event | Unlimited | First time only |
| Check-out when inside | Yes | Yes |
| Any action on closed event | Blocked | Blocked |
| Any action on cancelled event | Blocked | Blocked |

---

## Testing

Tests live in `src/__tests__/` and use Jest with React Testing Library.

```bash
npm test
```

| Suite | Coverage |
|---|---|
| `CheckinUtils.test.ts` | Business rules for `canCheckin` and `canCheckout` |
| `ParticipantRow.test.tsx` | Error toast on second check-in attempt; POST `/checkins` payload |
| `EventDetailView.test.tsx` | Loading skeleton, API error state, empty participants state |
| `EventsGrid.test.tsx` | Search input filters displayed events |
