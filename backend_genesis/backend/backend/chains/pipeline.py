from dotenv import load_dotenv
load_dotenv()

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from ..prompts.input_prompt import input_template
from ..chains.model import get_llm


# --------------------------------------------------
# LLM
# --------------------------------------------------
LLM = get_llm()
parser = StrOutputParser()

def extract_after_marker(text: str, marker="=== OUTPUT START ==="):
    if marker in text:
        return text.split(marker, 1)[1].strip()
    return text.strip()
def extract_result_marker(text: str, marker="FINAL BLOG ARTICLE:"):
    if marker in text:
        return text.split(marker, 1)[1].strip()
    return text.strip()
# --------------------------------------------------
# Chain 1: Topic → Plain-text SEO Plan
# --------------------------------------------------
# NOTE: input_template MUST be the SIMPLE STRING version
chain1 = input_template | LLM.bind(stop=["\n\n"]) | parser



# --------------------------------------------------
# Chain 2: Plan → Blog
# --------------------------------------------------
blog_template = PromptTemplate(
    template="""
You are given a CONTENT PLAN below.

Your task is to TRANSFORM it into ONE unified blog article.

RULES (VERY IMPORTANT):
- IGNORE all labels such as SEO Title, Meta Description, H2, H3, Keywords
- DO NOT repeat or mention labels
- DO NOT explain the plan
- DO NOT summarize sections separately
- MERGE all ideas into a single, smooth blog article
- Write in paragraph form only
- Target approximately 100 words
- Output ONLY the final blog text

CONTENT PLAN:
{plan}

FINAL BLOG ARTICLE:
""",
    input_variables=["plan"],
)


chain2 = blog_template | LLM | parser


# --------------------------------------------------
# Main execution
# --------------------------------------------------
if __name__ == "__main__":
    topic = "langchain"

    # ---- Chain 1 (Planning)
    raw_plan = chain1.invoke({"text": topic,"tone":"scientific"})
    plan_text = extract_after_marker(raw_plan)



    # ---- Chain 2 (Blog Writing)
    blog_text = chain2.invoke({"plan": plan_text})
    final_result=extract_result_marker(blog_text)
    print(final_result)
    exit()