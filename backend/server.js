import express from 'express';
import { configDotenv } from 'dotenv';
import {sql} from './config/db.js'
import rateLimit from './config/upstash.js';

const app=express();
configDotenv();
app.use(rateLimit)
app.use(express.json())
//My simple middlesware 
// app.use((req,res,next)=>{
//     console.log("Hey we hit a request", req.method)
//     next()
// })               
app.get('/', (req,res)=>{
    res.send("Hello Anirban Here it is working fine")

})
app.get("/api/transactions/:userId",async(req,res)=>{
    try{
     const {userId} = req.params;
  const transaction=  await sql `
     SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`
     console.log(userId)
     res.status(200).json(transaction)
    
    }catch(error){
        console.log("Error getting the transactions", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
app.delete("/api/transactions/:id", async (req,res)=>{
    try{
      const {id}=req.params;
      if(isNaN(parseInt(id))){
        return res.status(400).json({ error: "Invalid transaction ID" });
      }
      const result =await sql `DELETE FROM transactions WHERE id = ${id} RETURNING *;`
      if(result.length===0){
        return res.status(404).json({ error: "Transaction not found" });
      }
        res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });
    }
    catch(error){
        console.log("Error deleting transaction", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
app.get("/api/transactions/summary/:userId",async (req,res)=>{
    try{
const {userId}=req.params;
const balanceResult=await sql `
SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`
const incomeResult =await sql `
SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0;`
const expenseResult=await sql `
SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0;` 

//res.status(200).json(summary);
res.status(200).json({
    balanceResult: balanceResult[0].balance,
    incomeResult: incomeResult[0].income,   
    expenseResult: expenseResult[0].expense
})
    }catch(error){
        console.log("Error getting transaction summary", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
app.post("/api/transactions", async (req, res) => {
    try {
        const { title, user_id, category,amount } = req.body;
        if (!title || !user_id|| !category || amount ===undefined) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const transaction = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
             VALUES (${user_id}, ${title}, ${amount}, ${category})
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