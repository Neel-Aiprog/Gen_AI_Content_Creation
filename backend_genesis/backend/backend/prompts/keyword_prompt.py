from langchain_core.prompts import PromptTemplate
text="cricket"
keyword_template=PromptTemplate(template='generate keywords from the following given text \n {text}',
                        input_variables=[text])
