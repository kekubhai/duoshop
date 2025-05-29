import express from 'express'
import { sql } from '../config/db.js'
import {getTransactionsbyUserId , createTransaction, deleteTransaction, getTransactionSummary } from '../controllers/transactionsControllers.js'
const router=express.Router()

router.get("/:userId",getTransactionsbyUserId)
router.delete("/:id",deleteTransaction)
router.get("/summary/:userId",getTransactionSummary)
router.post("/", createTransaction);
export default router