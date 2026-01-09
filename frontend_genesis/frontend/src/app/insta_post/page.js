'use client';

import { useState, useEffect, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import styles from "../page.module.css";
import { useRouter } from 'next/navigation';

export function MyButton({ to, children, className = ''}) {
  const router = useRouter();

  return (
    <button onClick={() => router.push(to)} className={className}>
      {children}
    </button>
  );
}

/* UNSPLASH INJECTOR */
function injectImagesIntoHtml(text, images) {
  if (!images?.length) return `<p>${text.replace(/\n+/g, "</p><p>")}</p>`;

  const paragraphs = text.split(/\n+/).map(p => `<p>${p}</p>`);
  let i = 0;

  return paragraphs.map((p, idx) => {
    if (idx > 0 && i < idx && i < images.length) {
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
  const [topic1, setTopic1] = useState("");
  const [topic2, setTopic2] = useState("");
  const [tone, setTone] = useState("scientific");
  const [article_regen, setArticle_regen] = useState("");
  const [article_insta, setArticle_insta] = useState("");        
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

 
  async function handleInstaPost(e) {
    e.preventDefault();
    if (!topic1.trim()) return setError("Please enter a topic1.");

    setLoading(true);
    setError("");
    setArticle_insta("");

    try {
      const res = await fetch("/api/instagram-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic1, tone }),
      });

      const data = await res.json();
      setArticle_insta(injectImagesIntoHtml(data.insta_post, data.images));
    } catch {
      setError("Backend error.");
    } finally {
      setLoading(false);
    }
  }



  async function handleRegen(e) {
    e.preventDefault();
    if (!topic2.trim()) return setError("Please enter text.");

    setLoading(true);
    setError("");
    setArticle_regen("");
    setShowPexels(false);
    setPexels([]);

    try {
      const res = await fetch("/api/regenerate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic2, tone }),
      });

      const data = await res.json();
      setArticle_regen(data.regened);
    } catch {
      setError("Backend error.");
    } finally {
      setLoading(false);
    }
  }  


  async function loadPexels() {
    if (!topic1.trim()) return alert("Enter text first");

    setShowPexels(true);
    const res = await fetch(`/api/pexels-suggestions?q=${encodeURIComponent(topic1)}`);
    const data = await res.json();
    setPexels(data.photos || []);
  }





  return (
    <div className={styles.page}>
      {/* MAIN INSTAGRAM CAPTION */}
      <main className={styles.main}>
        <div className={styles.buttonrow}>
                <MyButton to="/blog" className={styles.NavButton} >
                  Blog
                </MyButton>
                <MyButton to="/tweet"className={styles.NavButton}>
                  Twitter
                </MyButton>
                <MyButton to="/yt_desc"className={styles.NavButton}>
                  Yt Desc
                </MyButton>
                <MyButton to="/yt_script"className={styles.NavButton}>
                  Yt Script
                </MyButton>
                <MyButton to="/insta_post"className={styles.NavButton}>
                  Insta
                </MyButton>
                <MyButton to="/reddit_post"className={styles.NavButton}>
                  Reddit
                </MyButton>
              </div>
        <h1 className={styles.title}>Genesis · AI Instagram caption Generator</h1>

        <form className={styles.form} onSubmit={handleInstaPost}>
          <textarea className={styles.textarea} placeholder="Enter instagram caption topic..."
            value={topic1} onChange={e => setTopic1(e.target.value)} />

          <select className={styles.select} value={tone} onChange={e => setTone(e.target.value)}>
            <option value="scientific">Scientific</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="storytelling">Storytelling</option>
          </select>

          <button className={styles.generateButton} disabled={loading}>
            {loading ? "Generating..." : "Generate Instagram caption"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.editorBox}>
          <div ref={toolbarRef1} />
          {article_insta && editorLoaded && (
            <CKEditor
              editor={editorRef.current}
              data={article_insta}
              onReady={editor => {
                toolbarRef1.current.innerHTML = "";
                toolbarRef1.current.appendChild(editor.ui.view.toolbar.element);
              }}
              onChange={(e, editor) => setArticle_insta(editor.getData())}
            />
          )}
        </div>
      </main>

      {/* REGENERATE */}
      <main className={styles.main}>
        <h1 className={styles.title}>Regenerate Text</h1>

        <form className={styles.form} onSubmit={handleRegen}>
          <textarea className={styles.textarea} placeholder="Enter text to regenerate..."
            value={topic2} onChange={e => setTopic2(e.target.value)} />

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
          {article_regen && editorLoaded && (
            <CKEditor
              editor={editorRef.current}
              data={article_regen}
              onReady={editor => {
                toolbarRef2.current.innerHTML = "";
                toolbarRef2.current.appendChild(editor.ui.view.toolbar.element);
              }}
              onChange={(e, editor) => setArticle_regen(editor.getData())}
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
                  setArticle_regen(prev => prev + `
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