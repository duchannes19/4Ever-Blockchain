const fetch = require("node-fetch");
const fs = require("fs");

const apiToken = process.env.API_TOKEN;

// Function to define the prompt for generating the image
async function definePrompt(model, input) {

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/4a73a3df42c23bb43514bfd9dcebb195/ai/run/${model}`,
        {
            headers: { Authorization: `Bearer ${apiToken}` },
            method: "POST",
            body: JSON.stringify(input),
        }
    );

    const result = await response.json();
    return result.result.response;
}

// Function to generate the image
async function generateImage(model, input) {

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

async function generatenew(address) {
    console.log('Generating new item for address:', address);

    const randomseed = Math.floor(Math.random() * 1000000);

    // Define the prompt

    const promptInputConfig = {
        prompt:
            "Seed: " + randomseed + ". Write a random magical item, that is different from the one I asked you before, in JSON format. For example:\n\n{ \"name\": \"Magical Sword of Power\", \"rarity\": \"Legendary\", \"type\": \"Weapon\",  \"description\": \"A sword that can cut through anything.\" }",
    };

    //Prompt for resetting the prompt generator

    const resetPromptInputConfig = {
        prompt: "Seed: " + randomseed + ". The next time I ask you to generate an item it has to be different from the one I asked you before. Answer me with Reset Done",
    };

    console.log('Defining random prompt...')

    const prompt = await definePrompt("@cf/mistral/mistral-7b-instruct-v0.1", promptInputConfig);

    const parsedResponse = JSON.parse(prompt);

    console.log('Prompt:\n', parsedResponse);

    const { description } = parsedResponse;

    const itemPrompt = 'Generate a single magical items that follows this description: ' + description;

    // Define the config to generate the image
    const generateInputConfig = {
        prompt: itemPrompt,
        num_steps: 20,
    };

    try {
        console.log('Generating image...')
        // Generate the image
        const generatedImage = await generateImage("@cf/stabilityai/stable-diffusion-xl-base-1.0", generateInputConfig);

        // Save the image to the server in the folder ./public/images
        fs.writeFileSync("./items/generated_image_" + randomseed + ".png", generatedImage);
        console.log('Image saved');

        const reset = await definePrompt("@cf/mistral/mistral-7b-instruct-v0.1", resetPromptInputConfig);

        console.log(reset);

        return parsedResponse;
    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = generatenew;
