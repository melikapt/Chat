// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const signup = require('./routes/user');
const auth = require('./routes/auth');
const message = require('./routes/message');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const config=require('config');

if(!config.get("jwtPrivateKey")){
    console.log(`FATAL ERROR!`);
    process.exit(1);
}

mongoose.connect('mongodb://localhost:27017/chat')
    .then(() => console.log(`connected to database`))

// Serve static files (for client-side)
app.use(express.static('../public'));
app.use(express.json());
app.use(cors());


app.use('/signup', signup);
app.use('/', auth);
app.use('/api', message);

let onlineUsers = [];

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Expect the client to send a username
    socket.on('join', (username) => {
        socket.username = username;
        console.log(`${username} joined to public room`);
        socket.broadcast.emit('online users', username);
        socket.emit('user history', onlineUsers);

        // Send the chat history to the new user
        socket.emit('chat history');
        onlineUsers.push(username);
    });

    socket.on('privateRoom', (room, username) => {
        socket.join(room);
        socket.in(room).emit('welcoming', username, room)
        console.log(`${username} joined to ${room}`);

        socket.broadcast.emit('online users', username);
        socket.emit('user history', onlineUsers);

        socket.emit('chat history');

        onlineUsers.push(username);
    })

    // Handle incoming messages
    socket.on('chat message', (msg, room) => {
        // Broadcast message to all clients
        const messageData = {
            username: msg.username,
            message: msg.message,
            timestamp: msg.createdAt
        }

        if (!room) {
            io.emit('chat message', messageData);
        }
        if (room) {
            io.in(room).emit('chat message', messageData)
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.username || 'Anonymous');
        const index = onlineUsers.indexOf(socket.username)
        onlineUsers.splice(index, 1);
    });
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = server;


