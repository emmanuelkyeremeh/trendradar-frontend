# TrendRadar Frontend

React + Vite frontend for TrendRadar that displays tech trends in real-time.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `example.env` to `.env` and fill in your Firebase client credentials:
```bash
cp example.env .env
```

3. Configure Firebase client SDK credentials in `.env`

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Architecture

- **Firebase Client SDK**: Direct connection to Firestore (no backend API needed)
- **Real-time Updates**: Auto-refreshes trends every 5 minutes
- **Responsive Design**: Mobile-friendly dashboard
- **Clean UI**: Minimal, modern design inspired by Billboard

## Features

- Displays today's top 10 trending topics
- Shows mentions count, sentiment, and keywords for each trend
- Displays usage statistics (AI calls and articles processed)
- Auto-refreshes data every 5 minutes
