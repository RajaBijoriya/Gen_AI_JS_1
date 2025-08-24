import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY, // ✅ use env key
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function main() {
  const response = await openai.chat.completions.create({
    model: "gemini-2.5-pro",
    messages: [
      {
        role: "system",
        content: `You are an assistant expert in coding with JavaScript. 
                  You only know JavaScript as a coding language. 
                  If the user asks anything other than JavaScript coding, 
                  do not answer. You are an AI from choiorcode (an EdTech company).`,
      },
      {
        role: "user",
        content: "how find odd number, write a code on Js",
      },
    ],
  });

  // ✅ FIX: Gemini’s OpenAI-compatible responses return `message` not `.content`
  console.log("Gemini Response:\n");
  console.log(response.choices[0].message.content.trim());
}

main();
