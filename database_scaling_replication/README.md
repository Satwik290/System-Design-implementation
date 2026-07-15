# Database Scaling & Replication Demo

A minimal Node.js API showing a master-replica MySQL architecture for write/read separation.

## Project Structure

- `index.js` - Express API that writes to the master database and reads from the replica database.
- `docker-compose.yml` - Docker Compose setup for two MySQL containers:
  - `mysql-master` on host port `3306`
  - `mysql-replica` on host port `3307`
- `package.json` - Node.js project metadata and dependencies.

## Features

- `POST /users` writes new users to the master database.
- `GET /users` reads user records from the read replica.

## Requirements

- Docker
- Docker Compose
- Node.js 18+ (or compatible)

## Setup

1. Start MySQL containers:

```bash
docker compose up -d
```

2. Install Node.js dependencies:

```bash
npm install
```

3. Run the API server:

```bash
node index.js
```

The API listens on port `3000`.

## Usage

Create a user:

```bash
curl -X POST http://127.0.0.1:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Charlie"}'
```

Retrieve users:

```bash
curl http://127.0.0.1:3000/users
```

## Notes

- The demo uses separate connection pools for master and replica.
- The `mysql-master` container is started with binary logging enabled (`--log-bin=mysql-bin`) for replication.
- The replica container is not fully configured for automatic MySQL replication in this demo; additional replica configuration is required for a production-ready setup.

## Dependencies

- `express`
- `mysql2`

## License

ISC
