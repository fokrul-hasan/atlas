"use client";

import { useEffect, useRef, useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  async function handleShareClick() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — do nothing
      }
    } else {
      setMenuOpen((open) => !open);
    }
  }

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const temp = document.createElement("textarea");
      temp.value = url;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
    setCopied(true);
    setMenuOpen(false);
    setTimeout(() => setCopied(false), 1800);
  }

  const facebookHref =
    typeof window !== "undefined"
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
      : "#";

  return (
    <div className="share-wrap" ref={wrapRef}>
      <button className="share-btn" onClick={handleShareClick}>
        <span>⤴</span> Share
      </button>
      <span className={`copied-note${copied ? " show" : ""}`}>Link copied</span>
      {menuOpen && (
        <div className="share-menu">
          <a href={facebookHref} target="_blank" rel="noopener noreferrer">
            Share to Facebook
          </a>
          <div className="divider" />
          <button onClick={copyLink}>Copy link</button>
        </div>
      )}
    </div>
  );
}
