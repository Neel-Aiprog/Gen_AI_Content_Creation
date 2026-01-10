'use client';

import { useState, useEffect, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import styles from "../page.module.css";
import { useRouter, usePathname } from 'next/navigation';

export function MyButton({ to, children, className = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <button 
      onClick={() => router.push(to)} 
      className={`${className} ${isActive ? styles.active : ''}`}
    >
      {children}
    </button>
  );
}

/* UNSPLASH INJECTOR */
function renderTextWithImages(text, images = []) {
  // Render all paragraphs first
  const paragraphsHTML = text
    .split(/\n+/)
    .map(p => `<p>${p}</p>`)
    .join("");

  // If no images, just return text
  if (!images.length) return paragraphsHTML;

  // Take only first 3 images
  const imagesHTML = images.slice(0, 3).map(img => `
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
  `).join("");

  // Text first, images last
  return paragraphsHTML + imagesHTML;
}

export default function Home() {
  const [topic1, setTopic1] = useState("");
  const [topic2, setTopic2] = useState("");
  const [tone, setTone] = useState("scientific");
  const [article_reddit, setArticle_reddit] = useState("");
  const [article_regen, setArticle_regen] = useState("");      
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

  async function handleRedditPost(e) {
    e.preventDefault();
    if (!topic1.trim()) return setError("Please enter a topic.");

    setLoading(true);
    setError("");
    setArticle_reddit("");

    try {
      const res = await fetch("/api/reddit-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic1, tone }),
      });

      const data = await res.json();
      setArticle_reddit(renderTextWithImages(data.reddit_post, data.images));
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
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span className={styles.logoText}>Genesis</span>
          <span className={styles.logoSubtext}>AI Content Studio</span>
        </div>
        <div className={styles.navButtons}>
          <MyButton to="/blo" className={styles.navButton}>
            Blo
          </MyButton>
          <MyButton to="/tweet" className={styles.navButton}>
            Twitter
          </MyButton>
          <MyButton to="/yt_desc" className={styles.navButton}>
            YT Desc
          </MyButton>
          <MyButton to="/yt_script" className={styles.navButton}>
            YT Script
          </MyButton>
          <MyButton to="/insta_post" className={styles.navButton}>
            Instagram
          </MyButton>
          <MyButton to="/reddit_post" className={styles.navButton}>
            Reddit
          </MyButton>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className={styles.contentWrapper}>
        {/* LEFT COLUMN - REDDIT POST GENERATOR */}
        <div className={styles.column}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>📝</span>
                Reddit post Generator
              </h2>
              <p className={styles.cardSubtitle}>Generate comprehensive reddit post articles</p>
            </div>

            <form className={styles.form} onSubmit={handleRedditPost}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Topic</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Enter your reddit post topic here..."
                  value={topic1} 
                  onChange={e => setTopic1(e.target.value)}
                  rows={4}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Tone</label>
                <select className={styles.select} value={tone} onChange={e => setTone(e.target.value)}>
                  <option value="scientific">Scientific</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>

              <button 
                className={`${styles.generateButton} ${loading ? styles.loading : ''}`} 
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Generating...
                  </>
                ) : "Generate Reddit post"}
              </button>
            </form>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.editorContainer}>
              <div className={styles.editorHeader}>
                <span>Generated Content</span>
                {article_reddit && (
                  <button 
                    className={styles.suggestImagesButton}
                    onClick={loadPexels}
                  >
                    Suggest Images
                  </button>
                )}
              </div>
              <div className={styles.editorBox}>
                <div ref={toolbarRef1} className={styles.toolbarContainer} />
                {article_reddit && editorLoaded ? (
                  <CKEditor
                    editor={editorRef.current}
                    data={article_reddit}
                    onReady={editor => {
                      toolbarRef1.current.innerHTML = "";
                      toolbarRef1.current.appendChild(editor.ui.view.toolbar.element);
                    }}
                    onChange={(e, editor) => setArticle_reddit(editor.getData())}
                  />
                ) : (
                  <div className={styles.editorPlaceholder}>
                    <div className={styles.placeholderIcon}>✨</div>
                    <p>Your generated reddit post will appear here...</p>
                    <p className={styles.placeholderHint}>Enter a topic and click "Generate Reddit post"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - REGENERATE TEXT */}
        <div className={styles.column}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>🔄</span>
                Text Regenerator
              </h2>
              <p className={styles.cardSubtitle}>Rewrite and improve existing content</p>
            </div>

            <form className={styles.form} onSubmit={handleRegen}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Text to Regenerate</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Paste text here to rewrite..."
                  value={topic2} 
                  onChange={e => setTopic2(e.target.value)}
                  rows={4}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Target Tone</label>
                <select className={styles.select} value={tone} onChange={e => setTone(e.target.value)}>
                  <option value="scientific">Scientific</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>

              <button 
                className={`${styles.generateButton} ${loading ? styles.loading : ''}`} 
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Regenerating...
                  </>
                ) : "Regenerate Text"}
              </button>
            </form>

            <div className={styles.editorContainer}>
              <div className={styles.editorHeader}>
                <span>Regenerated Content</span>
              </div>
              <div className={styles.editorBox}>
                <div ref={toolbarRef2} className={styles.toolbarContainer} />
                {article_regen && editorLoaded ? (
                  <CKEditor
                    editor={editorRef.current}
                    data={article_regen}
                    onReady={editor => {
                      toolbarRef2.current.innerHTML = "";
                      toolbarRef2.current.appendChild(editor.ui.view.toolbar.element);
                    }}
                    onChange={(e, editor) => setArticle_regen(editor.getData())}
                  />
                ) : (
                  <div className={styles.editorPlaceholder}>
                    <div className={styles.placeholderIcon}>📝</div>
                    <p>Your regenerated text will appear here...</p>
                    <p className={styles.placeholderHint}>Enter text and click "Regenerate Text"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE SUGGESTIONS DRAWER */}
      {showPexels && (
        <div className={styles.pexelsDrawer}>
          <div className={styles.drawerHeader}>
            <div className={styles.drawerTitle}>
              <span className={styles.drawerIcon}>🖼️</span>
              Image Suggestions from Pexels
              <span className={styles.drawerCount}>({pexels.length} images)</span>
            </div>
            <button 
              className={styles.drawerClose}
              onClick={() => setShowPexels(false)}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.drawerContent}>
            <div className={styles.drawerGrid}>
              {pexels.map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img
                    src={img.src.medium}
                    className={styles.drawerImg}
                    alt={img.alt || "Unsplash image"}
                    onClick={() => {
                      setArticle_regen(prev => prev + `
                        <p style="text-align:center">
                          <img src="${img.src.large}" style="max-width:100%;border-radius:14px"/>
                          <br/><em>${img.alt || "Photo"} — ${img.photographer}</em>
                        </p>`);
                      setShowPexels(false);
                    }}
                  />
                  <div className={styles.imageInfo}>
                    <span className={styles.imagePhotographer}>{img.photographer}</span>
                    <span className={styles.imageDimensions}>{img.width} × {img.height}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}