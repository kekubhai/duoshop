import express from 'express';
import { configDotenv } from 'dotenv';
import {sql} from './config/db.js'
const app=express();
configDotenv();
app.use(express.json())
//My simple middlesware 
// app.use((req,res,next)=>{
//     console.log("Hey we hit a request", req.method)
//     next()
// })
app.get('/', (req,res)=>{
    res.send("Hello Anirban Here it is working fine")

})

app.post("/api/transactions", async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;
        if (!title || !amount || !user_id || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const transaction = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${title}, ${amount}, ${category}, ${user_id})
            RETURNING *;
        `;
        console.log(req.body);
        console.log(transaction);
        res.status(201).json(transaction[0]); // Return the first transaction object
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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

// app.listen(process.env.PORT || 5001, ()=>{
//     console.log(`Server is running at port ${process.env.PORT}`)
// })
 initDB().then (()=>{
    app.listen(process.env.PORT || 5001, ()=>{
        console.log(`Server is running at port ${process.env.PORT || 5001}`)
    }  )
 })