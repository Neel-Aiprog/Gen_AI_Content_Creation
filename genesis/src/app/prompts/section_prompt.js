import {PromptTemplate} from "@langchain/core/prompts"
const section_prompt=new PromptTemplate({
    template:"generate sections for the following text based on the topic given in the text\n {text}",
    input_variables:['text']
})
export default section_prompt;