const express = require ('express')
const dotenv = require ('dotenv')
const dbconnect = require ('./DB/dbconnect')
const cookieParser = require ('cookie-parser')
const cors = require('cors');

// For routes
const authRouter = require ('./Routes/authuser.route')
const messageRouter = require ('./Routes/message.route')
const userRouter = require ('./Routes/user.route')

// Socket
const {app,server}  = require  ('./Socket/socket')

// const __dirname = path.resolve(); // C.D


dotenv.config()
const PORT = process.env.PORT

app.use(cors({
  origin: "http://localhost:5173", // <-- replace with your deployed frontend URL
  credentials: true
}))

app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/auth', authRouter)
app.use('/api/message', messageRouter)
app.use('/api/user', userRouter)

//CODE FOR DEPLOYMENT 
// to join frontend and backend
// app.use(express.static(path.join(__dirname,"/frontend/dist")))

// app.get("*",(req,res)=>{
//     res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
// })

app.get('/',(req,res)=>{
    res.send("server is running successfully")
})

//Database and server start

dbconnect().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at ${PORT}`)
    })
})