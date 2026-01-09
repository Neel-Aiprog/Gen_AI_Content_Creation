'use client';

import { useState, useEffect, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import styles from "./page.module.css";

/* UNSPLASH INJECTOR */
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
          <img src="${img.urls.regular}" style="max-width:100%;border-radius:14px"/>
          <br/>
          <em style="font-size:13px;color:#aaa">
            ${img.alt_description || "Photo"} — by ${img.user.name} (Unsplash)
          </em>
        </p>`;
    }
    return p;
  }).join("");
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("scientific");
  const [article1, setArticle1] = useState("");
  const [article2, setArticle2] = useState("");
  const [pexels, setPexels] = useState([]);
  const [showPexels, setShowPexels] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editorRef = useRef(null);
  const toolbarRef1 = useRef(null);
  const toolbarRef2 = useRef(null);
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
    setArticle1("");

    try {
      const res = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone }),
      });

      const data = await res.json();
      setArticle1(injectImagesIntoHtml(data.blog, data.images));
    } catch {
      setError("Backend error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegen(e) {
    e.preventDefault();
    if (!topic.trim()) return setError("Please enter text.");

    setLoading(true);
    setError("");
    setArticle2("");
    setShowPexels(false);
    setPexels([]);

    try {
      const res = await fetch("/api/regenerate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone }),
      });

      const data = await res.json();
      setArticle2(data.regened);
    } catch {
      setError("Backend error.");
    } finally {
      setLoading(false);
    }
  }

  async function loadPexels() {
    if (!topic.trim()) return alert("Enter text first");

    setShowPexels(true);
    const res = await fetch(`/api/pexels-suggestions?q=${encodeURIComponent(topic)}`);
    const data = await res.json();
    setPexels(data.photos || []);
  }

  return (
    <div className={styles.page}>
      {/* MAIN BLOG */}
      <main className={styles.main}>
        <h1 className={styles.title}>Genesis · AI Blog Generator</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <textarea className={styles.textarea} placeholder="Enter blog topic..."
            value={topic} onChange={e => setTopic(e.target.value)} />

          <select className={styles.select} value={tone} onChange={e => setTone(e.target.value)}>
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
          <div ref={toolbarRef1} />
          {article1 && editorLoaded && (
            <CKEditor
              editor={editorRef.current}
              data={article1}
              onReady={editor => {
                toolbarRef1.current.innerHTML = "";
                toolbarRef1.current.appendChild(editor.ui.view.toolbar.element);
              }}
              onChange={(e, editor) => setArticle1(editor.getData())}
            />
          )}
        </div>
      </main>

      {/* REGENERATE */}
      <main className={styles.main}>
        <h1 className={styles.title}>Regenerate Text</h1>

        <form className={styles.form} onSubmit={handleRegen}>
          <textarea className={styles.textarea} placeholder="Enter text to regenerate..."
            value={topic} onChange={e => setTopic(e.target.value)} />

          <select className={styles.select} value={tone} onChange={e => setTone(e.target.value)}>
            <option value="scientific">Scientific</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="storytelling">Storytelling</option>
          </select>

          <button className={styles.generateButton} disabled={loading}>
            {loading ? "Regenerating..." : "Regenerate Text"}
          </button>
        </form>

        <div className={styles.editorBox}>
          <div ref={toolbarRef2} />
          {article2 && editorLoaded && (
            <CKEditor
              editor={editorRef.current}
              data={article2}
              onReady={editor => {
                toolbarRef2.current.innerHTML = "";
                toolbarRef2.current.appendChild(editor.ui.view.toolbar.element);
              }}
              onChange={(e, editor) => setArticle2(editor.getData())}
            />
          )}
        </div>

        <button className={styles.generateButton} onClick={loadPexels}>
          Show Image Suggestions
        </button>
      </main>

      {/* PEXELS DRAWER */}
      {showPexels && (
        <div className={styles.pexelsDrawer}>
          <div className={styles.drawerHeader}>
            <span>Image Suggestions (Pexels)</span>
            <button onClick={() => setShowPexels(false)}>✕</button>
          </div>

          <div className={styles.drawerGrid}>
            {pexels.map((img, i) => (
              <img
                key={i}
                src={img.src.medium}
                className={styles.drawerImg}
                onClick={() => {
                  setArticle2(prev => prev + `
                    <p style="text-align:center">
                      <img src="${img.src.large}" style="max-width:100%;border-radius:14px"/>
                      <br/><em>${img.alt || "Photo"} — ${img.photographer}</em>
                    </p>`);
                  setShowPexels(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
