import  pandas as pd 
import numpy as np 
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

def get_db_connection():
    print("Connecting to the database...")
    load_dotenv('../../backend/.env')
    try:
        # getting the database connection 
        db_url = os.getenv('DATABASE_URL')
        if not db_url:
            raise ValueError("DATABASE_URL environment variable is not set.")
        conn = psycopg2.connect(
            db_url,
            cursor_factory=RealDictCursor,
            sslmode='require'
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise Exception("Database connection error")
    
def get_db_budget_analysis():
    try :
        conn=get_db_connection()
        cursor=conn.cursor()
        
        
        cursor.execute("""
            SELECT 
               id,user_id,title,amount,category,description,date,created_at,updated_at
               FROM transactions
               WHERE user_id=%s
               FROM transactions
               WHERE user_id=%s
               ORDER BY date ASC
               
        """,(user_id,))
        transactions=cursor.fetchall()
        df=pd.DataFrame(transactions)
        if df.empty:
            return {"error": "No transactions found for the user."}
        df['date'] = pd.to_datetime(df['date'])
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return results
    except Exception as e:
        print(f"Error fetching budget analysis data: {e}")
        return []

def test_connection():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print("Connection successful:", result)
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Test failed: {e}")
        return False

# Add a main block to test
if __name__ == "__main__":
    print("Testing database connection...")
    test_connection()