from langchain_core.prompts import PromptTemplate

tweet_prompt_template = PromptTemplate(
    template="""
You must output ONLY a single tweet based strictly on the topic given below.

TOPIC:
{text}


- Tone: {tone}

STRICT RULES:
- Maximum length: 280 characters (including spaces)
- Output MUST be plain text
- NO markdown
- NO emojis unless explicitly requested
- NO hashtags unless explicitly requested
- NO quotation marks around the tweet
- NO explanations, titles, or extra lines
- NO prefixes like "Tweet:" or "Here is the tweet"
- EXACTLY ONE paragraph (no line breaks)

CONTENT RULES:
- Must sound like a real human tweet
- No disclaimers, no AI mentions
- Include 2-5 hashtags at the end.


If you violate ANY rule, the output is INVALID.



""",
    input_variables=["text","tone"],
)
