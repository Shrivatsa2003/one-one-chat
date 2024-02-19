const express = require('express')
const cors = require('cors')
const app = express();
const socket = require('socket.io')
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messagesRoute');
require("dotenv").config();
const { connect } = require('./connect');
app.use(express.json()) 
app.use(cors())
app.use('/api/auth',userRoutes)
app.use("/api/messages", messageRoutes);


const server = app.listen(process.env.PORT,()=>{
    console.log(`app is listening to ${process.env.PORT}`);
})

const io = socket(server,{
    cors:{
        origin:'http://localhost:3000',
        credentials:true,
    }
})
global.onlineUsers = new Map();

io.on('connection',(socket)=>{
    global.chatSocket = socket,

    socket.on('add-user',(userId)=>{
        onlineUsers.set(userId,socket.id)
    })
    socket.on('send-msg',(data)=>{

        const sendUserSocket =  onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-recieve',data.message)
        }
    })
})