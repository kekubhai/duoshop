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
    
def get_db_budget_analysis(user_id):
    try :
        conn=get_db_connection()
        cursor=conn.cursor()
        
        
        cursor.execute("""
         SELECT 
         id,user_id,title,amount,category,created_at
         FROM transactions
        WHERE user_id=%s
        ORDER BY created_at ASC
""", (user_id,))
        transactions=cursor.fetchall()
        df=pd.DataFrame(transactions)
        if df.empty:
            return {"error": "No transactions found for the user."}
      
        
        df['created_at'] = pd.to_datetime(df['created_at'])
        df['month']=df['created_at'].dt.month
        df['year']=df['created_at'].dt.year
        df['month_year']=df['created_at'].dt.to_period('M')
        
        monthly_category=df.pivot_table(
            index='month_year',
            columns='category', 
            values='amount',
            aggfunc=lambda x: np.sum(x) if x is not None else 0
        ).fillna(0)
        analysis_results={
            "raw_data":df.to_dict('records'),
            "monthly_category": monthly_category.to_dict('records'),
            "spending_by_month": monthly_category.sum(axis=1).to_dict(),
            "budget_forecasts":forecast_budget(df),
          #  "spending_trends":analyze_spending_trends(df),
           # "category_trends":analyze_category_trends(df)
        }        
        return analysis_results
    
    
    except Exception as e :
        print(f"Error fetching budget analysis data: {e}")
        return {"Error fetching budget analysis data": str(e)}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
            
def analyze_spending_patterns(df):
    expenses = df[df['amount'] < 0].copy()
    expenses['amount'] = expenses['amount'].abs()
    
    category_totals=expenses.groundby('category')['amount'].agg(['sum', 'mean', 'count']).reset_index()
    total_spending=expenses['amount'].sum()
    category_totals['percentage'] = (category_totals['sum'] / total_spending * 100).round(2)

    top_categories=category_totals.sort_values(by='sum', ascending=False).head(5)
    return {
        "category_stats": category_totals.to_dict('records'),
        "top_categories": top_categories.to_dict('records'),
        "total_spending": total_spending
    }
def forecast_budget(df, forecast_months=3):
    if len(df) < 1:
        print("Not enough data for forecasting. Need at least 12 months of data.")
        return {"error": "Not enough data"}
        
    expenses = df[df['amount'] < 0].copy()
    expenses['amount'] = expenses['amount'].abs()
    monthly_expenses = expenses.groupby('month_year')['amount'].sum().reset_index()
    
    # Sort by date 
    monthly_expenses['month_year'] = pd.to_datetime(monthly_expenses['month_year'].astype(str))
    monthly_expenses = monthly_expenses.sort_values('month_year')
    
    # Preparing data for pytorch 
    values = monthly_expenses['amount'].values.astype(np.float32)
    if len(values) < 6:
        return {"error": "Not enough data for forecasting. Need at least 2 months of data."}

    scaler = MinMaxScaler(feature_range=(0, 1))
    values_scaled = scaler.fit_transform(values.reshape(-1, 1))
    
    # Create sequences
    def create_sequences(data, seq_length):
        xs, ys = [], []
        for i in range(len(data) - seq_length):
            x = data[i:i+seq_length]
            y = data[i+seq_length]
            xs.append(x)
            ys.append(y)
        return np.array(xs), np.array(ys)
     
    seq_length = 3
    X, Y = create_sequences(values_scaled, seq_length)
     
    # Convert to pytorch tensors
    X_tensor = torch.tensor(X, dtype=torch.float32)
    Y_tensor = torch.tensor(Y, dtype=torch.float32)
     
    # Create LSTM model
    class LSTMForecaster(nn.Module):
        def __init__(self, input_size, hidden_size=50, output_size=1):
            super(LSTMForecaster, self).__init__()
            self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
            self.linear = nn.Linear(hidden_size, output_size)
        
        def forward(self, x):
            x, _ = self.lstm(x)
            x = self.linear(x[:, -1, :])
            return x
    
    model = LSTMForecaster(input_size=1)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    epochs = 200

    for epoch in range(epochs):
        model.train()
        optimizer.zero_grad()
        y_pred = model(X_tensor)
        loss = criterion(y_pred, Y_tensor)
        loss.backward()
        optimizer.step()
    
    model.eval()
    forecasts = []
    
    # Use the last sequence as starting point
    current_seq = values_scaled[-seq_length:].reshape(1, seq_length, 1)
    current_seq_tensor = torch.tensor(current_seq, dtype=torch.float32)

    for _ in range(forecast_months):
        with torch.no_grad():
            next_pred = model(current_seq_tensor).numpy()
            forecasts.append(next_pred[0, 0])
        
        # Update sequence for the next prediction
        current_seq = values_scaled[-seq_length:].reshape(1, seq_length, 1)
        current_seq_tensor = torch.tensor(current_seq, dtype=torch.float32)
        print(current_seq_tensor.shape)
        print("This is the test final data\n", current_seq_tensor)

    return forecasts
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
# In your main block, add:
if __name__ == "__main__":
    print("Testing database connection...")
    if test_connection():
        # Add a test user ID
        test_user_id = "user_2xzv5Df6ctD6jlIyUvCVL9jv2wd"  # Replace with an actual user ID
        print(f"Fetching data for user: {test_user_id}")
        data = get_db_budget_analysis(test_user_id)
        print("Data retrieved:")
        print(data)  # Print the actual data