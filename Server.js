const express = require('express')
const app = express()
const http = require('http').createServer(app)
const PORT = process.env.PORT || 8000

http.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})
app.use(express.static(__dirname + '/static'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})

const users = {}
//Soket
const io = require('socket.io')(http)
io.on('connection',(socket)=>{
    socket.on('user',(name)=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name)
        console.log(`New user joinned ${name} : ${socket.id}`);
    });

    socket.on('s_event',(msg)=>{  //send event accept here
        socket.broadcast.emit('b_event',msg) //brodcast event
    });

    socket.on('disconnect',(n)=>{
        socket.broadcast.emit('left',users[socket.id]);
    });
});
//npm run dev
