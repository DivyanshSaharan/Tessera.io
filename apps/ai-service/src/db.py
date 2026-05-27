from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
from .config import settings

_client: AsyncIOMotorClient | None = None  # type: ignore[type-arg]


async def connect_db() -> None:
    global _client
    _client = AsyncIOMotorClient(settings.MONGODB_URI)


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None


def get_collection() -> AsyncIOMotorCollection:  # type: ignore[type-arg]
    if _client is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    db = _client[settings.MONGODB_DB_NAME]
    return db[settings.MONGODB_COLLECTION]
