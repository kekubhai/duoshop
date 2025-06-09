def get_db_connection():
    try :
        #getting the databse connection 
        db_url=os.getenv('DATABASE_URL')
        if not db_url:
            raise ValueError("DATABASE_URL environment variable is not set.")
        conn=pycopg.connect(
            db_url,
            cursor_factory=RealDictCursor,
            sslmode='require'
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")
    