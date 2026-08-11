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

## Deploying to Render

This project is set up for a split-service Render deployment: the Node/Socket.IO backend deploys as a Web Service, the React app deploys as a Static Site, and MongoDB runs externally on MongoDB Atlas.

1. Create a MongoDB Atlas cluster, add a database user, and allow Render's outbound traffic in your Atlas network access settings. Copy the Atlas connection string for `MONGO_URI`.
2. In Render, create a new Blueprint deployment and point it at the root `render.yaml` file. This provisions:
	- `server/` as a Web Service using the monorepo `rootDir: server` and `dockerfilePath: Dockerfile`
	- `client/` as a Static Site built with `npm install && npm run build`
3. Set the following environment variables in Render for the server service:
	- `MONGO_URI` from MongoDB Atlas
	- `JWT_SECRET` to a long random secret
	- `CLIENT_URL` to the allowed browser origins, for example `http://localhost:5173,https://your-client.onrender.com`
4. After the client service is created, copy its Render URL into the server's `CLIENT_URL` value if you did not already include it. Keep the local dev origin in the same comma-separated list if you still need local testing.
5. Set the client service environment variables:
	- `VITE_API_URL` should point to the server API base URL, for example `https://your-server.onrender.com/api`
	- `VITE_SOCKET_URL` should point to the server root, for example `https://your-server.onrender.com`

Important: `VITE_` variables are baked into the client at build time. If you change `VITE_API_URL` or `VITE_SOCKET_URL`, you must rebuild and redeploy the client Static Site, not just update the environment variables.

For a local reference of the production client env values, see [client/.env.production.example](client/.env.production.example).

## How it works

- REST endpoints (`/api/auth`, `/api/rooms`) handle signup, login, room creation, and history fetch.
- Socket.IO handles real-time events: `join_room`, `send_message`, `receive_message`, `typing`.
- JWT issued on login is used both as a REST header and in the Socket.IO handshake `auth` payload.
- Messages are persisted to MongoDB and replayed as history when a user joins a room.

See the PRD for full architecture details.
