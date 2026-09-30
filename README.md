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
```

## Run Development Server

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
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
