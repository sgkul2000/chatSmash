const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const io = require('socket.io')(3000)

// middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());

const room = require('./routes/room');
// const chat = require('./routes/chat');

app.use('/api/room', room)
app.use('/api/chat', room)

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started at ${port}`)
});



const io = require('socket.io')(3000);

io.on('connection', socket => {
    console.log('user connected');
});