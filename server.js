import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import createGameState from "./public/globals/game.js";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static("./public"));
const server = http.createServer(app);
const io = new Server(server);

let game = createGameState();
let interval = undefined;

io.on("connection", (socket) => {
    console.log("novo cliente conectado! id: ", socket.id);

    game.addPlayer(socket.id);
    let playerAdmin = game.getAdmin();
    socket.emit("setup", game);
    socket.broadcast.emit("playerJoined", game.state.players[socket.id]);
    socket.broadcast.emit("playerAdmin", playerAdmin);
    socket.emit("playerAdmin", playerAdmin);

    socket.on("initGame", (delayMs) => {
        clearInterval(interval);
        game.state.fruits = {};
        interval = setInterval(() => {
            game.addFruit(randomUUID());
            console.log("spawn fruit");
            socket.emit("updateFruits", game.state.fruits);
            socket.broadcast.emit("updateFruits", game.state.fruits);
        }, delayMs);
        console.log(game.state.fruits);
    });

    socket.on("playerMoved", (command) => {
        if (game.state.players[command.playerId]) {
            game.state.players[command.playerId].x = command.x;
            game.state.players[command.playerId].y = command.y;
        }
        socket.broadcast.emit("otherPlayerMoved", command);
    });

    socket.on("disconnect", () => {
        game.removePlayer(socket.id);
        socket.broadcast.emit("playerDisconnected", socket.id);
    });
});

server.listen(3333, "0.0.0.0", () => console.log("rodando na porta 3333"));