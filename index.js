const express = require ('express')
const dotenv = require ('dotenv')
const dbconnect = require ('./DB/dbconnect')
const cookieParser = require ('cookie-parser')
const cors = require('cors');
const path = require('path')

// For routes
const authRouter = require ('./Routes/authuser.route')
const messageRouter = require ('./Routes/message.route')
const userRouter = require ('./Routes/user.route')

// Socket
const {app,server}  = require  ('./Socket/socket')
 


dotenv.config()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/auth', authRouter)
app.use('/api/message', messageRouter)
app.use('/api/user', userRouter)

// to join frontend and backend
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve()
    app.use(express.static(path.join(__dirname, '/frontend/dist')))
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.send('Server is running successfully')
    })
}

//Database and server start

dbconnect().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at ${PORT}`)
    })
})