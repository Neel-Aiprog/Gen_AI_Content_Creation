# Gen AI Content Creation

![Project Banner](public/ai.svg) <!-- Add a banner if available, otherwise just use the logo path or remove -->

**Gen AI Content Creation** is a comprehensive content generation platform built by **Nishchay Mittal**, **Neel Mhaske**, and **Leon Lobo** for the Genesis competition. It leverages the power of generative AI to instantly create high-quality blog posts, tweets, YouTube scripts, descriptions, and Instagram captions.

The platform orchestrates **LangChain** and modern LLMs to generate text while seamlessly integrating with **Unsplash** and **Pexels** APIs to provide relevant, high-resolution imagery.

🔗 **Repository**: [Neel-Aiprog/Gen_AI_Content_Creation](https://github.com/Neel-Aiprog/Gen_AI_Content_Creation)

---

## 🚀 Features

- **Multi-Format Generation**: tailored flows for Blogs, Tweets, YouTube Scripts/Descriptions, and Instagram Captions.
- **Rich Text Editing**: Integrated **CKEditor** for polished writing and formatting.
- **Visuals on Demand**: Automatic image suggestions via Unsplash and Pexels.
- **PDF Export**: One-click export of generated content to PDF.
- **Responsive Design**: Modern, glassmorphism-inspired UI built with Next.js.
- **Robust Backend**: Scalable Django API handling complex generation logic and chaining.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (React, App Router)
- **Styling**: CSS Modules with modern variables & responsive design
- **Editor**: [CKEditor 5](https://ckeditor.com/)
- **State Management**: React Hooks

### Backend
- **Framework**: [Django](https://www.djangoproject.com/) & Django REST Framework
- **AI Orchestration**: [LangChain](https://www.langchain.com/)
- **Database**: SQLite (Development) / PostgreSQL (Production ready)

### APIs & Services
- **LLM Provider**: (Configurable, e.g., OpenAI, Google Gemini)
- **Image Services**: [Unsplash API](https://unsplash.com/developers), [Pexels API](https://www.pexels.com/api/)

## 📂 Project Structure

```bash
Gen_AI_Content_Creation/
├── frontend_genesis/
│   └── frontend/          # Next.js Application
├── backend_genesis/
│   └── backend/           # Django Application & API
└── README.md
```

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v16 or higher
- **Python**: v3.8 or higher
- **API Keys**:
  - OpenAI / Gemini (for generation)
  - Unsplash & Pexels (for images)

### 1️⃣ Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend_genesis/backend
   ```

2. Create a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the server:
   ```bash
   python manage.py runserver
   ```
   The backend will run at `http://localhost:8000`.

### 2️⃣ Frontend Setup (Next.js)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend_genesis/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in `frontend_genesis/frontend/`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   # Add other keys if required by your specific components
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 👥 Team

- **Nishchay Mittal**
- **Neel Mhaske**
- **Leon Lobo**

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
