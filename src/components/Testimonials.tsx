"use client";

import { useState } from "react";
import Separator from "./Separator";

type Testimonial = {
  image: string;
  name: string;
  credentials: string;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    image: "/testimonials/jose-paul.png",
    name: "Jose Paul",
    credentials: "Founder @ Bitmor, Ex-PM @ QuillAudits",
    quote:
      "Venkat is a go-getter in a traditionally slower-paced design function. He approaches problems with a fresh perspective and possesses a great sense of aesthetics. He can prototype very fast and makes the iteration process delightful as he is open to suggestions as well. He defends his ideas strongly, yet is open to them being challenged too. He delivers promised work on time and will be a great asset to any team he\u2019s part of.",
  },
  {
    image: "/testimonials/person-2.png",
    name: "Rahul Saxena",
    credentials: "Founder @ Bluethroat Labs",
    quote:
      "Before even getting into Venkat\u2019s design skills, his professionalism stands out immediately. In a space full of noise and mediocrity, he\u2019s the real deal. Our first call wasn\u2019t a typical design brief. I went deep into who I am, why I\u2019m building Bluethroat Labs, and what I want it to represent. He didn\u2019t interrupt once. He listened, processed, and came back with a brand that genuinely feels like an extension of my own thinking. What I respect most is how he works. He has strong opinions and can clearly justify every design choice, but at the same time, he actively invites informed pushback and actually listens. That combination of conviction and humility is rare. And he doesn\u2019t stop at the brief. He built a report generation tool for us, constantly thinks in terms of business outcomes, and pushes things forward without being asked. That\u2019s not a freelancer mindset, that\u2019s a partner mindset. If you care about doing things properly, he\u2019s the guy.",
  },
  {
    image: "/testimonials/person-3.png",
    name: "Yarik N",
    credentials: "Founder @ Tribelab",
    quote:
      "This is one of the best things I\u2019ve seen one designer did for another. Ever! Such a great Easter Egg. Hands down QuillAudits and their designer. Definitely an idea I might unintentionally steal for my future projects \uD83D\uDE47\uD83C\uDFFB\u200D\u2642\uFE0F \uD83D\uDE47\uD83C\uDFFB\u200D\u2642\uFE0F\n\n\u2013 via linkedin post",
  },
  {
    image: "/testimonials/person-4.png",
    name: "Sohit Kumar",
    credentials: "Senior UX Designer @ QuillAudits",
    quote:
      "Excellent at his work from the get go, Venkat is one of the very few freshers that I have worked with to have shown more potential at such an early stage of his career. Breaking boundaries of traditional design and coming up with fresh ideas is part of his design process. Innovation, discipline, efficiency and a fresh energy is what he brings to the team, and all of it reflects in his design work.",
  },
];

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = TESTIMONIALS[activeIdx];

  return (
    <section
      data-section-index={3}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: "48px",
        width: "720px",
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "96px",
      }}
    >
      {/* Heading + primary separator */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "8px" }}>
          <div
            style={{
              backgroundColor: "var(--color-neutral-dark)",
              width: "12px",
              height: "12px",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              color: "var(--color-neutral-dark)",
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "180%",
            }}
          >
            What they say about me
          </div>
        </div>
        <Separator variant="primary" />
      </div>

      {/* Quote + people */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" }}>
        {/* Quote block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <QuoteOpen />
          <div
            style={{
              color: "var(--color-neutral-8)",
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "220%",
              textAlign: "center",
              width: "620px",
              maxWidth: "100%",
              whiteSpace: "pre-line",
            }}
          >
            {active.quote}
          </div>
          <QuoteClose />
        </div>

        {/* People */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            {TESTIMONIALS.map((t, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={t.name || `Testimonial ${i + 1}`}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "9999px",
                    backgroundColor: "transparent",
                    backgroundImage: `url(${t.image})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    flexShrink: 0,
                    opacity: isActive ? 1 : 0.5,
                    outline: isActive ? "1px solid #F01D25" : "none",
                    outlineOffset: 0,
                    border: "none",
                    padding: 0,
                    cursor: isActive ? "default" : "pointer",
                    transition: "opacity 0.25s ease",
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                color: "var(--color-neutral-dark)",
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "150%",
              }}
            >
              {active.name}
            </div>
            <div
              style={{
                color: "var(--color-neutral-7)",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                lineHeight: "150%",
              }}
            >
              {active.credentials}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteOpen() {
  return (
    <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path
        d="M8.599 0L9.15 2.105C6.581 2.617 4.457 4.614 4.457 7.015C4.457 9.12 6.135 10.577 8.573 10.712C8.573 13.518 7.052 16 4.431 16C1.809 16 0 13.491 0 9.956C0 4.533 4.3 0.809 8.599 0ZM20.449 0L21 2.105C18.431 2.617 16.307 4.614 16.307 7.015C16.307 9.12 17.985 10.577 20.423 10.712C20.423 13.518 18.903 16 16.281 16C13.659 16 11.85 13.491 11.85 9.956C11.85 4.533 16.15 0.809 20.449 0Z"
        fill="#7A7A7A"
      />
    </svg>
  );
}

function QuoteClose() {
  return (
    <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path
        d="M12.401 0L11.85 2.105C14.419 2.617 16.543 4.614 16.543 7.015C16.543 9.12 14.865 10.577 12.427 10.712C12.427 13.518 13.948 16 16.569 16C19.191 16 21 13.491 21 9.956C21 4.533 16.7 0.809 12.401 0ZM0.551 0L0 2.105C2.569 2.617 4.693 4.614 4.693 7.015C4.693 9.12 3.015 10.577 0.577 10.712C0.577 13.518 2.097 16 4.719 16C7.341 16 9.15 13.491 9.15 9.956C9.15 4.533 4.85 0.809 0.551 0Z"
        fill="#7A7A7A"
      />
    </svg>
  );
}
