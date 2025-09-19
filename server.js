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

    socket.emit("setup", {...game});
    socket.broadcast.emit("playerJoined", game.state.players[socket.id]);
    io.emit("playerAdmin", playerAdmin);

    socket.on("initGame", (delayMs) => {
        clearInterval(interval);
        interval = undefined;
        game.state.fruits = {};
        io.emit("updateFruits", {...game.state.fruits});

        delayMs = Math.max(1000, Math.min(10000, delayMs));

        interval = setInterval(() => {
            if (Object.keys(game.state.fruits).length >= 400) {
                clearInterval(interval);
                interval = undefined;
                return;
            }

            game.addFruit(randomUUID());
            io.emit("updateFruits", { ...game.state.fruits });
        }, delayMs);
        
        for (const playerId in game.state.players) {
            game.state.players[playerId].score = 0;
            io.emit("updateScore", playerId, game.state.players[playerId].score);
        }
    });

    socket.on("playerMoved", (command) => {
        if (game.state.players[command.playerId]) {
            game.state.players[command.playerId].x = command.x;
            game.state.players[command.playerId].y = command.y;
        }
        socket.broadcast.emit("otherPlayerMoved", command);

        let returnCollision = game.checkCollisionFruit({playerId: command.playerId});
        if (returnCollision) {
            delete game.state.fruits[returnCollision];
            game.state.players[command.playerId].score += 1;
            io.emit("updateScore", command.playerId, game.state.players[command.playerId].score);
            io.emit("updateFruits", {...game.state.fruits});
        }
    });

    socket.on("disconnect", () => {
        game.removePlayer(socket.id);
        socket.broadcast.emit("playerDisconnected", socket.id);

        if (Object.keys(game.state.players).length == 0) {
            clearInterval(interval);
            interval = undefined;
            game.state.fruits = {};
            io.emit("updateFruits", {...game.state.fruits});
        }
    });
});

server.listen(3333, "0.0.0.0", () => console.log("rodando na porta 3333"));