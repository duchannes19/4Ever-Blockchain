const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const prompts = require('../../NFTs/prompts.json');

const apiToken = process.env.API_TOKEN;

class Generator {

    getRandomItem() {
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

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
        return result;
    }

    async generateNew(address, path, item) {
        console.log('[Generator]: Generating new item: For: ' + address);
        console.log('[Generator]: Prompt: ' + item.prompt);

        // Define the config to generate the image
        const generateInputConfig = {
            prompt: `${item.prompt}, output a single element, only represent an item.`
        };

        try {
            // Generate the image
            const generatedImage = await this.generateImage('@cf/stabilityai/stable-diffusion-xl-base-1.0', generateInputConfig);
            fs.writeFileSync(path, generatedImage);
            console.log('[Generator]: \x1b[32mGeneration complete\x1b[0m');

            // IGNORE for now -> Andrea: Remove the randomItem from the items json file and add it to the used items json file
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = { Generator };
