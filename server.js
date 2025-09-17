const express = require("express");
const http = require("http")
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static("./public"));
const server = http.createServer(app);
const io = new Server(server);

let players = {}

io.on("connection", (socket) => {
    console.log("novo cliente conectado! id: ", socket.id);

    players[socket.id] = {x: Math.floor(20 * Math.random()) * 32, y: Math.floor(20 * Math.random()) * 32};

    socket.emit("newPlayer", players);

    socket.broadcast.emit("playerJoined", {id: socket.id, ...players[socket.id]});

    socket.on("move", (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y
            
            socket.broadcast.emit("playerMoved", {id: socket.id, ...players[socket.id]});
        }
    });

    socket.on("disconnect", () => {
        console.log("cliente desconectado! id: ", socket.id);
        delete players[socket.id];
        socket.broadcast.emit("playerDisconnected", socket.id);
    });
});

server.listen(3333, "0.0.0.0", () => console.log("rodando na porta 3333"));