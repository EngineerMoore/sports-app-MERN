// dotenv must come before any files requiring env variables

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
/* mongoose is ODM for MongoDB */
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const path = require("path");
const http = require('http');
const socketio = require('socket.io');

const PORT = process.env.PORT || 8000;
const app = express();
const server = http.Server(app);


const io = socketio(server, {
  cors: {
    origin: '*'
  }
});





try {
  // connects to the external db
  mongoose.connect(process.env.MONGO_DB_CONNECTION)
  console.log('MongoDB connected')
} catch(error) {
  console.log(error);
}

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  connectedUsers[user] = socket.id;
})

app.use((req, res, next) => {
  // adding an io and connectedUsers property to all req that come in
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
})
app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..", "files")));
app.use(routes);

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})