from langchain_core.prompts import PromptTemplate
text="cricket"
seo_template=PromptTemplate(template="generate seo optimised keywords for a blog from the following given text \n {text}",
                                input_variables=[text])