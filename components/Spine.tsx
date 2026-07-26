"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "I" },
  { id: "thoughts", label: "II" },
  { id: "playground", label: "III" },
  { id: "recipes", label: "IV" },
];

export default function Spine() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="spine" aria-label="Section navigation">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          className={`num${active === s.id ? " active" : ""}`}
          href={`#${s.id}`}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
