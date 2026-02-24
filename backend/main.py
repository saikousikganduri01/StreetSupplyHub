from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from database import get_db
app = FastAPI()

@app.get("/api/health")
def check_db_connection(db: Session = Depends(get_db)):
    try:
        # A simple query that just asks MySQL to return the number 1
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Backend and MySQL Database are fully connected!"}
    except Exception as e:
        # If MySQL is off or the password is wrong, it catches the error here
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}
    
@app.get("/")
def read_root():
    return {"message": "The backend is successfully running!"}

@app.get("/api/test")
def test_endpoint():
    return {"status": "success", "data": "Frontend connection ready."}