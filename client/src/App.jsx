import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { io } from 'socket.io-client';
//this is the socket.io client and io is the name of client
import use from 'react';
import { set } from 'mongoose';

const App =()=> {
  const socket = useMemo(()=>io('http://localhost:5000'), []);
  
  const [socketId, setsocketId] = useState("");
  const [message, setMessage] = useState("");
  //we define a socket instance and pass the server url as an argument
  
  
  const handleSubmit= (e)=>{
    e.preventDefault();
    console.log(message);
    //in order to send a message you use emit
   
    //socket.method("event name", data)
    socket.emit("message", message);
    console.log("message sent");
    setMessage("");
  }
  
  
  useEffect(()=>{
    socket.on("connect", ()=>{
      setsocketId(socket.id);
      console.log(`connected ${socket.id}`);
    })
     socket.on("forward-message", (data)=>{
        console.log(data.message);
        
      });
  }, [])


  return (
   
     <Container>
        <Typography variant ="h3" component="h2">
          Welcome to the AccioChat Client App
        </Typography>
        <Typography variant ="h5" component="h2">
          socket Id : {socketId}
      </Typography>


    <form onSubmit = {handleSubmit}>
      <TextField onChange={(e)=>setMessage(e.target.value)} id="outlined-basic" label="Type a message" variant="outlined" />
      <Button type="submit" variant="contained" color="primary">
        Send
      </Button>
    </form>

     </Container>
     
  
     )}

export default App
