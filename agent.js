// import "dotenv/config";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.GEMINI_API_KEY, // ✅ env key
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
// });

// async function main() {
//   const SYSTEM_PROMPT = `
//     You are an AI assistant who works on START, THINK and OUTPUT format.
//     For a given user query, first think and break down the problem into sub-problems. 
//     You should always keep thinking before giving the actual output.
//     Before outputting the final result to the user, check once if everything is correct.
// You are an AI assistant who works on START, THINK and OUTPUT format.

//   Rules: 
//   - Strictly follow JSON format
//   - Always use sequence: START → THINK → OUTPUT
//   - Only one task per step, then wait for next
//   - Do multiple THINK steps before OUTPUT
//   - Emojis are allowed inside "content" and should NOT be escaped (e.g., "🤖", not "\\ud83e\\udd16")

//   Output JSON Format:
//   {"step": "START" | "THINK" | "OUTPUT","content": "string"}

//     Example: 
//     User: Can you solve 2+2*2 ?
//     AI: {"step": "START", "content": "I will first solve the multiplication part of the equation."}
//     AI: {"step": "THINK", "content": "2*2=4, now I will add 2 to the result."}
//     AI: {"step": "OUTPUT", "content": "The final result is 6"}
//   `;

//   const messages = [
//     { role: "system", content: SYSTEM_PROMPT },
//     { role: "user", content: "Can you solve 4 * 12 - 32 * 2 / 4 - 2 + 50" },
//   ];
  
//   while(true){
//     const response = await openai.chat.completions.create({
//       model: "gemini-2.5-flash",
//       messages: messages
//     });

//     //  let rawContent = response.choices[0].message.content.trim();

//     // ✅ Extract JSON safely using regex
//     // const match = rawContent.match(/\{[\s\S]*\}/);
//     // if (!match) {
//     //   console.error("❌ No valid JSON found in response:", rawContent);
//     //   break;
//     // }

//     // let parsedContent;
//     // try {
//     //   parsedContent = JSON.parse(match[0]);
//     // } catch (err) {
//     //   console.error("❌ Invalid JSON:", rawContent);
//     //   break;
//     // }
//     const rawContent = response.choices[0].message.content;
//     const parsedContent = JSON.parse(rawContent);

//     messages.push({
//       role: "assistant",
//       content: JSON.stringify(parsedContent),
//     })
   
//     if(parsedContent.step === "START"){
//         console.log('🤖', parsedContent.content);
//         continue;
//     }
//     if(parsedContent.step === "THINK"){
//         console.log("\t🔦", parsedContent.content);
//         continue;
//     }
//     if(parsedContent.step === "OUTPUT"){
//         console.log("🤡", parsedContent.content);
//         break;
//     }
//   }
  
//   console.log('DONE');
// }

// main();


import "dotenv/config";
import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY, // ✅ env key
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function getWeatherDetailsByCity(cityname = '') {
     const url = `https://wttr.in/${cityname.toLowerCase()}?format=%C+%t`;
    const {data} =  await axios.get(url, {responseType: 'text'});
    return `The current weather in ${cityname} is ${data}`;
    
}
// getWeatherDetailsByCity('indore').then(console.log);
async function main() {
  const SYSTEM_PROMPT = `
    You are an AI assistant who works on START, THINK and OUTPUT format.

    Rules: 
    - Strictly follow JSON format
    - Always use sequence: START → THINK → OUTPUT
    - Only one task per step, then wait for next
    - Do multiple THINK steps before OUTPUT
    - Emojis are allowed inside "content" and should NOT be escaped (e.g., "🤖", not "\\ud83e\\udd16")
    - You also have list of available tools that you can call based on user query.
    - for every tool call, that you make, wait for the OBSERVATION from the tool which is the 
    response from the tool that you called.
    


    Available Tools: 
    - getWeatherDetailsByCity: Use this tool to get current weather information of a city. Input should be a city name.


    Output JSON Format:
    {"step": "START" | "THINK" | "OUTPUT","content": "string"}

    Example: 
    User: Can you solve 2+2*2 ?
    AI: {"step": "START", "content": "I will first solve the multiplication part of the equation."}
    AI: {"step": "THINK", "content": "2*2=4, now I will add 2 to the result. ✅"}
    AI: {"step": "OUTPUT", "content": "The final result is 6 🎉"}
  `;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: "write a function that check givin number is prime or not prime 🤔" },
  ];

  while (true) {
    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: messages,
    });

    let rawContent = response.choices[0].message?.content?.trim();

    // ✅ Extract JSON safely (in case Gemini adds text around it)
    const match = rawContent.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("❌ No valid JSON found in response:", rawContent);
      break;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(match[0]);
    } catch (err) {
      console.error("❌ Invalid JSON:", rawContent);
      break;
    }

    // Push back for context
    messages.push({
      role: "assistant",
      content: JSON.stringify(parsedContent),
    });

    // ✅ Print with role emoji + Gemini’s own content (with emojis preserved)
    if (parsedContent.step === "START") {
      console.log("🤖", parsedContent.content.trim());
      continue;
    }
    if (parsedContent.step === "THINK") {
      console.log("\t🔦", parsedContent.content.trim());
      continue;
    }
    if (parsedContent.step === "OUTPUT") {
      console.log("🤡", parsedContent.content.trim());
      break;
    }
  }

  console.log("DONE ✅");
}

// main();
