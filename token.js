import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";


const enc = new Tiktoken(o200k_base);

const userQuery = "Hey There, I am Raja ji";

const token  = enc.encode(userQuery);
console.log({token});

const inputToken = enc.decode([
    25216,   3274,
       11,    357,
      939, 0,0,0,0,
    24235
  ]);

  console.log({inputToken})