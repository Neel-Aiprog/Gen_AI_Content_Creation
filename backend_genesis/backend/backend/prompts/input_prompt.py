from langchain_core.prompts import PromptTemplate

input_template = PromptTemplate(
    template="""
You are an SEO content planner.

Topic: {text}
Tone:{tone}
Your task:
Create ONE clean, combined SEO content plan according to the tone.

IMPORTANT:
- Do NOT write any introductory paragraphs
- Do NOT repeat sections
- Do NOT explain anything
- Do NOT add examples or case studies
- Combine everything into a SINGLE structured plan

Write ONLY the following sections, exactly once, in this order:

SEO Title:
SEO Meta Description:
Primary Keywords (3, comma separated):
Secondary Keywords (5, comma separated):
H2 Heading:
H3 Subtopic 1:
H3 Subtopic 2:
Section Points:
- point 1
- point 2
- point 3

Do NOT write anything before or after this plan.

=== OUTPUT START ===
""",
    input_variables=["text","tone"],
)
