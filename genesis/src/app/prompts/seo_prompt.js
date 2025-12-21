import {PromptTemplate} from "@langchain/core/prompts"
const seo_prompt=new PromptTemplate({
    template:"generate seo optimised words based on the given text\n {text}",
    input_variables:['text']
})
export default seo_prompt;