import MobileNavWithSidebar from "@/components/MobileNavWithSidebar";
import Footer from "@/components/Footer";
import Separator from "@/components/Separator";
import CircularSelector from "@/components/CircularSelector";
import PhotoFrame from "@/components/PhotoFrame";
import Doodle from "@/components/Doodle";

export default function AboutContent() {
  // Slider was removed (raster image couldn't react to the accent swatch). Doodles
  // are always visible; only their fill needs to transition with the accent change.
  const doodleStyle = {
    transition: "background-color 0.25s ease",
  } as const;
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
        {/* Main-anchored ambient doodles */}
        <Doodle
          src="/svgs/doodles/sun.svg"
          width={156}
          height={153}
          style={{ top: 32, left: 48, ...doodleStyle }}
        />
        <Doodle
          src="/svgs/doodles/huh-cat.svg"
          width={182}
          height={228}
          style={{ top: 60, right: 48, ...doodleStyle }}
        />
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/portrait.png"
            alt="Portrait of Venkat"
            width={120}
            height={144}
            style={{ display: "block", height: 144, width: 120 }}
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
                display: "inline-block",
                fontFamily: "var(--font-heading)",
                fontSize: 24,
                fontWeight: 500,
                lineHeight: "44px",
                position: "relative",
              }}
            >
              Hey Hii, I&rsquo;m Venkat!
              <Doodle
                src="/svgs/doodles/venkat-underline.svg"
                width={75}
                height={11}
                style={{
                  bottom: -4,
                  right: 0,
                  ...doodleStyle,
                }}
              />
            </div>
            <div
              style={{
                alignItems: "start",
                alignSelf: "stretch",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                position: "relative",
              }}
            >
              {/* star-1: left of paragraphs, vertically centered, 32px outside the left edge */}
              <Doodle
                src="/svgs/doodles/star-1.svg"
                width={90}
                height={86}
                style={{
                  top: "50%",
                  left: -(90 + 32),
                  marginTop: -43,
                  ...doodleStyle,
                }}
              />
              {/* star-2: bottom-right of paragraphs, 32px outside the right edge */}
              <Doodle
                src="/svgs/doodles/star-2.svg"
                width={90}
                height={82}
                style={{
                  bottom: 0,
                  right: -(90 + 32),
                  ...doodleStyle,
                }}
              />
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

        <div
          style={{
            alignSelf: "stretch",
            marginInline: "auto",
            maxWidth: 720,
            position: "relative",
            width: "100%",
          }}
        >
          <CircularSelector />
          {/*
            drag: 32px above the lever knob (the only <circle> inside CircularSelector).
            Lever sits at top: 259, left: -328, size 48×48 within CircularSelector.
            drag bottom edge = lever top - 32 = 227 → drag top = 227 - 94 = 133.
            drag horizontally centered on lever center (x = -328 + 24 = -304):
              drag left = -304 - 60 = -364.
          */}
          <Doodle
            src="/svgs/doodles/drag.svg"
            width={120}
            height={94}
            style={{
              top: 133,
              left: -364,
              ...doodleStyle,
            }}
          />
          {/* yap-yap-yap: right centred, 16px outside the right edge */}
          <Doodle
            src="/svgs/doodles/yap-yap-yap.svg"
            width={245}
            height={426}
            style={{
              top: "50%",
              right: -261,
              marginTop: -213,
              ...doodleStyle,
            }}
          />
        </div>

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
              position: "relative",
            }}
          >
            {/* photo-frame brackets — scaled 1.125× (0.75× the previous 1.5×), behind the frames */}
            <Doodle
              src="/svgs/doodles/photo-frame-brackets.svg"
              width={802 * 1.125}
              height={266 * 1.125}
              style={{
                top: "50%",
                left: "50%",
                marginLeft: -(802 * 1.125) / 2,
                marginTop: -(266 * 1.125) / 2,
                zIndex: 0,
                ...doodleStyle,
              }}
            />
            <PhotoFrame frameSrc="/svgs/photo-frame-4.svg" />
            <PhotoFrame frameSrc="/svgs/photo-frame-2.svg" />
            <PhotoFrame frameSrc="/svgs/photo-frame-3.svg" />
            <PhotoFrame frameSrc="/svgs/photo-frame-1.svg" />
          </div>
          <Separator variant="primary" color="#DDDDDD" />
          <div style={{ alignSelf: "stretch", position: "relative" }}>
            <Doodle
              src="/svgs/doodles/arrow-reach-out.svg"
              width={106}
              height={40}
              style={{ top: 0, left: -134, ...doodleStyle }}
            />
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
