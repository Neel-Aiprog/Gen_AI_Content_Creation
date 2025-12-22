from langchain_huggingface import ChatHuggingFace,HuggingFacePipeline
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from .seo_chain import seo_chain1
from .keyword_chain import keyword_chain1
from .outline_chain import outline_chain1
from .section_chain import section_chain1
from langchain_core.runnables import RunnableParallel
from langchain_core.prompts import PromptTemplate
load_dotenv()
text="cricket"
LLM=HuggingFacePipeline.from_model_id(
    model_id="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    task="text-generation"
)
model=ChatHuggingFace(llm=LLM)
blog_template=PromptTemplate(
    template="generate a blog from the given text through the keywords obtained,seo optimised words , and sections and outline obtained\n{keywords},{seo},{outline},{section} ",
    input_variables=['keywords','seo','outline','section']
)
parser=StrOutputParser()
parallel_chain=RunnableParallel({
    'keywords':keyword_chain1,
    'seo':seo_chain1,
    'outline':outline_chain1,
    'section':section_chain1
})
merge_chain=blog_template|model|parser
chain=parallel_chain|merge_chain
result=chain.invoke({'text':text})
print(result)