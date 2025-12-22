from langchain_core.prompts import PromptTemplate

# In your input_prompt.py or main file
input_template = PromptTemplate(
    template="""
    You are an expert SEO content strategist. 
    
    Task: Generate a detailed blog outline, keywords, and SEO metadata for the topic: "{text}".
    
    Instructions:
    1. Analyze the topic deeply.
    2. Populate the JSON schema below with specific, high-quality content.
    3. Return ONLY valid JSON. No markdown formatting (like ```json), no explanations.
    
    Required JSON Structure:
    {{
      "keywords": {{
        "primary": ["list 3 specific primary keywords here"],
        "secondary": ["list 5 specific secondary keywords here"]
      }},
      "outline": [
        {{
          "h2": "Write a compelling H2 heading here",
          "h3": ["H3 subtopic 1", "H3 subtopic 2"]
        }}
      ],
      "sections": {{
        "Write the same H2 heading here": ["detailed talking point 1", "detailed talking point 2", "detailed talking point 3"]
      }},
      "seo": {{
        "meta_title": "Write a catchy SEO title here",
        "meta_description": "Write a 150-char meta description here"
      }}
    }}
    """,
    input_variables=["text"],
)
