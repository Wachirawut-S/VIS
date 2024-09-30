# app.py
from fastapi import FastAPI
from database import connect_db, disconnect_db
from routes.users import router as users_router
from routes.sp500 import router as sp500_router  # Import the SP500 router
from routes.Nasdaq100 import router as nasdaq100_router  # Import the Nasdaq100 router

app = FastAPI()

app.include_router(users_router, prefix="/api")
app.include_router(sp500_router, prefix="/api")  # Include SP500 router
app.include_router(nasdaq100_router, prefix="/api")
@app.on_event("startup")
async def startup():
    await connect_db()# app.py
from fastapi import FastAPI
from database import connect_db, disconnect_db
from routes.users import router as users_router
from routes.sp500 import router as sp500_router  # Import the SP500 router
from routes.Nasdaq100 import router as nasdaq100_router  # Import the Nasdaq100 router

app = FastAPI()

# Include the routers with the specified prefixes
app.include_router(users_router, prefix="/api")
app.include_router(sp500_router, prefix="/api")  # Include SP500 router
app.include_router(nasdaq100_router, prefix="/api")  # Include Nasdaq100 router

@app.on_event("startup")
async def startup():
    await connect_db()  # Connect to the database

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()  # Disconnect from the database
