'use client';

import { useState, useEffect, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import styles from "../page.module.css";
import { useRouter, usePathname } from 'next/navigation';

const waitForImages = (container) =>
  Promise.all(
    [...container.querySelectorAll("img")].map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise(resolve => {
            img.onload = img.onerror = resolve;
          })
    )
  );

function wrapImagesForPDF(container) {
  const images = [...container.querySelectorAll("img")];

  images.forEach(img => {
    // Skip if already wrapped
    if (img.closest(".pdf-image-block")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "pdf-image-block";

    // Insert wrapper before image
    img.parentNode.insertBefore(wrapper, img);

    // Move image into wrapper
    wrapper.appendChild(img);

    // If next element looks like a caption, move it too
    const next = wrapper.nextElementSibling;
    if (next && next.tagName === "P") {
      wrapper.appendChild(next);
    }
  });
}


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


export default function Home() {
  const [topic1, setTopic1] = useState("");
  const [topic2, setTopic2] = useState("");
  const [tone_insta, setTone_insta] = useState("casual");
  const [tone_regen, setTone_regen] = useState("casual");
  const [article_insta, setArticle_insta] = useState("");
  const [article_regen, setArticle_regen] = useState("");  
  const [loading_insta, setLoading_insta] = useState(false);
  const [loading_regen, setLoading_regen] = useState(false);
  const [error_insta, setError_insta] = useState("");
  const [error_regen, setError_regen] = useState("");

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
    if (!topic1.trim()) return setError_insta("Please enter a topic.");

    setLoading_insta(true);
    setError_insta("");
    setArticle_insta("");

    try {
      const res = await fetch("/api/instagram-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic1, tone_insta }),
      });

      const data = await res.json();
      setArticle_insta(data.insta_post);
    } catch {
      setError_insta("Backend error.");
    } finally {
      setLoading_insta(false);
    }
  }

  async function handleRegen(e) {
    e.preventDefault();
    if (!topic2.trim()) return setError_regen("Please enter text.");

    setLoading_regen(true);
    setError_regen("");
    setArticle_regen("");

    try {
      const res = await fetch("/api/regenerate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic2, tone_regen }),
      });

      const data = await res.json();
      setArticle_regen(data.regened);
    } catch {
      setError_regen("Backend error.");
    } finally {
      setLoading_regen(false);
    }
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className={styles.icon}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M32 176C32 134.5 63.6 100.4 104 96.4L104 96L384 96C437 96 480 139 480 192L480 368L304 368C264.2 368 232 400.2 232 440L232 500C232 524.3 212.3 544 188 544C163.7 544 144 524.3 144 500L144 272L80 272C53.5 272 32 250.5 32 224L32 176zM268.8 544C275.9 530.9 280 515.9 280 500L280 440C280 426.7 290.7 416 304 416L552 416C565.3 416 576 426.7 576 440L576 464C576 508.2 540.2 544 496 544L268.8 544zM112 144C94.3 144 80 158.3 80 176L80 224L144 224L144 176C144 158.3 129.7 144 112 144z"
            />
          </svg>
          <span>- Blog</span>
          </MyButton>
          <MyButton to="/tweet" className={styles.navButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className={styles.icon}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM457.1 180L353.3 298.6L475.4 460L379.8 460L305 362.1L219.3 460L171.8 460L282.8 333.1L165.7 180L263.7 180L331.4 269.5L409.6 180L457.1 180zM419.3 431.6L249.4 206.9L221.1 206.9L392.9 431.6L419.3 431.6z"
            />
          </svg>
          <span>- Tweet</span>
          </MyButton>
          <MyButton to="/yt_desc" className={styles.navButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className={styles.icon}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z"
            />
          </svg>
          <span>- Description</span>
        </MyButton>
          <MyButton to="/yt_script" className={styles.navButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className={styles.icon}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z"
            />
          </svg>
          <span>- Script</span>
          </MyButton>
          <MyButton to="/insta_post" className={styles.navButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className={styles.icon}
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"
              />
            </svg>

          <span>- Caption</span>
          </MyButton>
          <MyButton to="/reddit_post" className={styles.navButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className={styles.icon}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576L101.1 576C87.4 576 80.6 559.5 90.2 549.8L139 501C92.7 454.7 64 390.7 64 320zM413.6 217.6C437.2 217.6 456.3 198.5 456.3 174.9C456.3 151.3 437.2 132.2 413.6 132.2C393 132.2 375.8 146.8 371.8 166.2C337.3 169.9 310.4 199.2 310.4 234.6L310.4 234.8C272.9 236.4 238.6 247.1 211.4 263.9C201.3 256.1 188.6 251.4 174.9 251.4C141.9 251.4 115.1 278.2 115.1 311.2C115.1 335.2 129.2 355.8 149.5 365.3C151.5 434.7 227.1 490.5 320.1 490.5C413.1 490.5 488.8 434.6 490.7 365.2C510.9 355.6 524.8 335 524.8 311.2C524.8 278.2 498 251.4 465 251.4C451.3 251.4 438.7 256 428.6 263.8C401.2 246.8 366.5 236.1 328.6 234.7L328.6 234.5C328.6 209.1 347.5 188 372 184.6C376.4 203.4 393.3 217.4 413.5 217.4L413.6 217.6zM241.1 310.9C257.8 310.9 270.6 328.5 269.6 350.2C268.6 371.9 256.1 379.8 239.3 379.8C222.5 379.8 207.9 371 208.9 349.3C209.9 327.6 224.3 311 241 311L241.1 310.9zM431.2 349.2C432.2 370.9 417.5 379.7 400.8 379.7C384.1 379.7 371.5 371.8 370.5 350.1C369.5 328.4 382.3 310.8 399 310.8C415.7 310.8 430.2 327.4 431.1 349.1L431.2 349.2zM383.1 405.9C372.8 430.5 348.5 447.8 320.1 447.8C291.7 447.8 267.4 430.5 257.1 405.9C255.9 403 257.9 399.7 261 399.4C279.4 397.5 299.3 396.5 320.1 396.5C340.9 396.5 360.8 397.5 379.2 399.4C382.3 399.7 384.3 403 383.1 405.9z"
            />
          </svg>
          <span>- Post</span>
          </MyButton>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className={styles.contentWrapper}>
        {/* LEFT COLUMN - INSTAGRAM CAPTION GENERATOR */}
        <div className={styles.column}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>📝</span>
                Instagram caption Generator
              </h2>
              <p className={styles.cardSubtitle}>Generate comprehensive instagram caption</p>
            </div>

            <form className={styles.form} onSubmit={handleInstaPost}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Topic</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Enter your instagram caption topic here..."
                  value={topic1} 
                  onChange={e => setTopic1(e.target.value)}
                  rows={4}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Target Tone</label>
                <select className={styles.select} value={tone_insta} onChange={e => setTone_insta(e.target.value)}>
                  <option value="scientific">Scientific</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>

              <button 
                className={`${styles.generateButton} ${loading_insta ? styles.loading : ''}`} 
                disabled={loading_insta}
                type="submit"
              >
                {loading_insta ? (
                  <>
                    <span className={styles.spinner}></span>
                    Generating...
                  </>
                ) : "Generate Instagram caption"}
              </button>
            </form>

            {error_insta && <div className={styles.errorMessage}>{error_insta}</div>}

            <div className={styles.editorContainer}>
              <div className={styles.editorHeader}>
                <span>Generated Content</span>
              </div>
              <div className={styles.editorBox}>
                <div ref={toolbarRef1} className={styles.toolbarContainer} />
                {article_insta && editorLoaded ? (
                  <CKEditor
                    editor={editorRef.current}
                    data={article_insta}
                    onReady={editor => {
                    const toolbar = editor.ui.view.toolbar.element;

                    // keep your existing logic
                    toolbarRef1.current.innerHTML = "";
                    toolbarRef1.current.appendChild(toolbar);

                                        const pdfBtn = document.createElement("button");
                      pdfBtn.type = "button";
                      pdfBtn.className = "ck ck-button ck-off";
                      pdfBtn.title = "Export to PDF";

                      // PDF icon (SVG)
                    pdfBtn.innerHTML = `
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        class="clipboard-icon"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"
                        />
                      </svg>
                    `;


                    pdfBtn.onclick = async () => {
                      const html2pdf = (await import("html2pdf.js")).default;

                      const content = editor.getData();
                      const wrapper = document.createElement("div");
                      wrapper.innerHTML = content;
                      wrapImagesForPDF(wrapper);

                      // Fix colors for PDF
                      wrapper.style.color = "#000";
                      wrapper.style.background = "#fff";
                      wrapper.querySelectorAll("*").forEach(el => {
                        el.style.color = "#000";
                      });

                      // Enable Unsplash images
                      wrapper.querySelectorAll("img").forEach(img => {
                        img.setAttribute("crossorigin", "anonymous");
                      });

                      // Prevent image cutting & scale flexibly
                    const style = document.createElement("style");
                    style.innerHTML = `

                      img {
                        max-width: 100%;
                        height: auto !important;
                        display: block;
                        object-fit: contain;
                      }

                      .pdf-image-block {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                        padding-top: 1rem;
                      }


                    `;
                    wrapper.appendChild(style);

                      // ⏳ Wait for images
                      await waitForImages(wrapper);

                      // Generate PDF
                      html2pdf()
                        .from(wrapper)
                        .set({
                          margin: [15, 10, 15, 10],
                          filename: "document.pdf",
                          pagebreak: {
                          mode: ["css", "legacy"]
                        },
                          html2canvas: {
                            scale: 2,
                            useCORS: true,
                            allowTaint: false
                          },
                          jsPDF: {
                            unit: "mm",
                            format: "a4",
                            orientation: "portrait"
                          }
                        })
                        .save();
                    };

                    toolbar.appendChild(pdfBtn);

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
                    onChange={(e, editor) => setArticle_insta(editor.getData())}
                  />
                ) : (
                  <div className={styles.editorPlaceholder}>
                    <div className={styles.placeholderIcon}>✨</div>
                    <p>Your generated instagram caption will appear here...</p>
                    <p className={styles.placeholderHint}>Enter a topic and click "Generate Instagram caption"</p>
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
                <select className={styles.select} value={tone_regen} onChange={e => setTone_regen(e.target.value)}>
                  <option value="scientific">Scientific</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>

              <button 
                className={`${styles.generateButton} ${loading_regen ? styles.loading : ''}`} 
                disabled={loading_regen}
                type="submit"
              >
                {loading_regen ? (
                  <>
                    <span className={styles.spinner}></span>
                    Regenerating...
                  </>
                ) : "Regenerate Text"}
              </button>
            </form>

            {error_regen && <div className={styles.errorMessage}>{error_regen}</div>}

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

                      const pdfBtn = document.createElement("button");
                      pdfBtn.type = "button";
                      pdfBtn.className = "ck ck-button ck-off";
                      pdfBtn.title = "Export to PDF";

                      // PDF icon (SVG)
                    pdfBtn.innerHTML = `
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        class="clipboard-icon"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"
                        />
                      </svg>
                    `;


                    pdfBtn.onclick = async () => {
                      const html2pdf = (await import("html2pdf.js")).default;

                      const content = editor.getData();
                      const wrapper = document.createElement("div");
                      wrapper.innerHTML = content;
                      wrapImagesForPDF(wrapper);

                      // Fix colors for PDF
                      wrapper.style.color = "#000";
                      wrapper.style.background = "#fff";
                      wrapper.querySelectorAll("*").forEach(el => {
                        el.style.color = "#000";
                      });

                      // Enable Unsplash images
                      wrapper.querySelectorAll("img").forEach(img => {
                        img.setAttribute("crossorigin", "anonymous");
                      });

                      // Prevent image cutting & scale flexibly
                    const style = document.createElement("style");
                    style.innerHTML = `

                      img {
                        max-width: 100%;
                        height: auto !important;
                        display: block;
                        object-fit: contain;
                      }

                      .pdf-image-block {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                        padding-top: 1rem;
                      }


                    `;
                    wrapper.appendChild(style);

                      // ⏳ Wait for images
                      await waitForImages(wrapper);

                      // Generate PDF
                      html2pdf()
                        .from(wrapper)
                        .set({
                          margin: [15, 10, 15, 10],
                          filename: "document.pdf",
                          pagebreak: {
                          mode: ["css", "legacy"]
                        },
                          html2canvas: {
                            scale: 2,
                            useCORS: true,
                            allowTaint: false
                          },
                          jsPDF: {
                            unit: "mm",
                            format: "a4",
                            orientation: "portrait"
                          }
                        })
                        .save();
                    };

                    toolbar.appendChild(pdfBtn);

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

      
    </div>
  );
}