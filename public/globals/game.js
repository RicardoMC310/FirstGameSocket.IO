export default function createGameState() {
    let state = {
        players: {},
        fruits: {},
        screen: { width: 640, height: 640 }
    }

    const observers = [];

    function subscripe(observerFunction) {
        observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    function addPlayer(playerId) {
        let p = {
            playerId,
            x: Math.floor(20 * Math.random()) * 32,
            y: Math.floor(20 * Math.random()) * 32,
            score: 0
        }

        state.players[playerId] = p;
    }

    function removePlayer(playerId) {
        delete state.players[playerId];
    }

    function setState(newState) {
        Object.assign(state, newState);
    }

    function playerMoved(command) {
        let player = state.players[command.playerId];

        let actions = {
            ArrowDown() {
                if (player.y + 32 < state.screen.height) {
                    player.y += 32;
                }
            },
            ArrowUp() {
                if (player.y > 0) {
                    player.y -= 32;
                }
            },
            ArrowLeft() {
                if (player.x > 0) {
                    player.x -= 32;
                }
            },
            ArrowRight() {
                if (player.x + 32 < state.screen.width) {
                    player.x += 32;
                }
            }
        }

        if (actions[command.keyEvent]) actions[command.keyEvent]();
        let commandObserver = {
            playerId: command.playerId,
            x: state.players[command.playerId].x,
            y: state.players[command.playerId].y,
            score: state.players[command.playerId].score
        };
        notifyAll(commandObserver);
    }

    function getAdmin() {
        const entries = Object.entries(state.players);
        if (entries.length == 0) return null;

        const [playerId, value] = entries[0];
        return { playerId, ...value };
    }

    function addFruit(fruitId) {
        let fruit;
        let collision;

        do {
            fruit = {
                x: Math.floor(20 * Math.random()) * 32,
                y: Math.floor(20 * Math.random()) * 32,
            };

            collision = Object.values(state.fruits)
                .some(f => f.x === fruit.x && f.y === fruit.y);

        } while (collision);

        state.fruits[fruitId] = fruit;
    }

    function checkCollisionFruit(command) {
        let p = state.players[command.playerId];

        for (const fruitId in state.fruits) {
            let f = state.fruits[fruitId];
            if (p.x == f.x && p.y == f.y){
                return fruitId;
            }
        }
        
        return undefined;
    }

    return {
        state,
        addPlayer,
        removePlayer,
        setState,
        playerMoved,
        subscripe,
        getAdmin,
        addFruit,
        checkCollisionFruit
    }
}