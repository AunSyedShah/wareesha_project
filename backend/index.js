const express = require('express')
const ConnectDB = require('./config/db')
const cors = require('cors')
const app = express()
require('dotenv').config()

ConnectDB()

app.use(express.json())
app.use(cors())
const userRouter = require("./Routes/userRoutes")
const expoRouter = require("./Routes/expoRoutes")
const feedbackRouter = require("./Routes/feedbackRoutes")
const chatRouter = require("./Routes/chatRoutes")
app.use('/api/user',userRouter)
app.use('/api/expo',expoRouter)
app.use('/api/feedback',feedbackRouter)
app.use('/api/chat',chatRouter)




//testing
app.get("/",(req,res)=>{
    res.json({
        message:"Server is running"
    })
})


const PORT = process.env.port || 8000

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
