from langchain_core.prompts import PromptTemplate

yt_script_prompt_template = PromptTemplate(
    template="""
You must output ONLY a YouTube video script based on the text given below.

TOPIC:
{text}


- Tone: {tone}

ABSOLUTE RULES (NO EXCEPTIONS):
- Output MUST be plain text
- NO markdown formatting
- NO explanations, commentary, or meta text
- NO emojis
- NO hashtags
- NO bullet points
- NO surrounding quotation marks
- NO titles outside the script itself
- NO extra whitespace at the start or end

STRUCTURE (MANDATORY AND IN THIS ORDER):

1. Hook (first 5-15 seconds):
   - 2-4 short spoken sentences
   - Directly addresses the viewer
   - Clearly states what the video is about

2. One blank line

3. Intro:
   - Brief channel or context introduction
   - Smooth transition into the topic
   - Spoken, conversational tone

4. One blank line

5. Main Script Body:
   - Multiple spoken paragraphs
   - Written exactly as it should be said out loud
   - No stage directions, timestamps, or labels
   - Natural pacing, simple sentences

6. One blank line

7. Outro / Call to Action:
   - Wraps up the topic
   - Optional CTA if requested
   - Sounds natural, not salesy

SCRIPT MUST BE 300-400 WORDS LONG UNLESS SPECIFIED OTHERWISE.

HAVE MULTIPLE PARAGRAPHS WITH ONE BLANK LINE BETWEEN THEM.

FAILURE CONDITION:
If ANY rule is violated, the output is INVALID.

""",
    input_variables=["text","tone"],
)
