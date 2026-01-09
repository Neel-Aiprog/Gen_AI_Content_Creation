'use client';

import { useState, useEffect, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import styles from "../page.module.css";
import { useRouter } from 'next/navigation';

export function MyButton({ to, children,  className = ''}) {
  const router = useRouter();

  return (
    <button onClick={() => router.push(to)} className={className}>
      {children}
    </button>
  );
}


export default function Home() {
  const [topic1, setTopic1] = useState("");
  const [topic2, setTopic2] = useState("");
  const [tone, setTone] = useState("scientific");
  const [article_regen, setArticle_regen] = useState("");
  const [article_script,setArticle_script] = useState("");        
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

 
  async function handleScript(e) {
    e.preventDefault();
    if (!topic1.trim()) return setError("Please enter a topic.");

    setLoading(true);
    setError("");
    setArticle_script("");
    setShowPexels(false);
    setPexels([]);

    try {
      const res = await fetch("/api/youtube-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic1, tone }),
      });

      const data = await res.json();
      setArticle_script(data.script);
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





  return (
    <div className={styles.page}>
      {/* MAIN YOUTUBE SCRIPT */}
      <main className={styles.main}>
        <div className={styles.buttonrow}>
        <MyButton to="/blog" className={styles.NavButton}>
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
        <h1 className={styles.title}>Genesis · AI Youtube script Generator</h1>

        <form className={styles.form} onSubmit={handleScript}>
          <textarea className={styles.textarea} placeholder="Enter youtube script topic..."
            value={topic1} onChange={e => setTopic1(e.target.value)} />

          <select className={styles.select} value={tone} onChange={e => setTone(e.target.value)}>
            <option value="scientific">Scientific</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="storytelling">Storytelling</option>
          </select>

          <button className={styles.generateButton} disabled={loading}>
            {loading ? "Generating..." : "Generate Youtube script"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.editorBox}>
          <div ref={toolbarRef1} />
          {article_script && editorLoaded && (
            <CKEditor
              editor={editorRef.current}
              data={article_script}
              onReady={editor => {
                toolbarRef1.current.innerHTML = "";
                toolbarRef1.current.appendChild(editor.ui.view.toolbar.element);
              }}
              onChange={(e, editor) => setArticle_script(editor.getData())}
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
      </main>

    </div>
  );
}