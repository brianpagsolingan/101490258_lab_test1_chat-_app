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
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
const server = http.createServer(app);

// test endpoint
app.get('/', (req, res) => {
    res.send('Server is running');
});

const io = socketio(server, {
    cors: {
        origin: 'http://localhost:5173',
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
        socket.username = username;
        socket.room = room;
        socket.join(room);
        
        onlineUsers[username] = socket.id;
        console.log(`${username} joined room ${room}`);
    });

    // Handle group messages
    socket.on('chatMessage', async text => {
        try{
            const message = new GroupMessage({
            from_user: socket.username,
            room: socket.room,
            message: text,
            date_sent: new Date().toLocaleString()
    });     await message.save();
        io.to(socket.room).emit('message', message);
        } catch(err) {
            console.error('Error saving group message:', err);

        }
    });
        

    // Handle private messages
    socket.on('privateMessage', async ({to, text}) => {
        try{
            const message = new PrivateMessage({
            from_user: socket.username,
            to_user: to,
            message: text,
            date_sent: new Date().toLocaleString()
        });
        await message.save();
        
        const receiverSocket = onlineUsers[to];
        if(receiverSocket) {
            io.to(receiverSocket).emit('privateMessage', message);
        }

        }catch(err) {
            console.error('Error saving private message:', err);
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
        console.log(`${socket.username} left room ${socket.room}`);
        socket.room = null;
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        delete onlineUsers[socket.username];
    });
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));