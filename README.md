# Real-Time WebSocket Chatroom

Full-stack real-time chat app built with React, Node.js, Express, Socket.IO, and MongoDB.

## Structure

```
websocket-chatroom/
├── server/     Express + Socket.IO backend
└── client/     React (Vite) frontend
```

## Setup

### 1. Backend
```
cd server
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### 2. Frontend
```
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

## Run with Docker (recommended)

No local Node.js or MongoDB install needed — just Docker.

```
cp .env.example .env   # set a real JWT_SECRET
docker compose up --build
```

This starts three containers:
- `mongo` — MongoDB 7, data persisted in a named volume
- `server` — Express + Socket.IO backend on `http://localhost:5000`
- `client` — React app built and served via nginx on `http://localhost:5173`

Open `http://localhost:5173` in the browser once all three are up.

To stop: `docker compose down` (add `-v` to also wipe the Mongo data volume).

To rebuild after code changes: `docker compose up --build`.

**Note:** the client's API/socket URLs are baked in at build time (Vite env vars), so if you change ports in `docker-compose.yml`, rebuild the client image for it to take effect.

## How it works

- REST endpoints (`/api/auth`, `/api/rooms`) handle signup, login, room creation, and history fetch.
- Socket.IO handles real-time events: `join_room`, `send_message`, `receive_message`, `typing`.
- JWT issued on login is used both as a REST header and in the Socket.IO handshake `auth` payload.
- Messages are persisted to MongoDB and replayed as history when a user joins a room.

See the PRD for full architecture details.
