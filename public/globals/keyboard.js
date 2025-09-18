export default function createKeyboardListener(playerId, document) {
    document.addEventListener("keydown", event => {
        let keyEvent = event.key;

        const command = {
            playerId,
            keyEvent
        }

        notifyAll(command);
    });

    let state = {
        observers: []
    }

    function subscripe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    return {
        subscripe
    }
};