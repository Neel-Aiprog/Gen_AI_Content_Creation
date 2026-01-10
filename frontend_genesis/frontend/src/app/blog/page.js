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
  const [article1, setArticle1] = useState("");
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!topic1.trim()) return setError("Please enter a topic.");

    setLoading(true);
    setError("");
    setArticle1("");

    try {
      const res = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic1, tone }),
      });

      const data = await res.json();
      setArticle1(renderTextWithImages(data.blog, data.images));
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
          <MyButton to="/blog" className={styles.navButton}>
            Blog
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
        {/* LEFT COLUMN - BLOG GENERATOR */}
        <div className={styles.column}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>📝</span>
                Blog Generator
              </h2>
              <p className={styles.cardSubtitle}>Generate comprehensive blog articles</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Topic</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Enter your blog topic here..."
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
                ) : "Generate Blog"}
              </button>
            </form>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.editorContainer}>
              <div className={styles.editorHeader}>
                <span>Generated Content</span>
                {article1 && (
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
                {article1 && editorLoaded ? (
                  <CKEditor
                    editor={editorRef.current}
                    data={article1}
                   onReady={editor => {
                    const toolbar = editor.ui.view.toolbar.element;

                    // keep your existing logic
                    toolbarRef1.current.innerHTML = "";
                    toolbarRef1.current.appendChild(toolbar);

                    // ---------- ADD COPY BUTTON ----------
                    const copyBtn = document.createElement("button");
                    copyBtn.type = "button";
                    copyBtn.title = "Copy";
                    copyBtn.className = "ck ck-button ck-off";
                    copyBtn.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          fill="currentColor"
                          class="clipboard-icon">
                        <path d="M480 400L288 400C279.2 400 272 392.8 272 384L272 128C272 119.2 279.2 112 288 112L421.5 112C425.7 112 429.8 113.7 432.8 116.7L491.3 175.2C494.3 178.2 496 182.3 496 186.5L496 384C496 392.8 488.8 400 480 400zM288 448L480 448C515.3 448 544 419.3 544 384L544 186.5C544 169.5 537.3 153.2 525.3 141.2L466.7 82.7C454.7 70.7 438.5 64 421.5 64L288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L368 496L368 512C368 520.8 360.8 528 352 528L160 528C151.2 528 144 520.8 144 512L144 256C144 247.2 151.2 240 160 240L176 240L176 192L160 192z"/>
                      </svg>
                      `;



                    copyBtn.onclick = async () => {
                      const html = editor.getData();
                      const temp = document.createElement("div");
                      temp.innerHTML = html;
                      const text = temp.innerText;

                      if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(text);
                      } else {
                        // fallback (important)
                        const textarea = document.createElement("textarea");
                        textarea.value = text;
                        textarea.style.position = "fixed";
                        textarea.style.opacity = "0";
                        document.body.appendChild(textarea);
                        textarea.focus();
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);
                      }
                    };

                    toolbar.appendChild(copyBtn);
                  }}

                    onChange={(e, editor) => setArticle1(editor.getData())}
                  />
                ) : (
                  <div className={styles.editorPlaceholder}>
                    <div className={styles.placeholderIcon}>✨</div>
                    <p>Your generated blog will appear here...</p>
                    <p className={styles.placeholderHint}>Enter a topic and click "Generate Blog"</p>
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
                    const toolbar = editor.ui.view.toolbar.element;

                    // keep your existing logic
                    toolbarRef2.current.innerHTML = "";
                    toolbarRef2.current.appendChild(toolbar);

                   // ---------- ADD COPY BUTTON ----------
                    const copyBtn = document.createElement("button");
                    copyBtn.type = "button";
                    copyBtn.title = "Copy";
                    copyBtn.className = "ck ck-button ck-off";
                    copyBtn.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          fill="currentColor"
                          class="clipboard-icon">
                        <path d="M480 400L288 400C279.2 400 272 392.8 272 384L272 128C272 119.2 279.2 112 288 112L421.5 112C425.7 112 429.8 113.7 432.8 116.7L491.3 175.2C494.3 178.2 496 182.3 496 186.5L496 384C496 392.8 488.8 400 480 400zM288 448L480 448C515.3 448 544 419.3 544 384L544 186.5C544 169.5 537.3 153.2 525.3 141.2L466.7 82.7C454.7 70.7 438.5 64 421.5 64L288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L368 496L368 512C368 520.8 360.8 528 352 528L160 528C151.2 528 144 520.8 144 512L144 256C144 247.2 151.2 240 160 240L176 240L176 192L160 192z"/>
                      </svg>
                      `;

                    copyBtn.onclick = async () => {
                      const html = editor.getData();
                      const temp = document.createElement("div");
                      temp.innerHTML = html;
                      const text = temp.innerText;

                      if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(text);
                      } else {
                        // fallback (important)
                        const textarea = document.createElement("textarea");
                        textarea.value = text;
                        textarea.style.position = "fixed";
                        textarea.style.opacity = "0";
                        document.body.appendChild(textarea);
                        textarea.focus();
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);
                      }
                    };

                    toolbar.appendChild(copyBtn);
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