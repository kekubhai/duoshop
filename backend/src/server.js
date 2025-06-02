import express from 'express';
import { configDotenv } from 'dotenv';
import {sql} from './config/db.js'
import transactionsRoute from './routes/transactionsRoute.js';
import rateLimiter from './middleware/rateLimiter.js';
const router=express.Router()
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
console.log(`Server is running at port ${process.env.PORT}`)
 initDB().then (()=>{
    app.listen(process.env.PORT || 5001, ()=>{
        console.log(`Server is running at port ${process.env.PORT || 5001}`)
    }  )
 })