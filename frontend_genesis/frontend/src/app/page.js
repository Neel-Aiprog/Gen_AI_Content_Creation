'use client';

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

const API_URL = "http://localhost:8000/api/generate-blog/";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("scientific");
  const [plan, setPlan] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError("");
    setPlan("");
    setArticle("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, tone }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setPlan(data.plan || "");
      setArticle(data.blog || data.article || "");
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while generating content. Make sure the backend API is running at " +
          API_URL
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.logoRow}>
            <Image
              className={styles.logo}
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <span className={styles.badge}>Genesis · AI Content Builder</span>
          </div>
          <h1 className={styles.title}>Generate SEO blog content with AI</h1>
          <p className={styles.subtitle}>
            Enter a topic and tone, and we&apos;ll create both an SEO content plan and a
            short blog article using your backend LLM pipeline.
          </p>
        </header>

        <section className={styles.content}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label htmlFor="topic" className={styles.label}>
                Topic
              </label>
              <textarea
                id="topic"
                className={styles.textarea}
                placeholder="e.g. Introduction to LangChain for beginners"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="tone" className={styles.label}>
                  Tone
                </label>
                <select
                  id="tone"
                  className={styles.select}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="scientific">Scientific</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>

              <button
                type="submit"
                className={styles.generateButton}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}
          </form>

          <div className={styles.results}>
            <div className={styles.resultCard}>
              <h2 className={styles.resultTitle}>SEO Plan</h2>
              <div className={styles.resultBody}>
                {plan ? (
                  <pre className={styles.pre}>{plan}</pre>
                ) : (
                  <p className={styles.placeholder}>
                    The structured SEO plan from the LLM will appear here.
                  </p>
                )}
              </div>
            </div>

            <div className={styles.resultCard}>
              <h2 className={styles.resultTitle}>Generated Blog Article</h2>
              <div className={styles.resultBody}>
                {article ? (
                  <p className={styles.article}>{article}</p>
                ) : (
                  <p className={styles.placeholder}>
                    The final ~100-word blog article will appear here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}