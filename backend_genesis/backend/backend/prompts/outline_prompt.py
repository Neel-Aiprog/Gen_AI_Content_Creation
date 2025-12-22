from langchain_core.prompts import PromptTemplate
text="cricket"
outline_template=PromptTemplate(template="generate a outline for a blog from the following given text \n {text}",
                                input_variables=[text])