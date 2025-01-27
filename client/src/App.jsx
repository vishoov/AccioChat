import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { io } from 'socket.io-client';
//this is the socket.io client and io is the name of client
import use from 'react';
import { set } from 'mongoose';

const App =()=> {
  const socket = useMemo(()=>io('http://localhost:5000'), []);
  
  const [socketId, setsocketId] = useState("");
  const [message, setMessage] = useState("");
  //we define a socket instance and pass the server url as an argument
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  //this would be used for sending messages to a specific room 
  
 const joinRoom = (e)=>{
  e.preventDefault()
  console.log({room}, " joined");
  socket.emit("join-room", {room})
  setRoom("");
 }


  const handleSubmit= (e)=>{
    e.preventDefault();
    console.log({message, room});
    //in order to send a message you use emit
   
    //socket.method("event name", data)
    socket.emit("message", {message, room});
    console.log("message sent");
    setMessage("");
  }
  
  
  useEffect(()=>{
    socket.on("connect", ()=>{
      setsocketId(socket.id);
      console.log(`connected ${socket.id}`);
    })
     socket.on("forward-message", (data)=>{
        // console.log(data.message);
        setMessages((messages)=>[...messages, data.message]);
        
      });

      return ()=>{
        socket.disconnect();
        
      }

  }, [])


  return (
   
     <Container>



        <Typography variant ="h3" component="h2">
          Welcome to the AccioChat Client App
        </Typography>
        <Typography variant ="h5" component="h2">
          socket Id : {socketId}
      </Typography>

      <form onSubmit = {joinRoom}>
        
        <TextField onChange = {(e)=>setRoom(e.target.value)} label="Room Name" variant="outlined"/>
        <Button type = "submit" variant="contained" color="primary">
          Join Room 
          </ Button>

      </form>

    <form onSubmit = {handleSubmit}>
      <TextField onChange={(e)=>setMessage(e.target.value)} id="outlined-basic" label="Type a message" variant="outlined" />
      <TextField onChange={(e)=>setRoom((e.target.value))} type="text" label="Room" variant="outlined"/> 
      <Button type="submit"  variant="contained" color="primary">
        Send
      </Button>
    </form>

    <Stack>
      {messages.map((message, index)=>(
        <Typography key={index} variant="h6" component="div" gutterBottom >
          {message}
        </Typography>
      ))}
    </Stack>




     </Container>
     
  
     )}

export default App
