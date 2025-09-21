import os
import uuid
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "http://localhost:8201")
_CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]

app = FastAPI(title="WatchZone Link API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CredItem(BaseModel):
    full_id: str
    username: Optional[str] = None
    password: Optional[str] = None
    expires_at: datetime
    single_use: bool = True

_store: Dict[str, CredItem] = {}

async def _janitor():
    while True:
        now = datetime.now(timezone.utc)
        expired = [t for t, v in _store.items() if v.expires_at <= now]
        for t in expired:
            _store.pop(t, None)
        await asyncio.sleep(30)

@app.on_event("startup")
async def _startup():
    asyncio.create_task(_janitor())

class CreateLinkBody(BaseModel):
    full_id: str = Field(..., description="A-0001 / B-0002 ... (for display)")
    username: Optional[str] = None
    password: Optional[str] = None
    ttl_seconds: int = Field(default=600, ge=30, le=86400, description="Link TTL (seconds), default 10 minutes")
    single_use: bool = Field(default=True, description="Invalidate after first GET")

class CreateLinkResponse(BaseModel):
    token: str
    url: str
    expires_at: datetime

class CredResponse(BaseModel):
    full_id: str
    username: Optional[str] = None
    password: Optional[str] = None
    expires_at: datetime

@app.post("/cred/link", response_model=CreateLinkResponse, tags=["Credential Link"])
def create_cred_link(body: CreateLinkBody):
    token = uuid.uuid4().hex
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=body.ttl_seconds)
    _store[token] = CredItem(
        full_id=body.full_id,
        username=body.username,
        password=body.password,
        expires_at=expires_at,
        single_use=body.single_use,
    )
    url = f"{PUBLIC_BASE_URL}/cred/{token}"
    return CreateLinkResponse(token=token, url=url, expires_at=expires_at)

@app.get("/cred/{token}", response_model=CredResponse, tags=["Credential Link"])
def get_cred(token: str):
    item = _store.get(token)
    if not item:
        raise HTTPException(status_code=404, detail="Invalid or expired token")
    now = datetime.now(timezone.utc)
    if item.expires_at <= now:
        _store.pop(token, None)
        raise HTTPException(status_code=410, detail="Link expired")
    if item.single_use:
        _store.pop(token, None)
    return CredResponse(
        full_id=item.full_id,
        username=item.username,
        password=item.password,
        expires_at=item.expires_at,
    )

@app.delete("/cred/{token}", tags=["Credential Link"])
def revoke_cred(token: str):
    existed = _store.pop(token, None)
    if not existed:
        raise HTTPException(status_code=404, detail="Token not found")
    return {"ok": True}

@app.get("/healthz", tags=["Health"])
def health():
    return {"ok": True}
