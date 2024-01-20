const WebSocket = require('ws');

//CesareDev: Custom Socket API
class Socket {

    //---------------------------------------
    // Constructor
    //---------------------------------------

    constructor(server) {
        //CesareDev: WebSocket connection event
        this.wss = new WebSocket.Server({ server });
        this.clients = new Set();
        this.connection();
    }

    //---------------------------------------
    // Connection
    //---------------------------------------

    connection() {
        this.wss.on('connection', (ws) => {
            console.log('[Socket]: \x1b[32mClient connected\x1b[0m');
            this.clients.add(ws);

            ws.on('close', () => {
                console.log('[Socket]: \x1b[31mClient disconnected\x1b[0m');
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
        database.find({}, (err, docs) => {
            if (err) {
                this.sendMessage({
                    success: false,
                    message: 'Database error',
                    body: err
                });
            }
            else if (docs) {
                this.sendMessage({
                    success: true,
                    message: 'Updated quests',
                    quests: docs
                });
            }
        });
    }
}

module.exports = { Socket };