const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const prompts = require('../../NFTs/prompts.json');

const apiToken = process.env.API_TOKEN;

class Generator {

    // Function to generate the image 
    async generateImage(model, input) {

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/4a73a3df42c23bb43514bfd9dcebb195/ai/run/${model}`,
            {
                headers: { Authorization: `Bearer ${apiToken}` },
                method: "POST",
                body: JSON.stringify(input),
            }
        );

        const result = await response.buffer(); // Use buffer instead of blob
        console.log('Image generated');
        return result;
    }

    async generateNew(address, tokenID) {
        console.log('Generating new item for address:', address);

        // Andrea: I'm gonna use a different approach, i'll get a random item from the item json file
        let randomItem = prompts[Math.floor(Math.random() * prompts.length)];

        console.log('Prompt:\n', randomItem.prompt);

        // Define the config to generate the image
        const generateInputConfig = {
            prompt: `${randomItem.prompt}, output a single element, only represent an item.`
        };

        try {
            console.log('Generating image...');

            // Generate the image
            const generatedImage = await this.generateImage('@cf/stabilityai/stable-diffusion-xl-base-1.0', generateInputConfig);

            // Save the image to the server in the folder ./public/images
            const localPath = '/NFTs/' + tokenID + '.png';
            fs.writeFileSync(path.join(__dirname, '../..' + localPath), generatedImage);
            console.log('Image saved');

            // IGNORE for now -> Andrea: Remove the randomItem from the items json file and add it to the used items json file

            // Modify the randomItem removing prompt and adding the image path, and the address as owner
            randomItem.prompt = undefined;
            randomItem.image = localPath;
            randomItem.owner = address;
            randomItem.tokenID = tokenID;

            return randomItem;
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

module.exports = { Generator };
