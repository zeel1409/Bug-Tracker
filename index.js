const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Set your API key in the environment
});

async function main() {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Hello, Claude! Introduce yourself briefly.",
      },
    ],
  });

  console.log(message.content[0].text);
}

main();
