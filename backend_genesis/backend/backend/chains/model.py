import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq


load_dotenv()


def get_llm() -> ChatGroq:
    """Return a LangChain-compatible LLM instance using Groq.

    This is imported in backend.chains.__init__ and used in pipeline.py
    as a LangChain LLM (supports .bind, .invoke, and LCEL "|" piping).
    """
    api_key = os.getenv("GROQ_API_KEY")

    return ChatGroq(
        groq_api_key=api_key,
        model_name="llama-3.1-8b-instant",
        temperature=0.8,
        max_tokens=1024,
    )
