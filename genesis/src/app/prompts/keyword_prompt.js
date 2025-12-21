import { PromptTemplate } from "@langchain/core/prompts";

const keyword_prompt = new PromptTemplate({
  template: `Extract the main keywords from this text. Return only keywords separated by commas.

Text: {text}

Keywords:`,
  inputVariables: ["text"],
});

export default keyword_prompt;