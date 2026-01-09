from langchain_core.prompts import PromptTemplate

input_regen_template = PromptTemplate(
    template="""
Rewrite the text below into a {tone} tone.

=== TEXT START ===
{text}
=== TEXT END ===

Requirements:
- preserve meaning exactly
- preserve factual content
- do not change proper nouns
- no additional explanations or commentary
- no emojis unless present in original
- match approximately the same length
- do not quote the original text
- output ONLY the rewritten text


Provide the final rewritten text only after the marker:

=== OUTPUT START ===

""",
    input_variables=["text","tone"],
)
