const fs = require("fs");
const path = require("path");
const os = require("os");
const contractJson = require("./build/contracts/FourEver.json");

const dotenvPath = path.resolve(__dirname, "../.env");
const contractAddress = contractJson.networks[5777].address;

console.log("Creating / Updating .env file");
console.log("=============================");

//credits: https://stackoverflow.com/a/74758228
function setEnvValue(key, value) {
    let env = fs.readFileSync(dotenvPath).toString();
    env = env.split("\n"); // optional linefeed character
    for (let lineNumber in env) {
        if (env[lineNumber].startsWith(key + " = ")) {
            env[lineNumber] = key + ` = ${value}`;
            break
        }
    }
    const newEnv = env.join("\n");
    fs.writeFileSync(dotenvPath, newEnv);
}

if (fs.existsSync(dotenvPath)) {
    console.log();
    console.log(".env file found!");
    setEnvValue("MARKETADDR", "\'" + contractAddress + "\'");
    console.log();
}
else {
    console.log(".env file not found!");
    console.log("Creation....");
    try {
        fs.appendFileSync(dotenvPath,
            "PORT = 3000\n" +
            "MARKETADDR = \"" + contractAddress + "\"\n" +
            "GANACHE = \'http://127.0.0.1:7545\'\n" +
            "API_TOKEN = \'l0InWDVIbNJuluwJBhLtF_HfF69llFp8Ll2U6Bx_\'\n" +
            "BING_COOKIE = \"1--FZLr4SXAT1-Myc8NqI5U5P58qCIncvVrwACIZVXDzEr1LP8wvjMDaIjNOu71k1cyAOEyHBS3uFaN8KI8gty9UyKmvui9L38M_uU5F1lCW85sUtJui8B_bppXoKgUOib1GPEDPKrZRvpQadjrh6Bgdt9_3-2VtToYGUVTlTp7x3eDQLcmeZBVpBCv_EY0yfacsUUOOFx5MTUV5vctN7Ovy8kjYR5Sl70drKfrlemLs\""
        );
        console.log("Done!");
    }
    catch (err) {
        console.log(err);
    }

}