import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Get the database URL from the .env file, with a fallback just in case
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://root:password@localhost:3306/agtech_db"
)

# The engine physically connects to the MySQL server
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# SessionLocal creates temporary workspaces for your queries
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency function to be used in your FastAPI endpoints (main.py)
# This ensures the database connection opens when a request comes in, and closes when it's done.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()