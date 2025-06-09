from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv("../backend/.env")

app = FastAPI(title="DuoShop Analyzer")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection function
def get_db_connection():
    try:
        conn = psycopg2.connect(
            os.getenv("DATABASE_URL"),
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

@app.get("/")
def read_root():
    return {"message": "DuoShop Analytics API"}

@app.get("/api/analytics/summary")
def get_summary():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Total number of transactions
        cursor.execute("SELECT COUNT(*) as total FROM transactions")
        total_count = cursor.fetchone()["total"]
        
        # Average transaction amount
        cursor.execute("SELECT AVG(amount) as avg_amount FROM transactions")
        avg_amount = cursor.fetchone()["avg_amount"] or 0
        
        # Total income
        cursor.execute("SELECT SUM(amount) as total_income FROM transactions WHERE amount > 0")
        total_income = cursor.fetchone()["total_income"] or 0
        
        # Total expenses
        cursor.execute("SELECT SUM(amount) as total_expense FROM transactions WHERE amount < 0")
        total_expense = cursor.fetchone()["total_expense"] or 0
        
        return {
            "total_transactions": total_count,
            "average_amount": round(float(avg_amount), 2),
            "total_income": round(float(total_income), 2),
            "total_expense": round(float(total_expense), 2)
        }
    finally:
        cursor.close()
        conn.close()

@app.get("/api/analytics/by-category")
def get_category_analysis():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT category, COUNT(*) as count, SUM(amount) as total
            FROM transactions
            GROUP BY category
            ORDER BY ABS(SUM(amount)) DESC
        """)
        
        results = cursor.fetchall()
        return {"categories": results}
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)