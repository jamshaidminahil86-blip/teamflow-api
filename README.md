# TeamFlow API

TeamFlow is a Node.js backend API project.

## Requirements

* Node.js
* npm

## Installation

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root folder:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key
```

If `JWT_SECRET` is not set, the app falls back to a local development secret so auth routes can still run in local debugging sessions.

## Run Development Server

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

## Graceful Shutdown

Stop a local server with `Ctrl+C` to send `SIGINT`. The server stops accepting
requests, drains existing HTTP connections, then closes the report worker and
queue, Prisma, and the Redis health-check client. Docker sends `SIGTERM` when
stopping the API container:

```bash
docker compose stop -t 15 teamflow-api
docker compose logs teamflow-api
```

## Health Check

### GET /health

Returns the API health status.

Example response:

```json
{
  "status": "ok",
  "service": "teamflow-api"
}
```

## Health Details

### GET /health/details

Returns:

* Node.js version
* Environment
* Process uptime
