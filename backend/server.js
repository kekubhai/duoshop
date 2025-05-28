import express from 'express';
import { configDotenv } from 'dotenv';
import { sql } from './config/db';
const app=express();

configDotenv();

app.get('/', (req,res)=>{
    res.send("Hello Anirban Here it is working fine")

})

app.listen(process.env.PORT || 5001, ()=>{
    console.log(`Server is running at port ${process.env.PORT}`)
})