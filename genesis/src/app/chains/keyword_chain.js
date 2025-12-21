import "dotenv/config";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import keyword_prompt from "../prompts/keyword_prompt.js";
const parser = new StringOutputParser();

const model = new HuggingFaceInference({
  model: "meta-llama/Llama-3.1-8B-Instruct", 
});
async function run(){

const keyword_chain = keyword_prompt.pipe(model).pipe(parser);

const res = await keyword_chain.invoke({
    text: "i am a normal guy my friends are normal.",
});
console.log(res);
}
run().catch(console.error)