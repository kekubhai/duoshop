import express from 'express';
const app=express();
app.get('/', (req,res)=>{
    res.send("Hello Anirban Here it is working fine")

})

app.listen(5001, ()=>{
    console.log("Server is running at port 5000")
})