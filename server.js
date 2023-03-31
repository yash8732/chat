const express = require('express');
const app = express();
const path = require('path')
const cookieParser = require("cookie-parser")
const server = require("http").createServer(app)
const mongoose = require("mongoose");
const router = require('./router/router');
const roomModel = require("./model/rooms")
const io = require("socket.io")(server, {
    cors: {
        origin: "* "
    }
})
// const users = {};

mongoose.connect("mongodb://127.0.0.1:27017/chat")
    .then(() => console.log("Mongoooo Connected"))
    .catch((err) => console.log(err.message));


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.urlencoded())
app.use(cookieParser())
app.use(express.json())
app.use("/", router);


io.on("connection", socket => {
    console.log("connected");
    // console.log(users);

    socket.on("join_room", roomId => {
        room = roomId;
        socket.join(roomId)
        // console.log("room joined ", roomId);
    })

    socket.on("new_user_joined", async ({ roomId, userName }) => {
        // console.log("new user: ", userName);
        const room = await roomModel.findById(roomId)
        room.messages.forEach(msg => {
            if(msg.userName != userName){
                console.log("msg:", msg);
            msg.seen = true}
            socket.emit("show_messages", msg)
        })
        room.save()
        // users[socket.id] = userName;
        // socket.broadcast.to(roomId).emit("user_joined", userName);
    })

    socket.on("send", async ({ message, roomId, userName }) => {
        let room = null;
        let msg = null;
        try {
            // console.log("room:",room)
            room = await roomModel.findById(roomId)
            // console.log(room);
            msg = room.messages.push({ message, userName })
            // msgId = room.messages[msg-1]._id;
            console.log("msg:", msg);
            // console.log(room);
            await room.save()
        } catch (error) {
            console.log(error.message);
        }
        // console.log(room.messages);
        // console.log(`message: ${message} from: ${userName}`);
        // console.log("room:",room);
        socket.broadcast.to(roomId).emit("recieve", { message: message, name: userName, roomId: roomId, msg: msg })
    })

    socket.on("seen", async (data) => {
        const room = await roomModel.findById(data.roomId)
        console.log(data.msg);
        room.messages[data.msg - 1].seen = true
        // console.log(msg);
        await room.save()
    })

    socket.on("user_left", ({ roomId, userName }) => {

        socket.on("disconnect", (message) => {
            console.log("dis:", userName);
            // socket.broadcast.to(roomId).emit("left", userName)
        })
    })
})

server.listen(5000, () => console.log("listening..."))