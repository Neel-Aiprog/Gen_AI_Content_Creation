from langchain_core.prompts import PromptTemplate

yt_desc_prompt_template = PromptTemplate(
    template="""
You must output ONLY a YouTube video description based on the text given below.

TOPIC:
{text}


- Tone: {tone}

ABSOLUTE RULES (NO EXCEPTIONS):
- Output MUST be plain text
- NO markdown formatting
- NO headings using symbols (*, -, etc.)
- NO explanations, commentary, or meta text
- NO quotation marks around the output
- NO emojis unless explicitly requested
- NO timestamps unless explicitly requested
- NO extra whitespace at the start or end

STRUCTURE (MANDATORY AND IN THIS ORDER):

1. First paragraph (Hook):
   - 1-3 short sentences
   - Clearly explains what the video is about
   - Written to grab attention immediately

2. One blank line

3. Main description:
   - One or more short paragraphs
   - Explains what viewers will learn or see
   - Natural YouTube tone (informative, conversational)
   - No bullet points unless explicitly requested

4. If a call-to-action is requested:
   - EXACTLY ONE blank line
   - CTA must be the final paragraph

5. If links are requested:
   - EXACTLY ONE blank line
   - Links listed one per line
   - No text after the links section

- 2-5 Relevant hashtags
- NO LINKS.
FAILURE CONDITION:
If ANY rule is violated, the output is INVALID.


""",
    input_variables=["text","tone"],
)
