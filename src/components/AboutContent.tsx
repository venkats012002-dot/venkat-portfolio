"use client";

import { useState } from "react";
import MobileNavWithSidebar from "@/components/MobileNavWithSidebar";
import Footer from "@/components/Footer";
import PixelateSlider from "@/components/PixelateSlider";
import Separator from "@/components/Separator";
import CircularSelector from "@/components/CircularSelector";
import PhotoFrame from "@/components/PhotoFrame";

export default function AboutContent() {
  const [sliderProgress, setSliderProgress] = useState(0);
  return (
    <div
      style={{
        backgroundColor: "var(--color-neutral-light)",
        color: "var(--color-neutral-dark)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <MobileNavWithSidebar />

      <main
        style={{
          alignItems: "center",
          alignSelf: "stretch",
          boxSizing: "border-box",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          fontSynthesis: "none",
          gap: 48,
          MozOsxFontSmoothing: "grayscale",
          paddingBlock: "144px 48px",
          paddingInline: 48,
          position: "relative",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          style={{
            alignItems: "start",
            alignSelf: "stretch",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 48,
            marginInline: "auto",
            maxWidth: 720,
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "start",
              alignSelf: "stretch",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
          <PixelateSlider
            src="/about/portrait.png"
            alt="Portrait of Venkat"
            onProgress={setSliderProgress}
          />

          <div
            style={{
              alignItems: "start",
              alignSelf: "stretch",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                boxSizing: "border-box",
                color: "#000000",
                fontFamily: "var(--font-heading)",
                fontSize: 24,
                fontWeight: 500,
                lineHeight: "44px",
              }}
            >
              Hey Hii, I&rsquo;m Venkat!
            </div>
            <div
              style={{
                alignItems: "start",
                alignSelf: "stretch",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <p
                style={{
                  alignSelf: "stretch",
                  color: "var(--color-neutral-7)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: "180%",
                  margin: 0,
                }}
              >
                I&rsquo;m a designer based out of Chennai, India. Graduated in
                2024 with a B.Tech degree in electronics which I completely
                forgot the basics of. XD.
              </p>
              <p
                style={{
                  alignSelf: "stretch",
                  color: "var(--color-neutral-7)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: "180%",
                  margin: 0,
                }}
              >
                I&rsquo;m a product designer with huge amounts of imposter
                syndrome trying to keep myself motivated through curiosity and
                the drive to become better everyday. This helps myself stay
                grounded and also approach others&rsquo; processes and work
                with an excited POV to learn more.
              </p>
              <p
                style={{
                  alignSelf: "stretch",
                  color: "var(--color-neutral-7)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: "180%",
                  margin: 0,
                }}
              >
                I specialise in product and brand design with a focus in
                visuals, interaction, psychology, creative strategy and
                concept development. With AI i&rsquo;m currently looking on
                ways to support my design and finding out ways to create my
                own software for different use cases instead of relying on
                tools (Never marrying a tool XD) (But in a love affair with
                Figma and Rive :&gt; )
              </p>
              <p
                style={{
                  alignSelf: "stretch",
                  color: "var(--color-neutral-7)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: "180%",
                  margin: 0,
                }}
              >
                Right after engineering I thought to myself if this was what
                I&rsquo;m going to be doing forever and was like Hell NO!
                Always an artist at heart and this was much of a transition
                towards digital as my medium. I always see design as a way of
                how life among us behave. God is a designer.
              </p>
              <p
                style={{
                  alignSelf: "stretch",
                  color: "var(--color-neutral-7)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: "180%",
                  margin: 0,
                }}
              >
                For the last 2 years I have been working at QuillAudits as a
                0-1 designer. Started out as a UI/UX Intern but soon got
                pulled into Web, graphic, marketing and product design. In
                this 2 years I&rsquo;ve been &ldquo;figuring out&rdquo; new
                things without much traditional context and it has been the
                best, to more of this :) I thrive under pressure and am
                always up for learning new things as I believe the more
                practice, more context helps connect dots which give birth to
                revolutionary ideas.
              </p>
            </div>
          </div>
          </div>

          <Separator variant="primary" color="#DDDDDD" />
        </div>

        <CircularSelector />

        <div
          style={{
            alignItems: "stretch",
            alignSelf: "stretch",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 48,
            marginInline: "auto",
            maxWidth: 720,
            width: "100%",
          }}
        >
          <Separator variant="primary" color="#DDDDDD" />
          <div
            style={{
              alignItems: "start",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <PhotoFrame frameSrc="/svgs/photo-frame-4.svg" />
            <PhotoFrame frameSrc="/svgs/photo-frame-2.svg" />
            <PhotoFrame frameSrc="/svgs/photo-frame-3.svg" />
            <PhotoFrame frameSrc="/svgs/photo-frame-1.svg" />
          </div>
          <Separator variant="primary" color="#DDDDDD" />
          <p
            style={{
              alignSelf: "stretch",
              color: "var(--color-neutral-7)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              lineHeight: "180%",
              margin: 0,
            }}
          >
            Feel free to reach me via email / Telegram or see more of my work
            on X(Twittter).
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
