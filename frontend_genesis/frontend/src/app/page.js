'use client';

import { useState, useEffect, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import styles from "./page.module.css";

/* 🔥 UNSPLASH HTML INJECTOR */
function injectImagesIntoHtml(text, images) {
  if (!images?.length) return `<p>${text.replace(/\n+/g, "</p><p>")}</p>`;

  const paragraphs = text.split(/\n+/).map(p => `<p>${p}</p>`);
  let i = 0;

  return paragraphs.map((p, idx) => {
    if (idx > 0 && idx % 2 === 0 && i < images.length) {
      const img = images[i++];
      return `
        ${p}
        <p style="text-align:center">
          <img 
            src="${img.urls.regular}" 
            style="max-width:100%;border-radius:14px" 
          />
          <br/>
          <em style="font-size:13px;color:#aaa">
            ${img.alt_description || "Photo"} — by ${img.user.name} (Unsplash)
          </em>
        </p>
      `;
    }
    return p;
  }).join("");
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("scientific");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    import('@ckeditor/ckeditor5-build-classic').then(mod => {
      editorRef.current = mod.default;
      setEditorLoaded(true);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!topic.trim()) return setError("Please enter a topic.");

    setLoading(true);
    setError("");
    setArticle("");

    try {
      const res = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone }),
      });

      const data = await res.json();
      const embedded = injectImagesIntoHtml(data.blog, data.images);
      setArticle(embedded);

    } catch {
      setError("Backend error. Make sure servers are running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Genesis · AI Blog Generator</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder="Enter blog topic..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />

          <select
            className={styles.select}
            value={tone}
            onChange={e => setTone(e.target.value)}
          >
            <option value="scientific">Scientific</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="storytelling">Storytelling</option>
          </select>

          <button className={styles.generateButton} disabled={loading}>
            {loading ? "Generating..." : "Generate Blog"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.editorBox}>
          <div ref={toolbarRef} />

          {article && editorLoaded && (
            <CKEditor
              editor={editorRef.current}
              data={article}
              onReady={(editor) => {
                toolbarRef.current.innerHTML = "";
                toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
              }}
              onChange={(e, editor) => setArticle(editor.getData())}
              config={{
                toolbar: [
                  'heading','|','bold','italic','link',
                  '|','imageUpload','insertImage',
                  '|','bulletedList','numberedList',
                  '|','undo','redo'
                ],
                image: {
                  toolbar: [ 'imageTextAlternative', 'imageStyle:inline', 'imageStyle:block' ]
                }
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
