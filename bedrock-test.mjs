import { AnthropicBedrock } from "@anthropic-ai/bedrock-sdk";

const client = new AnthropicBedrock({
  awsRegion: "us-east-1",
});

const message = await client.messages.create({
  model: "us.anthropic.claude-sonnet-4-6",
  max_tokens: 300,
  system: "You are a friendly tutor for a Class 6 student in India.",
  messages: [{ role: "user", content: "Explain fractions using a chapati." }]
});

console.log(message.content[0].text);