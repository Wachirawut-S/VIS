# app.py
from fastapi import FastAPI
from database import connect_db, disconnect_db
from routes.users import router as users_router

app = FastAPI()

app.include_router(users_router, prefix="/api")

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()
