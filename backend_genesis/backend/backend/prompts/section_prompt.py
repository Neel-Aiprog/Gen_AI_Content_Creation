from langchain_core.prompts import PromptTemplate
text="cricket"
section_template=PromptTemplate(template="generate sections for a blog from the following given text \n {text}",
                                input_variables=[text])