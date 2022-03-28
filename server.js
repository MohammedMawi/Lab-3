const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utilities/message')
const {userJoin, getCurrentUser} = require('./utilities/users')


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'public')));

const botname = '1720 Bot'

io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        // Welcomes user
    socket.emit('message', formatMessage(botname, 'Welcome!'));

    // Notifies when a user joins
    socket.broadcast.to(user.room).emit('message', formatMessage(botname, 'A user has joined the chat'));
    })
    
    // Notifies when a user leaves
    socket.on('disconnect', () =>{
        io.emit('message', formatMessage(botname,'A user has left the chat'));
    });

    //Listens for chat messgae
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('User',msg));
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port #${PORT}`));