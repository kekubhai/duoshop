import {sql} from '../config/db.js';
export async function getTransactionsbyUserId(req,res){
  try{
       const {userId} = req.params;
    const transaction=  await sql `
       SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`
       console.log(userId)
       console.log('internal server error')
       res.status(200).json(transaction)
      
      }catch(error){
          console.log("Error getting the transactions", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
    }
    export async function createTransaction(req, res)  {
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
    }
export async function deleteTransaction(){
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
}
export async function getTransactionSummary (req,res){
    try{
const {userId}=req.params;
const balanceResult=await sql `
SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`
const incomeResult =await sql `
SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0;`
const expenseResult=await sql `
SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0;` 
res.status(200).json({
    balanceResult: Number(balanceResult[0].balance),
    incomeResult: Number(incomeResult[0].income),
    expenseResult: Number(expenseResult[0].expense)
})
console.log("balanceResult", balanceResult[0].balance);
console.log("incomeResult", incomeResult[0].income);
console.log("expenseResult", expenseResult[0].expense);
    }catch(error){
        console.log("Error getting transaction summary", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export default {
    getTransactionsbyUserId,
    createTransaction,
    deleteTransaction,
    getTransactionSummary
};