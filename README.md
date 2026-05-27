# Tessera.io

An open-source, AI-native collaborative developer sandbox with real-time CRDT synchronization and secure remote code execution.

## Architecture

```
apps/
├── web/                 React (Vite) + TailwindCSS + Monaco Editor
├── sync-server/         Express + Socket.io + Yjs document synchronization
├── execution-engine/    BullMQ worker + Docker/gVisor sandboxing
└── ai-service/          Python FastAPI + MCP + MongoDB Atlas Vector Search

packages/
├── shared-types/        Common TypeScript definitions and DTOs
├── collaboration/       Yjs CRDT helpers, awareness, Socket.io provider
└── ui-components/       Reusable UI component stubs
```

## Prerequisites

- **Node.js** ≥ 20.0.0 and **npm** ≥ 10.0.0
- **Docker** (for code execution engine)
- **Redis** (for BullMQ job queue)
- **MongoDB** (for AI service RAG storage)
- **Python** ≥ 3.11 (for AI service)

Optional:
- **gVisor** (`runsc`) for enhanced kernel isolation in the execution engine

## Quick Start

```bash
# Clone
git clone git@github.com:Kushaal-k/Tessera.io.git
cd Tessera.io

# Install all workspace dependencies
npm install

# Start Redis (if not already running)
docker run -d --name tessera-redis -p 6379:6379 redis:7-alpine

# Start MongoDB (if not already running)
docker run -d --name tessera-mongo -p 27017:27017 mongo:7

# Set up the Python AI service
cd apps/ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ../..

# Start all services in development mode
npm run dev
```

This runs all workspaces concurrently via Turborepo:
- **Web** → http://localhost:3000
- **Sync Server** → http://localhost:4000
- **AI Service** → http://localhost:8000
- **Execution Engine** → connects to Redis on localhost:6379

## Available Scripts

From the monorepo root:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services in development mode |
| `npm run build` | Build all TypeScript packages and the web app |
| `npm run typecheck` | Run TypeScript type checking across all workspaces |
| `npm run lint` | Run linting across all workspaces |
| `npm run clean` | Remove all `dist/` and `node_modules/` directories |

## Workspace Dependencies

```
@tessera/web
├── @tessera/shared-types
├── @tessera/collaboration
└── @tessera/ui-components

@tessera/sync-server
├── @tessera/shared-types
└── @tessera/collaboration

@tessera/execution-engine
└── @tessera/shared-types

@tessera/collaboration
└── @tessera/shared-types

@tessera/ui-components
└── @tessera/shared-types
```

## Environment Variables

### Sync Server (`apps/sync-server`)
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | HTTP/WebSocket server port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |

### Execution Engine (`apps/execution-engine`)
| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_HOST` | `127.0.0.1` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `SANDBOX_RUNTIME` | `runc` | Docker runtime (`runc` or `runsc`) |
| `WORKER_CONCURRENCY` | `3` | Max concurrent job executions |

### AI Service (`apps/ai-service`)
| Variable | Default | Description |
|----------|---------|-------------|
| `TESSERA_MONGODB_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `TESSERA_MONGODB_DB_NAME` | `tessera` | Database name |
| `TESSERA_MONGODB_COLLECTION` | `code_chunks` | Collection for vector chunks |
| `TESSERA_EMBEDDING_DIMENSIONS` | `1536` | Embedding vector dimensions |
| `TESSERA_MCP_SERVER_NAME` | `tessera-ai` | MCP server identifier |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes in the relevant workspace(s)
4. Run `npm run typecheck` and `npm run build` from the root
5. Submit a pull request

## License

[MIT](LICENSE)
