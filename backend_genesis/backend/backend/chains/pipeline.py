from dotenv import load_dotenv
load_dotenv()

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from ..prompts.input_prompt import input_template
from ..prompts.regen_prompt import input_regen_template
from ..prompts.tweet_prompt import tweet_prompt_template
from ..prompts.yt_desc_prompt import yt_desc_prompt_template
from ..prompts.yt_script_prompt import yt_script_prompt_template
from ..prompts.insta_prompt import insta_prompt_template
from ..prompts.reddit_prompt import reddit_prompt_template

from ..chains.model import get_llm



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
chain1 = input_template | LLM.bind(stop=["\n\n"]) | parser

regen_chain1 = input_regen_template | LLM |  parser

tweet_chain = tweet_prompt_template | LLM | parser

description_chain = yt_desc_prompt_template | LLM | parser

script_chain = yt_script_prompt_template | LLM | parser

insta_post_chain = insta_prompt_template | LLM | parser

reddit_post_chain = reddit_prompt_template | LLM | parser

blog_template = PromptTemplate(
    template="""
You are given a CONTENT PLAN between the triple backticks below.
Your job is to write ONE unified blog article ABOUT THE TOPIC: "{topic}".

RULES (VERY IMPORTANT):
- The text between ``` and ``` IS the content plan.
- UNDER NO CIRCUMSTANCES should you say that the content plan is missing, empty, or not provided.
- Even if the content between ``` and ``` looks short, unclear, or empty, you MUST still write a reasonable blog article based on whatever hints are present.
- The blog MUST stay strictly on the topic "{topic}". Do not switch to generic themes like New Year, motivation, or self-help unless they are clearly in the plan.
- WRITE THE BLOG ARTICLE ITSELF for a general audience. Do NOT give instructions on how to write a blog or how to create content.
- IGNORE all labels such as SEO Title, Meta Description, H2, H3, Keywords.
- DO NOT repeat or mention labels.
- DO NOT explain the plan.
- Insert a blank line between each paragraph.
- DO NOT summarize sections separately.
- MERGE all ideas into a single, smooth blog article.
- Write in paragraph form only (no bullet lists, no step-by-step guides).
- Target approximately 100 words unless specified in topic.
- Output ONLY the final blog text (no headings like "CONTENT PLAN" or explanations, and no meta-commentary about writing a blog).

CONTENT PLAN (between backticks):
```
{plan}
```

Now write the final blog article about "{topic}":
""",
    input_variables=["plan", "topic"],
)






chain2 = blog_template | LLM | parser


if __name__ == "__main__":

    raw_text = regen_chain1.invoke({"text": "killing men is bad","tone":"casual"})
    regened_text = extract_after_marker(raw_text)


    raw_plan = chain1.invoke({"text": "murder","tone":"casual"})
    plan_text = extract_after_marker(raw_plan)

    blog = chain2.invoke({"plan": plan_text,"topic":"murder"})
    final_blog = extract_result_marker(blog)
    
    print(regened_text)
    print("\n \n \n hi \n \n \n")
    print(final_blog)
    exit()