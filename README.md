# ElectroMap

ElectroMap is a beginner-friendly MERN stack project for locating EV charging stations. It is based on the PDF idea you shared and improves it with:

- Search by station name, city, or address
- Filter by charger type
- Google Maps integration
- Add station functionality
- Sample seed data for an easy demo

## Tech Stack

- MongoDB
- Express.js
- React.js with Vite
- Node.js

## Project Structure

```text
Electromap/
├── client/
├── server/
├── package.json
└── README.md
```

## Features

- View EV charging stations in a clean dashboard
- Search stations instantly
- Filter by charger type such as Fast, CCS, Type 2, or CHAdeMO
- See station details like pricing, availability, and working hours
- Open stations directly in Google Maps
- Add a new charging station from the frontend form
- Seed demo stations automatically when the database is empty

## Prerequisites

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB installation
- Optional Google Maps JavaScript API key

## Setup Steps

### 1. Clone or open the project

Use the `Electromap` folder directly.

### 2. Install dependencies

From the project root:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment variables

Create `.env` files by copying the examples:

Server `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Client `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

If you do not add a Google Maps API key, the app still works and shows a helpful fallback panel with Google Maps links.

### 4. Start the app

From the root folder:

```bash
npm run dev
```

### 5. Open the frontend

Visit:

```text
http://localhost:5173
```

## API Endpoints

### `GET /api/health`

Checks if the backend is running.

### `GET /api/stations`

Supports optional query parameters:

- `search`
- `chargerType`

Example:

```text
/api/stations?search=Chennai&chargerType=CCS
```

### `POST /api/stations`

Adds a new charging station.

Example request body:

```json
{
  "stationName": "GreenVolt Hub",
  "address": "GST Road",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "coordinates": {
    "lat": 13.0827,
    "lng": 80.2707
  },
  "chargerTypes": ["CCS", "Type 2"],
  "availability": "Available",
  "pricing": 24,
  "operatingHours": "24/7",
  "facilities": ["Parking", "Cafe"]
}
```

## Suggested Viva Points

- Explain the MERN architecture: React frontend, Express backend, MongoDB database
- Show how search and filter work through query parameters
- Demonstrate CRUD by adding a new charging station
- Explain why map integration improves usability for EV users
- Mention seed data for quick testing during demos

## Future Improvements

- Authentication for admin users
- Reviews and ratings
- Real-time slot availability
- Route planning between cities
- Booking or reservation support
