from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import connect_db, close_db
from .rag import router as rag_router
from .mcp_server import mcp


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None]:
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Tessera AI Service",
    version="0.1.0",
    description="RAG & Model Context Protocol service for Tessera.io",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rag_router)
app.mount("/mcp", mcp.sse_app())


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
