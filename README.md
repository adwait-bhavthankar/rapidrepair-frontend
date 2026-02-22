# RapidRepair Frontend

A modern repair shop management web application built with Next.js.

## Features

- User authentication (login/register)
- Interactive dashboard
- Worker directory with map view
- User profile management
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Maps:** Leaflet + React-Leaflet
- **Icons:** Lucide React

## Getting Started

```bash
cd rapidrepair-main/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── dashboard/     # Dashboard page
├── login/         # Login page
├── register/      # Registration page
├── profile/       # User profile
├── workers/       # Worker directory
│   └── [id]/      # Worker details
└── page.tsx       # Home page
```

## API Configuration

The frontend connects to the backend at `http://localhost:5000`. Update the API endpoints in the components as needed.
