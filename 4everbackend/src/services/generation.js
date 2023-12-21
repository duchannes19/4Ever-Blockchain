const fetch = require("node-fetch");
const fs = require("fs");

// Function to define the prompt for generating the image
async function definePrompt(model, input) {
    const apiToken = process.env.API_TOKEN; // Replace with your actual API token

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
    const apiToken = process.env.API_TOKEN; // Replace with your actual API token

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

// Define the prompt for generating the image after
const promptInputConfig = {
    messages: [
        {
            role: "system",
            content: "You help generate magical items, only provide the description without any other formality",
        },
        {
            role: "user",
            content:
                "Write a short description of a magical item, be very specific on the description only, provide the description without any other formality, then assign it a rarity among (Common, Uncommon, Rare, Epic, Legendary), and a type (Weapon, Armor, Ring, Potion, Scroll, Wondrous Item, Rod, Staff, Wand, Wondrous Item)",
        }, 
    ],
};

async function generatenew() {
    // Define the prompt
    const prompt = await definePrompt("@cf/meta/llama-2-7b-chat-int8", promptInputConfig);
    console.log(JSON.stringify(prompt));

    // Define the config to generate the image
    const generateInputConfig = {
        prompt: JSON.stringify(prompt),
        num_steps: 20,
    };

    try {
        // Generate the image
        const generatedImage = await generateImage("@cf/stabilityai/stable-diffusion-xl-base-1.0", generateInputConfig);

        // Save the image to the server in the folder ./public/images
        fs.writeFileSync("./items/generated_image.png", generatedImage);
        console.log('Image saved');

        return prompt;
    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = generatenew;
