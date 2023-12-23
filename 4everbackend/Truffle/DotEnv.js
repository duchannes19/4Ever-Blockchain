const fs = require("fs");
const path = require("path");
const os = require("os");
const contractJson = require("./build/contracts/FourEver.json");

const dotenvPath = path.resolve(__dirname, "../.env");
const contractAddress = contractJson.networks[5777].address;

console.log("Creating / Updating .env file");
console.log("=============================");

//Credits: https://stackoverflow.com/a/71633648
function setEnvValue(key, value) {
    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync(dotenvPath, "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        // (?<!#\s*)   Negative lookbehind to avoid matching comments (lines that starts with #).
        //             There is a double slash in the RegExp constructor to escape it.
        // (?==)       Positive lookahead to check if there is an equal sign right after the key.
        //             This is to prevent matching keys prefixed with the key of the env var to update.
        const keyValRegex = new RegExp(`(?<!#\\s*)${key}(?= = )`);

        return line.match(keyValRegex);
    }));

    // if key-value pair exists in the .env file,
    if (target !== -1) {
        // replace the key/value with the new value
        ENV_VARS.splice(target, 1, `${key} = ${value}`);
    }

    // write everything back to the file system
    fs.writeFileSync(dotenvPath, ENV_VARS.join(os.EOL));
}

if (fs.existsSync(dotenvPath)) {
    console.log();
    console.log(".env file found!");
    setEnvValue("MARKETADDR", "\"" + contractAddress + "\"");
    console.log();
}
else {
    console.log(".env file not found!");
    console.log("Creation....");
    try {
        fs.appendFileSync(dotenvPath,
            "PORT = 3000\n" +
            "MARKETADDR = \"" + contractAddress + "\"\n" +
            "GANACHE = \'http://127.0.0.1:7545\'"
        );
        console.log("Done!");
    }
    catch (err) {
        console.log(err);
    }

}