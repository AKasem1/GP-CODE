require("dotenv").config()
const express = require('express')
const { Server } = require("socket.io");
const chatRoomRoutes = require('./routes/chatRoom');
const chatMessageRoutes = require('./routes/chatMessage');
const {default: mongoose} = require('mongoose')
const userRoute = require("./routes/userRoute")
const reviewRoute = require("./routes/reviewRoute")
const bookRoute = require("./routes/bookRoute")
const recommendRoute = require("./routes/recommenderRoute")
mongoose.set('strictQuery', false);
//express app
const app = express();
//middlewares
//passing all coming requests to json
app.use(express.json())

//routes
app.use('/newreader', userRoute)
app.use('/newreader', reviewRoute)
app.use('/newreader', bookRoute)
app.use('/newreader', recommendRoute)
app.use("/newreader/room", chatRoomRoutes);
app.use("/newreader/message", chatMessageRoutes);
//Connect to the database
const server = mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    //listen for requests
    app.listen(process.env.PORT, () => {
        console.log("connected to db & listening on port:", process.env.PORT)
    });
})
.catch((err)=>{console.log(err)})

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3100",
      credentials: true,
    },
  });
  global.onlineUsers = new Map();

  const getKey = (map, val) => {
    for (let [key, value] of map.entries()) {
      if (value === val) return key;
    }
  };
  
  io.on("connection", (socket) => {
    global.chatSocket = socket;
  
    socket.on("addUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.emit("getUsers", Array.from(onlineUsers));
    });
  
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      const sendUserSocket = onlineUsers.get(receiverId);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("getMessage", {
          senderId,
          message,
        });
      }
    });
  
    socket.on("disconnect", () => {
      onlineUsers.delete(getKey(onlineUsers, socket.id));
      socket.emit("getUsers", Array.from(onlineUsers));
    });
  });
  