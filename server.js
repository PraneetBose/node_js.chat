// server.js

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('a user connected');

    // Handle username submission
    socket.on('setUsername', (username) => {
        socket.username = username;
        io.emit('system message', `${username} has joined the chat`);
    });

    // Handle chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', { username: socket.username, message: msg });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (socket.username) {
            io.emit('system message', `${socket.username} has left the chat`);
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
