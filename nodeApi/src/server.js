require('dotenv').config();

const { Server } = require('socket.io');
const cors = require('cors');
const express = require('express');
const http = require('http')
const morgan = require('morgan');

const redisHandlers = require('./socket_events/redisHandler');
const tiDbHandlers = require('./socket_events/tiDbHandler');


// Settings 

const app = express();
app.set('port', process.env.PORT || 5000);

const server = http.createServer(app);
const io = new Server(server, {
    transports: ["websocket", "polling"],
    cors: {
      origin: '*',
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders:"*",
    }
  });


// Middlewares
app.use(morgan('dev'));
app.use(cors())
app.use(express.json());

// Routes

app.get('/', (req, res) => {
  console.log('Hello from App Engine')
  res.send('Hello from App Engine');
})



//Sockets events

const onConnection = (socket) => {
    console.log('Socket connected')
    redisHandlers(io, socket)
    tiDbHandlers(io, socket);

}

io.on('connection', onConnection);

io.on('connect_failed', () => {
  console.log('Connection failed')
})


server.listen(app.get('port'), () => {
    console.log(`Sever on port ${app.get('port')}`);
})