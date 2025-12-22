# backend/chains/model.py
import os
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

from langchain_huggingface import HuggingFacePipeline

_llm = None

def get_llm():
    global _llm
    if _llm is None:
        print("🔹 Loading TinyLlama model (once)...")
        _llm = HuggingFacePipeline.from_model_id(
            model_id="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            task="text-generation",
            pipeline_kwargs={
                "max_new_tokens": 32,   # LOWER = less RAM
                "temperature": 0.7,
            },
        )
    return _llm
