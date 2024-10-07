// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose=require('mongoose');
const fs = require('fs');
const signup=require('./routes/user');
const auth=require('./routes/auth');
// const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost:27017/chat')
.then(()=>console.log(`connected to database`))

// Serve static files (for client-side)
app.use(express.static('../public'));
app.use(express.json());


app.use('/signup',signup);
app.use('/',auth);

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Expect the client to send a username
    socket.on('set username', (username) => {
        socket.username = username;
        console.log(`${username} connected`);

        // Send the chat history to the new user
        socket.emit('chat history', chatHistory);
    });

    // Handle incoming messages
    socket.on('chat message', (msg) => {
        const messageData = {
            id: socket.id,
            username: socket.username || 'Anonymous',
            message: msg,
            timestamp: new Date()
        };

        // Add message to chat history
        chatHistory.push(messageData);

        // Save chat history to the file
        fs.writeFileSync(CHAT_FILE, JSON.stringify(chatHistory, null, 2));

        // Broadcast message to all clients
        io.emit('chat message', messageData);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.username || 'Anonymous');
    });
});
app.get('/api/users', (req, res) => {
  // to-do
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports=server;


