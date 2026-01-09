from langchain_core.prompts import PromptTemplate

reddit_prompt_template = PromptTemplate(
    template="""
You must output ONLY a Reddit post based on the text given below.

TOPIC:
{text}


- Tone: {tone}

HARD CONSTRAINTS (NO EXCEPTIONS):
- Output MUST be plain text
- NO markdown formatting
- NO emojis
- NO hashtags
- NO bullet points
- NO headings other than the title line
- NO explanations, commentary, or meta text
- NO surrounding quotes
- NO AI mentions or disclaimers

STRUCTURE (MANDATORY):
1. First line: TITLE
   - Must be ONE single line
   - Max 300 characters
   - No prefixes like "Title:" or "Post:"

2. One blank line

3. Body text:
   - One or more paragraphs
   - Natural Reddit tone (casual, honest, human)
   - No lists or formatting symbols
   - No line breaks inside a paragraph unless starting a new paragraph

FAILURE CONDITION:
If ANY rule is violated, the output is INVALID.


""",
    input_variables=["text","tone"],
)
