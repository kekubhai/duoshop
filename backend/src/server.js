import express from 'express';
import { configDotenv } from 'dotenv';
import {sql} from './config/db.js'
import transactionsRoute from './routes/transactionsRoute.js';
import rateLimiter from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
const app=express();
configDotenv();
//app.use(rateLimiter)
app.use(express.json())


async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS transactions(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                category VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_DATE
            )
        `;
           await sql`
            CREATE TABLE IF NOT EXISTS users(
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                profile_image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_DATE
            )
        `;
        
        console.log("Database initialised succesfully");
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
}
app.get("/", (req, res) => {
    res.send("Welcome to the Expense Tracker API");
});
app.use("/api/transactions", transactionsRoute)
app.use("/api/auth", authRoutes)
console.log(`Server is running at port ${ 5001}`)
 initDB().then (()=>{
    app.listen(process.env.BASE || 5001, ()=>{
        console.log(`Server is running at port ${process.env.BASE_URL|| 5001}`)

    }  )
 })