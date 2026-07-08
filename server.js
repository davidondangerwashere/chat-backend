const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, { 
  cors: { origin: "*" } 
});

let waitingUser = null;

io.on('connection', (socket) => {
  socket.on('join', (peerId) => {
    if (waitingUser && waitingUser !== socket) {
      socket.emit('match', waitingUser.peerId);
      waitingUser.emit('match', peerId);
      waitingUser = null;
    } else {
      socket.peerId = peerId;
      waitingUser = socket;
    }
  });

  socket.on('disconnect', () => {
    if (waitingUser === socket) waitingUser = null;
  });
});

// Render এর দেওয়া পোর্টে রান হবে
http.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
