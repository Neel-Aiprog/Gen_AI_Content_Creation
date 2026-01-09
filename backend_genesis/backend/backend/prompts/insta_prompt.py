from langchain_core.prompts import PromptTemplate

insta_prompt_template = PromptTemplate(
    template="""
You must output ONLY an Instagram caption based on the given below.

TOPIC:
{text}


- Tone: {tone}

ABSOLUTE RULES (NO EXCEPTIONS):
- Output MUST be plain text
- NO markdown
- NO headings
- NO explanations or commentary
- NO quotation marks
- NO prefixes like "Caption:" or "Post:"
- NO links unless explicitly requested
- NO emojis unless explicitly requested
- NO extra whitespace at start or end

STRUCTURE (MANDATORY):
1. Caption text:
   - One or more short paragraphs
   - Conversational, Instagram-native tone
   - Line breaks allowed for readability

2. If hashtags are requested:
   - EXACTLY ONE blank line after caption
   - Hashtags must be on the LAST line only
   - 2-5 Relevant hashtags

FAILURE CONDITION:
If ANY rule is violated, the output is INVALID.



""",
    input_variables=["text","tone"],
)
