# Frontend - React + Vite

This is the frontend application for the Traya Clinical Onboarding Hub, built with React, Vite, and React Router.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Nginx** - Production web server

## Migration from Next.js

This application was migrated from Next.js to a standard React setup using Vite. Key changes:

- Replaced Next.js App Router with React Router
- Migrated from Next.js pages to standard React components
- Replaced `next/link` and `next/navigation` with `react-router-dom`
- Changed environment variables from `NEXT_PUBLIC_*` to `VITE_*`
- Updated build system from Next.js to Vite
- Changed production deployment from Node.js to Nginx

## Project Structure

```
frontend/
├── src/
│   ├── pages/          # Route components
│   ├── App.tsx         # Main app with routes
│   ├── main.tsx        # Application entry point
│   └── vite-env.d.ts   # Vite environment types
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utilities and API
├── types/             # TypeScript type definitions
├── constants/         # Application constants
├── public/            # Static assets
├── index.html         # HTML entry point
├── vite.config.ts     # Vite configuration
└── package.json       # Dependencies
```

## Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the frontend directory:

```bash
# API URL for development
VITE_API_URL=http://localhost:3001

# Optional demo user ID
# VITE_DEMO_USER_ID=
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t traya-frontend .
```

### Run Docker Container

```bash
docker run -p 3000:3000 \
  -e VITE_API_URL=http://backend:3001 \
  traya-frontend
```

### Docker Compose

See the root `docker-compose.prod.yml` file for the complete production setup.

## API Integration

The frontend communicates with the backend API. API endpoints are configured in `lib/api/config.ts`.

The Vite dev server proxies `/api/*` requests to the backend, and in production, Nginx handles the proxy.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Routing

Routes are defined in `src/App.tsx`:

- `/` - Home page
- `/quiz` - Quiz flow
- `/booking` - Booking calendar

## State Management

The app uses Zustand for state management:

- `lib/store/quizStore.ts` - Quiz state and answers
- `lib/store/bookingStore.ts` - Booking state

State is persisted to localStorage for better UX.

## Styling

Tailwind CSS is used for styling. Global styles are in `app/globals.css`.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript support required

## Performance

- Code splitting with React.lazy
- Optimized production builds with Vite
- Static asset caching with Nginx
- Gzip compression enabled

## Troubleshooting

### Port already in use

If port 3000 is already in use, you can change it in `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change to desired port
}
```

### API connection issues

Make sure the backend is running and the `VITE_API_URL` environment variable is set correctly.

### Build fails

Try clearing the cache and node_modules:

```bash
rm -rf node_modules dist
npm install
npm run build
```
