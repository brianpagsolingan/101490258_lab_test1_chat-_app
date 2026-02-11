const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage');
const User = require('./models/User');

app.use(cors());
const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3005',
        methods: ['GET', 'POST']
    }
});

const mongoURI = 'mongodb+srv://brianpagsolingan_db_user:RWSlyv5KdtIpoVcs@cluster0.z9askkx.mongodb.net/?appName=Cluster0';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const onlineUsers = {};

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({username, room}) => {
        socket.join(room);
        onlineUsers[username] = socket.id;
        console.log(`${username} joined room ${room}`);
    });

    // Handle group messages
    socket.on('chatMessage', async text => {

        const message = new GroupMessage({
            username: socket.username,
            room: socket.room,
            text
    });     await message.save();
        io.to(socket.room).emit('message', message);
    });

    // Handle private messages
    socket.on('privateMessage', async ({to, text}) => {
        const message = new PrivateMessage({
            sender: socket.username,
            receiver: to,
            text
        });
        await message.save();
        const toSocketId = onlineUsers[to];

        if(receiverSocket) {
            io.to(receiverSocket).emit('privateMessage', message);
        }
    });

    // Handle Typing indicator
    socket.on('typing', () => {
        socket.to(socket.room)
        .emit('typing', `${socket.username} is typing...`);
    });
    
    // Leave room
    socket.on('leaveRoom', () => {
        socket.leave(socket.room);
        delete onlineUsers[socket.username];
        console.log(`${socket.username} left room ${socket.room}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        delete onlineUsers[socket.username];
    });
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));