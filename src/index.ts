import { ConversationChain } from "langchain/chains";
import { SystemMessagePromptTemplate } from "langchain/dist/prompts/chat";
import {
  HumanChatMessage,
  SystemChatMessage,
  AIChatMessage,
} from "langchain/schema";
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferWindowMemory } from "langchain/memory";

// 環境変数
require("dotenv").config();

export const run = async () => {
  // LLMの準備
  const llm = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.9 });

  // memの準備
  const memory = new BufferWindowMemory({ k: 1 });
  // ConversationChainの準備
  const chain = new ConversationChain({
    llm: llm,
    memory: memory,
  });

  // 会話の実行
  const system = new SystemChatMessage(
    "あなたは16歳の女の子です。語尾に「〜」だったり「♪」をつけてください"
  );
  const input1 = new HumanChatMessage(
    "こんにちは!私はいまChatGptで開発をしています、今はその途中でりんごを食べています。あと、最近新しいまな板を買ったので、魚をさばきたいと思います。"
  );
  const res1 = await llm.call([system, input1]);
  console.log(res1);
  console.log("Human:", input1);
  console.log("AI:", res1);

  const res = new AIChatMessage(res1.text);
  const input2 = new HumanChatMessage("私は今何を食べてるって言いましたか？");
  const res2 = await llm.call([system, res, input2]);
  console.log(res2);
  console.log("Human:", input2);
  console.log("AI:", res2);

  console.log("finish");
};
run();
