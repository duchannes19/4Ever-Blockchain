const WebSocket = require('ws');

//CesareDev: Socket custom API
class Socket {

    //---------------------------------------
    // Constructor
    //---------------------------------------

    constructor(server) {
        //CesareDev: WebSocket connection event
        this.wss = new WebSocket.Server({ server });
        this.clients = new Set();
    }

    //---------------------------------------
    // Connection
    //---------------------------------------

    connection() {
        this.wss.on('connection', (ws) => {
            console.log('Client connected');
            this.clients.add(ws);

            ws.on('close', () => {
                console.log('Client disconnected');
                this.clients.delete(ws);
            });
        });
    }

    //---------------------------------------
    // Message
    //---------------------------------------

    sendMessage(message) {
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    sendDatabase(database) {
        //CesareDev: if successfully updated the quest send, via websocket,
        //           an event to the clients containing the updated entry
        this.database.find({}, (err, docs) => {
            if (err) {
                this.socketSendMessage({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            }
            else if (docs) {
                this.socketSendMessage({
                    success: true,
                    message: 'Updated quests',
                    quests: docs
                });
            }
        });
    }
}

module.exports = { Socket };