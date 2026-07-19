"use client";

import { useMemo, useRef, useState } from "react";

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  existingTags: string[];
}

export default function TagInput({ value, onChange, existingTags }: Props) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [];
    return existingTags
      .filter((t) => t.toLowerCase().includes(q) && !value.some((v) => v.toLowerCase() === t.toLowerCase()))
      .slice(0, 6);
  }, [input, existingTags, value]);

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setInput("");
      return; // already added, avoid duplicate chip
    }
    onChange([...value, trimmed]);
    setInput("");
    setShowSuggestions(false);
  }

  function removeTag(tag: string) {
    onChange(value.filter((v) => v !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      const lastTag = value[value.length - 1];
      if (lastTag !== undefined) removeTag(lastTag);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          padding: "8px 10px",
          border: "1px solid var(--border)",
          borderRadius: 6,
          background: "var(--surface)",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              padding: "4px 10px",
              borderRadius: 100,
              border: "1px solid var(--border)",
              color: "var(--fg)",
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-muted)", fontSize: 13, lineHeight: 1, padding: 0 }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? "Type a tag and press Enter…" : ""}
          style={{
            flex: 1,
            minWidth: 120,
            border: "none",
            background: "transparent",
            color: "var(--fg)",
            fontSize: 14,
            outline: "none",
            padding: "4px 2px",
          }}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            overflow: "hidden",
            zIndex: 10,
            boxShadow: "0 16px 40px -14px rgba(0,0,0,0.35)",
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => e.preventDefault()} // keep input focused so onBlur doesn't fire first
              onClick={() => addTag(s)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                background: "none",
                border: "none",
                color: "var(--fg)",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
