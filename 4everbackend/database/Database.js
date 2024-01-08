const fs = require("fs");
const path = require("path");

const questsDBPath = path.resolve(__dirname, "./quests.db");

const questsStringDatabase =
    '{"name":"Hunt for the Lost Relic","description":"Embark on a journey to find the ancient relic hidden deep in the Forbidden Forest.","startDate":"2024-11-01","expirationDate":"2024-12-31","participants":[],"usersThreshold":5,"questRegistered":false,"questEnded":false,"winner":null,"_id":"2tUoTnXMnOuGeyFY"}\n' +
    '{"name":"Save the Princess","description":"The princess has been kidnapped by the evil wizard. Rescue her from the wizard\'s castle.","startDate":"2024-10-01","expirationDate":"2024-10-31","participants":[],"usersThreshold":5,"questRegistered":false,"questEnded":false,"winner":null,"_id":"IqmirDmo7SKz5Y3z"}\n' +
    '{"name":"Defeat the Dragon","description":"A fearsome dragon has been terrorizing the kingdom. Slay the dragon and bring peace to the land.","startDate":"2024-10-15","expirationDate":"2024-11-15","participants":[],"usersThreshold":5,"questRegistered":false,"questEnded":false,"winner":null,"_id":"qRysykZABKuTuBCa"}\n';

console.log("=============================");
console.log();
if (fs.existsSync(questsDBPath)) {
    console.log("quests.db file found! -> clearing");
}
else {
    console.log("quests.db file not found! -> creation");
}
try {
    fs.writeFileSync(questsDBPath,
        questsStringDatabase
    );
    console.log("Done!");
    console.log();
}
catch (err) {
    console.log('Error:');
    console.log(err);
}