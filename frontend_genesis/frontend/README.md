This is a [Next.js](https://nextjs.org) project for AI Content Creation.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with:

```
BACKEND_URL=http://localhost:8000
```

For production, set the `BACKEND_URL` environment variable to your deployed Django backend URL.

## Deploy on Vercel

1. Push this code to a Git repository.
2. Connect your repository to [Vercel](https://vercel.com).
3. In Vercel dashboard, go to your project settings and add the `BACKEND_URL` environment variable pointing to your deployed Django backend.
4. Deploy!

The app will automatically build and deploy using Next.js on Vercel.
