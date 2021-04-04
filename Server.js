const express = require('express')
const app = express()
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000

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
        socket.broadcast.emit('user',name)
    });
    console.log('New user joinned');

    socket.on('event',(msg)=>{
        socket.broadcast.emit('event',msg)
    });

    socket.on('disconnect',(n)=>{
        socket.broadcast.emit('left',users[socket.id]);
    });

    
});
//npm run dev