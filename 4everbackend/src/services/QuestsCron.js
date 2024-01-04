const cron = require('node-cron');
const WebSocket = require('ws');

class QuestsCron {

    constructor(database, clients) {
        this.database = database
        this.clients = clients;
    }

    resendQuests() {
        // Send the database to the clients with a websocket
        this.database.find({}, (err, docs) => {
            if (err) {
                this.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            success: false,
                            message: 'Quests not found',
                            body: JSON.stringify(err)
                        }));
                    }
                });
            }
            else if (docs) {
                this.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            success: true,
                            message: 'Quests found',
                            quests: docs
                        }));
                    }
                });
            }
        });
    }

    async manageQuests() {
        // Andrea: Implement your logic to execute quests here
        console.log('Managing quests...');

        // Andrea: Get all the active quests from the database
        const activeQuests = await this.database.find({});

        // Andrea: Check if there is any quest that starts today
        const today = new Date();
        const todayStartQuests = activeQuests.filter((quest) => {
            const questDate = new Date(quest.startDate);
            return questDate.getDate() === today.getDate() && questDate.getMonth() === today.getMonth() && questDate.getFullYear() === today.getFullYear();
        });

        // Andrea: If there are quests that start today, schedule a cron job for each of them to start at 8:00 AM

        if (todayStartQuests.length > 0) {
            todayStartQuests.forEach((quest) => {
                cron.schedule('0 8 * * *', () => {
                    // Andrea: This function will be executed once at 8:00 AM of the current day
                    console.log('Starting quest:', quest.name);
                    // Andrea: The quest has started, so we can update it from the active quests and set the status to true in questRegistered in the database
                    this.database.update({ _id: quest._id }, { $set: { questRegistered: true } }, {}, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    }); 
                    this.resendQuests();
                }, {
                    scheduled: false, // Andrea: Don't start immediately
                    timezone: 'Europe/Rome', // Andrea: Set the timezone to Europe/Rome
                });
        
                // Andrea: Schedule the job to start
                cron.getTasks({ timezone: 'Europe/Rome' })['0 8 * * *'].start();
            });
        }

        // Andrea: Check if there is any quest that ends today

        // Andrea: If there are quests that end today, schedule a cron job for each of them to end at 23:00 PM

        const todayEndQuests = activeQuests.filter((quest) => {
            const questDate = new Date(quest.expirationDate);
            return questDate.getDate() === today.getDate() && questDate.getMonth() === today.getMonth() && questDate.getFullYear() === today.getFullYear();
        });

        if (todayEndQuests.length > 0) {
            todayEndQuests.forEach((quest) => {
                cron.schedule('0 23 * * *', () => {
                    // Andrea: This function will be executed once at 23:00 PM of the current day
                    console.log('Ending quest:', quest.name);
                    // Andrea: The quest has ended, so we can update it from the active quests and modify the field questEnded in the database
                    this.database.update({ _id: quest._id }, { $set: { questEnded: true } }, {}, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    }); 
                    this.resendQuests();
                }, {
                    scheduled: false, // Andrea: Don't start immediately
                    timezone: 'Europe/Rome', // Andrea: Set the timezone to Europe/Rome
                });
        
                // Andrea: Schedule the job to start
                cron.getTasks({ timezone: 'Europe/Rome' })['0 23 * * *'].start();
            });
        }
            
    }
}

module.exports = { QuestsCron };
