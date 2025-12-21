import {PromptTemplate} from "@langchain/core/prompts"
const outline_prompt=new PromptTemplate({
    template:"generate a outline for the following text \n {text}",
    input_variables:['text']
})
export default outline_prompt;