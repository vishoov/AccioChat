import express from 'express';
const app = express();
import {createServer} from 'http';
//to implement socket.io on top of http


const server = createServer(app);

//secure server using handshake
import {Server} from 'socket.io';
//socket.io's server instance is used for creating a new connection
import cors from 'cors';

//setting up socket.io server on top of http server
//along with implementation of cors for server protection
const io = new Server(server, {
    cors:{
        origin:'*', //allow all origins
        methods: ["GET", "POST"]
    }
});

//socket.io's middleware for implementing the handshake
io.use((socket, next)=>{
    next();
})

//socket.io's connection event
io.on('connection', (socket)=>{
    console.log(`a user has been connected ${socket.id}`);

    socket.on("message", (data)=>{
        console.log(data);
        //broadcasting the message to all the clients
        socket.to(data.room).emit("forward-message", {message:data.message});
    })

    socket.on("join-room", (RoomName)=>{
        socket.join(RoomName.room);
        console.log(`joined room ${RoomName.room}`);
    });

    socket.on("disconnect", ()=>{
        console.log(`a user has been disconnected ${socket.id}`);
    })
   

})


// app.use(cors())

//DOT ENV
import dotenv from 'dotenv';
dotenv.config();

app.get("/", (req, res)=>{
    res.send("Hello World");
});

const port = process.env.PORT || 5000;

server.listen(port, ()=>{
    try{
    console.log(`Server is running on port ${port}`);
    }catch(err){
        console.log(err);
    }
});