import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";
require("dotenv").config();

var black = "\u001b[30m";
var red = "\u001b[31m";
var green = "\u001b[32m";
var yellow = "\u001b[33m";
var blue = "\u001b[34m";
var magenta = "\u001b[35m";
var cyan = "\u001b[36m";
var white = "\u001b[37m";

var reset = "\u001b[0m";

export const initLangChain = () => {
  ////////////
  // -- CONFIG --
  // ChatGPTのモデル
  const chatGptModel = "gpt-3.5-turbo";
  // ChatGPTのtemperature
  const chatGptTemperature = 0.9;
  // role:systemのprompt
  const systemPrompt = process.env.SYSTEM_MESSAGE_TEMPLATE || "";
  //// initialize
  // ChatGPTの初期化
  const ChatGPT = new ChatOpenAI({
    modelName: chatGptModel,
    temperature: chatGptTemperature,
  });
  // Langchainの初期化
  const langChainPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const LangChain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: langChainPrompt,
    llm: ChatGPT,
  });

  return LangChain;
};

import * as readline from "readline";

class Repl {
  rl: readline.Interface;
  LangChain: ConversationChain;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.LangChain = initLangChain();
    process.stdout.write("> " + yellow);
  }
  async start(prompt = "") {
    let quitFlag = false;
    while (1 && !quitFlag) {
      await this.readSyncLine(prompt, async (text) => {
        if (text === ("quit" as string)) {
          quitFlag = true;
        }
        if (text !== "") {
          const res = await this.LangChain.call({
            input: text,
          });

          console.log(magenta + "Ai : " + green + res.response + reset);
          process.stdout.write("> " + yellow);
          return;
        }
      });
    }
  }

  async readSyncLine(
    prompt: string,
    cb: (text: string) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        cb(answer);
        resolve();
      });
    });
  }
}

const r = new Repl();

r.start();
