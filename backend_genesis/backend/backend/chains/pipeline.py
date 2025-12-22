from langchain_huggingface import ChatHuggingFace,HuggingFacePipeline
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from langchain_core.runnables import RunnableParallel
from langchain_core.prompts import PromptTemplate
import json
from ..prompts.input_prompt import input_template
import regex as re
load_dotenv()
from ..chains.model import get_llm
LLM=get_llm()
def format_outline(outline):
    text = []
    for item in outline:
        text.append(f"H2: {item['h2']}")
        for h3 in item["h3"]:
            text.append(f"  - H3: {h3}")
    return "\n".join(text)
def format_sections(sections):
    blocks = []
    for heading, points in sections.items():
        blocks.append(f"{heading}:")
        for p in points:
            blocks.append(f"- {p}")
    return "\n".join(blocks)
def format_keywords(keywords):
    return (
        "Primary: " + ", ".join(keywords["primary"][:3]) +
        "\nSecondary: " + ", ".join(keywords["secondary"][:5])
    )
def extract_json(text: str):
    """
    Extract the first JSON object from an LLM response string.
    """
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON object found in model output")
    return json.loads(match.group())




parser=StrOutputParser()
chain1=input_template|LLM|parser


if __name__ == "__main__":
    result=chain1.invoke({"text":'cricket'})
    data = extract_json(result)
    outline_text = format_outline(data["outline"])
    sections_text = format_sections(data["sections"])
    keywords_text = format_keywords(data["keywords"])
    blog_template = PromptTemplate(
    template="""
Write a 100-word SEO-optimized blog.

SEO: {seo}
Keywords:
{keywords_text}

Outline:
{outline_text}

Section guidance:
{sections_text}

Rules:
- Follow outline strictly
- Expand only given bullet points
- Use keywords naturally
- No new headings
""",
    input_variables=[
        "seo",
        "outline_text",
        "sections_text",
        "keywords_text",
    ],
)

    chain2=blog_template|LLM|parser
    final_result = chain2.invoke({
    "seo": data.get("seo", ""),
    "outline_text": outline_text,
    "sections_text": sections_text,
    "keywords_text": keywords_text,
})

    print(final_result)
    
