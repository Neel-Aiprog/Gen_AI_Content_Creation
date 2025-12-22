from langchain_huggingface import ChatHuggingFace,HuggingFacePipeline
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from ..prompts.outline_prompt import outline_template
load_dotenv()
LLM=HuggingFacePipeline.from_model_id(
    model_id="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    task="text-generation"
)
model=ChatHuggingFace(llm=LLM)
parser=StrOutputParser()
outline_chain1=outline_template|model|parser
