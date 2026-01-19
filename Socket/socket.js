const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
       origin:["https://flowchat-nine.vercel.app/"], // <-- replace with your deployed frontend URL
       methods:["GET","POST"],
       credentials:true
    }
})

const getReceiverSocket = (receiverId) =>{
    return userSocketmap[receiverId];
}

const userSocketmap={}; //{userID, socketId}
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;

    if(userId !== "undefined") userSocketmap[userId] = socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketmap))
    socket.on("disconnect",()=>{
        delete userSocketmap[userId],
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    })
})


module.exports = { app , io , getReceiverSocket , server}