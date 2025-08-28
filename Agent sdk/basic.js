import { Agent, run, tool } from "@openai/agents";
import "dotenv/config";
import {z} from 'zod';


const getCurrentTime = tool({
    name: 'get_current_time',
    description: 'Get the current time in IST timezone',
    parameters: z.object({}),
    async execute() {
        return new Date().toString();
    }
})

export const getMenuTool = tool({
    name: "get_menu",
  description: "Fetches and returns the menu items",
parameters: z.object({}), // no parameters
  async execute() {
   return {
      Drinks: {
        Coke: '20',
        Pepsi: '20',
        Lemonade: '15',
      },
      Veg: {
        Paneer: '150',
        Chole_Bhature: '120',
        Veg_Biryani: '130',
      },
    };
    // return as JSON string to be universally serializable
    
  },
  // optional: name if the helper supports it here; otherwise provided by the key where registered
  // name: "get_menu",
});

const cookingAgent = new Agent({
    name: 'Cooking Agent',
    tools: [getCurrentTime, getMenuTool],
    instructions: `
        You are a helpfull cooking assistant. who is spaciallized in cooking food
        You help the users with food options and recipes and help them in coo food.
    `,

})

const codingAgent = new Agent({
    name: 'Coding Agent',
    instructions: `
        You are a helpfull coding assistant. who is spaciallized in Javasript coding and building applications
        You help the users with code snippets, debugging and building small applications.
    `,
    tools: [cookingAgent.asTool()]
})

const getewayAgent = Agent.create({
    name: 'Gateway Agent',
    instructions: 'You determine which agent to use',
    handoffs: [cookingAgent, codingAgent]
})


async function chatWithAgent(query) {

    const result = await run(getewayAgent, query);
    console.log(result.history);
    console.log(result.finalOutput);
}

chatWithAgent('Depending on current time, suggest me dinner and also what item are available in menu');