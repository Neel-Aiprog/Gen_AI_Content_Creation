# Gen AI Content Creation

This project was created under the Genesis competition. Gen AI Content Creation is a platform built by a team of three — Nishchay Mittal, Neel Mhaske, and Leon Lobo — that uses generative AI to create content such as blog posts, tweets, YouTube scripts & descriptions, and Instagram captions. The platform combines a modern Next.js front end with a Django back end, and uses LangChain for generation along with Unsplash and Pexels APIs for images.

Repository: [Neel-Aiprog/Gen_AI_Content_Creation](https://github.com/Neel-Aiprog/Gen_AI_Content_Creation)

Table of contents
- [Features](#features)
- [Team](#team)
- [Tech stack](#tech-stack)
- [Architecture overview](#architecture-overview)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend (Next.js)](#frontend-nextjs)
  - [Backend (Django)](#backend-django)
  - [Environment variables](#environment-variables)
- [Example usage](#example-usage)
- [Deployment notes](#deployment-notes)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- Generate blog posts, tweets, YouTube scripts, YouTube descriptions, and Instagram captions using generative models.
- Image integration via Unsplash and Pexels APIs for enriching content.
- Front end built with Next.js for fast, reactive UX.
- Back end built with Django to handle API requests, manage users/data, and orchestrate LangChain generation.

## Team
- Nishchay Mittal
- Neel Mhaske
- Leon Lobo

## Tech stack
- Front end: Next.js (React, JavaScript/TypeScript)
- Back end: Django (Python)
- Generation library: LangChain
- Image APIs: Unsplash API, Pexels API


## Architecture overview
1. The Next.js front end sends generation requests (type + prompt + options) to the Django API.
2. Django receives requests and uses LangChain to orchestrate calls to the configured language model(s).
3. If images are needed, Django calls the Unsplash and/or Pexels APIs and returns image metadata or URLs with the generated text.
4. The front end displays the generated content and images; users can review, edit, and export.

## Getting started

### Prerequisites
- Node.js 16+ and npm or yarn
- Python 3.8+
- pip
- (Optional) Docker & Docker Compose
- API keys for your chosen model provider(s) (e.g., OpenAI) and for Unsplash and Pexels

### Frontend (Next.js)
1. Open a terminal and navigate to the frontend folder (commonly `/frontend` or `/web` — adjust to your repo layout).
2. Install dependencies:
   - npm: `npm install`
   - yarn: `yarn`
3. Run the dev server:
   - npm: `npm run dev`
   - yarn: `yarn dev`
4. By default Next.js runs on http://localhost:3000.

### Backend (Django)
1. Navigate to the backend folder (commonly `/backend` or `/api`).
2. Create and activate a virtual environment:
   - python: `python -m venv venv`
   - macOS/Linux: `source venv/bin/activate`
   - Windows (PowerShell): `.\venv\Scripts\Activate.ps1`
3. Install requirements:
   - `pip install -r requirements.txt`
4. Apply migrations:
   - `python manage.py migrate`
5. Create a superuser (optional, for admin):
   - `python manage.py createsuperuser`
6. Run the dev server:
   - `python manage.py runserver`
7. By default Django runs on http://127.0.0.1:8000.

### Environment variables
Create `.env` or set environment variables for both frontend and backend. Example variables (names may vary with your implementation):

Frontend (.env.local)
- NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
- NEXT_PUBLIC_PEXELS_KEY=your_pexels_api_key
- NEXT_PUBLIC_UNSPLASH_KEY=your_unsplash_api_key



Note: LangChain can be configured to use different providers — ensure you set the provider-specific keys and any model name identifiers your implementation expects.

## Example usage
Below is an example of a typical API request shape — adapt to your implementation's endpoints:

Example curl POST (adjust endpoint path to your API)
curl -X POST "http://localhost:8000/api/generate/" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "blog",
    "prompt": "Write a 600-word blog post about the benefits of microlearning for developers",
    "tone": "informative",
    "length": "medium"
  }'

Response (example)
{
  "title": "Microlearning: Boosting Developer Productivity with Bite-sized Lessons",
  "content": "....generated blog content....",
  "images": [
    {
      "source": "pexels",
      "url": "https://images.pexels.com/..."
    }
  ]
}

Frontend UI: choose a content type (blog, tweet, YouTube script, YouTube description, Instagram caption), enter a prompt and options, submit, review the generated text, and optionally fetch images.



## Contact
If you need to reach the team:
- Nishchay Mittal
- Neel Mhaske
- Leon Lobo

For repo-specific questions, open an issue in this repository: [Neel-Aiprog/Gen_AI_Content_Creation Issues](https://github.com/Neel-Aiprog/Gen_AI_Content_Creation/issues)
