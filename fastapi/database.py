from databases import Database
import bcrypt

POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"

DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

database = Database(DATABASE_URL)

# Function to hash the plain password
def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode(), salt)
    return hashed.decode()

# Function to verify a plain password against the hashed password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

async def connect_db():
    await database.connect()
    print("Database connected")

async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")

# User-related functions
async def insert_user(username: str, password_hash: str, email: str, status: int = 0):
    query = """
    INSERT INTO users (username, password_hash, email, status)
    VALUES (:username, :password_hash, :email, :status)
    RETURNING user_id, username, password_hash, email, created_at, status
    """
    values = {"username": username, "password_hash": password_hash, "email": email, "status": status}
    return await database.fetch_one(query=query, values=values)

async def get_user(username: str):
    query = "SELECT * FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})

async def get_user_by_id(user_id: int):
    query = "SELECT * FROM users WHERE user_id = :user_id"
    return await database.fetch_one(query=query, values={"user_id": user_id})

async def get_user_by_email(email: str):
    query = "SELECT * FROM users WHERE email = :email"
    return await database.fetch_one(query=query, values={"email": email})

async def update_user(user_id: int, username: str, password_hash: str, email: str):
    query = """
    UPDATE users
    SET username = :username, password_hash = :password_hash, email = :email
    WHERE user_id = :user_id
    RETURNING user_id, username, password_hash, email, created_at, status
    """
    values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# Function to select all in indexfunds
async def get_all_sp500():
    query = "SELECT * FROM SP500"
    return await database.fetch_all(query)

async def get_all_Nasdaq100():
    query = "SELECT * FROM Nasdaq100"
    return await database.fetch_all(query)

# Functions for Calculation History

async def insert_calculation_history(data: dict):
    query = """
    INSERT INTO calculation (user_id, username, company_name, stock_price, intrinsic_value, margin_of_safety, 
                             rating, gross_profit_margin, return_on_equity, roic, sga_to_revenue, 
                             debt_to_equity, current_ratio, cash_ratio, quick_ratio, roa)
    VALUES (:user_id, :username, :company_name, :stock_price, :intrinsic_value, :margin_of_safety, 
            :rating, :gross_profit_margin, :return_on_equity, :roic, :sga_to_revenue, 
            :debt_to_equity, :current_ratio, :cash_ratio, :quick_ratio, :roa)
    RETURNING *
    """
    return await database.fetch_one(query=query, values=data)

async def get_calculation_history_by_user_id(user_id: int):
    query = "SELECT * FROM calculation WHERE user_id = :user_id"
    return await database.fetch_all(query=query, values={"user_id": user_id})

async def delete_calculation_history(history_id: int):
    query = "DELETE FROM calculation WHERE history_id = :history_id RETURNING *"
    return await database.fetch_one(query=query, values={"history_id": history_id})
