# LuxeStore - Cloth Design Showcase

A full-stack application for showcasing and ordering cloth designs.

## Project Structure

```
luxestore/
├── frontend/                 # React + Vite frontend application
│   ├── src/                 # React components and pages
│   │   └── LuxeStore.jsx   # Main application component
│   ├── public/              # Static assets and design images
│   ├── index.html           # HTML entry point
│   ├── vite.config.js       # Vite configuration
│   ├── package.json         # Frontend dependencies
│   └── eslint.config.js     # Linting configuration
│
├── backend/                 # Express.js backend server
│   ├── server.js            # Express API server
│   ├── settings.json        # Design prices configuration
│   ├── orders.json          # Customer orders database
│   └── package.json         # Backend dependencies
│
├── package.json             # Root scripts for running both servers
└── README.md                # This file
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

Install dependencies for both frontend and backend:

```bash
npm install
```

This will also install dependencies in `frontend/` and `backend/` folders.

### Running Development Servers

#### Option 1: Run Both Together
```bash
npm run dev
```

Both servers will start:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3001 (Express API)

#### Option 2: Run Separately
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### Building for Production

```bash
npm run build
```

Builds the frontend to `frontend/dist/`

## Features

### Frontend
- Gallery of 16 cloth designs
- Design showcase and modal views
- Customer order form (name, phone, quantity)
- Admin pricing settings page
- Orders dashboard
- Dark/Light mode toggle
- Responsive mobile design

### Backend API
- `GET /api/orders` - Retrieve all customer orders
- `POST /api/orders` - Submit new order
- `GET /api/settings/prices` - Get all design prices
- `GET /api/settings/prices/:designId` - Get specific design price
- `POST /api/settings/prices/:designId` - Update design price (admin)

## Data Files

### settings.json
Stores individual prices for each design:
```json
{
  "prices": {
    "1": 5000,
    "2": 5000,
    ...
  }
}
```

### orders.json
Stores all customer orders:
```json
[
  {
    "id": 453172,
    "timestamp": "2026-04-21T16:56:13.976Z",
    "designName": "Design 1",
    "designId": 1,
    "customerName": "John",
    "phone": "9876543210",
    "quantity": 1,
    "price": 5000,
    "totalAmount": 5000
  }
]
```

## Admin Settings

**Admin Password**: `admin123`

Access Settings page to:
- Set individual prices for each design
- View current configuration

## Technologies

- **Frontend**: React 19, Vite, CSS-in-JS
- **Backend**: Express.js, Node.js
- **Data**: JSON files (orders.json, settings.json)
- **Build**: Vite
- **Dev Tools**: Concurrently, ESLint

## Development Notes

- Frontend uses inline CSS with CSS variables for theming
- All data is persisted to JSON files on the server
- CORS is enabled for frontend-backend communication
- Dark mode preference is client-side only

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
