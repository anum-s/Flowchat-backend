const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
       origin: process.env.NODE_ENV === 'production'?
        process.env.FRONTEND_URL || '*': 'http://localhost:5173',
       credentials:true ,
       methods:["GET","POST"]
    }
})

const userSocketmap={}; //{userID, socketId}

const getReceiverSocket = (receiverId) =>{
    return userSocketmap[receiverId];
};


io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;

    if(userId) 
        userSocketmap[userId] = socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketmap))

    socket.on("disconnect",()=>{
        if(userId) {
        delete userSocketmap[userId];}
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    });
});


module.exports = { app , io , getReceiverSocket , server}