import Link from "next/link";

const wavyStyle: React.CSSProperties = {
  textDecorationLine: "underline",
  textDecorationStyle: "wavy",
  textDecorationThickness: "0.5px",
  textUnderlineOffset: "2px",
};

const mutedStyle: React.CSSProperties = {
  color: "var(--color-neutral-7)",
};

const linkStyle: React.CSSProperties = {
  ...wavyStyle,
  color: "inherit",
  position: "relative",
};

function QuillAuditsTip() {
  return (
    <svg width="76" height="43" viewBox="0 0 76 43" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ display: "block" }}>
      <rect x="0.5" y="0.5" width="75" height="42" fill="#EDEDED"/>
      <rect x="0.5" y="0.5" width="75" height="42" stroke="black"/>
      <rect width="68" height="35" transform="translate(4 4)" fill="#103DD3"/>
      <path d="M50.5119 23.6652L39.4699 34.3969L38.4934 32.88L48.9343 22.4137V22.3758L40.8595 14.109L41.4604 12.4025L51.0001 22.3L50.5119 23.6652Z" fill="white"/>
      <path d="M25.4735 20.7305L36.5487 9.96082L37.5282 11.4777L27.0557 21.9819V22.0198L35.1926 30.2487L34.5899 31.9552L25.0215 22.0956L25.4735 20.7305Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M33.4417 27.3129C33.5542 26.9089 33.7044 26.5453 33.8545 26.1817C34.4925 24.7677 35.1594 23.5152 36.0977 22.3436C37.3362 20.8488 38.4958 19.2572 40.1049 18.2134C40.8351 17.7398 41.7851 17.3434 42.5733 17.0606C42.6108 17.0202 42.4982 17.101 42.5733 17.0606L42.2004 17.7398C41.7243 18.5293 41.4387 19.1215 40.9852 19.7983C40.9477 19.8791 40.9102 19.8791 40.8351 19.8791C40.5349 19.9599 40.1971 20.0407 39.8593 20.0407C39.9719 20.2024 40.1596 20.2832 40.3097 20.3639C40.3847 20.4044 40.5349 20.4044 40.5724 20.5256C40.5724 20.6063 40.4598 20.7276 40.4223 20.8084C40.3472 21.0104 40.1971 21.1316 40.0094 21.172C39.7092 21.2528 39.409 21.3336 39.0712 21.3336C39.0712 21.4144 39.1087 21.4144 39.1462 21.4548C39.3339 21.6164 39.5591 21.7376 39.7843 21.8184C39.8593 21.8588 39.8593 21.8992 39.8218 21.98C39.7467 22.182 39.5966 22.2628 39.409 22.3032C38.9211 22.4648 38.4332 22.586 37.9453 22.6264H37.9077C38.0203 22.7476 38.1329 22.8284 38.2455 22.9092C38.4707 23.0304 38.6959 23.1112 38.9586 23.192C38.9961 23.192 39.0337 23.2324 38.9961 23.2728C38.8085 23.5556 38.6208 23.8385 38.3581 24.0404C38.1705 24.2425 37.9453 24.2425 37.6826 24.2425H36.8194C36.5942 24.2425 36.369 24.2425 36.1438 24.2828C35.9562 24.3232 35.8061 24.404 35.6935 24.5656C35.3182 25.0101 35.093 25.5757 34.8303 26.1009L34.7177 26.3433C34.6426 26.6665 34.455 26.8281 34.1922 26.9493C33.9671 26.9897 33.7044 27.1513 33.4417 27.3129Z" fill="white"/>
    </svg>
  );
}

function BluethroatLabsTip() {
  return (
    <svg width="76" height="43" viewBox="0 0 76 43" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ display: "block" }}>
      <rect x="0.5" y="0.5" width="75" height="42" fill="#EDEDED"/>
      <rect x="0.5" y="0.5" width="75" height="42" stroke="black"/>
      <rect width="68" height="35" transform="translate(4 4)" fill="#101010"/>
      <path d="M35.9174 27.9597V23.6633C35.9174 23.2832 35.3943 23.1797 35.2495 23.5312L31.3136 32.5478C31.1624 32.9149 31.6466 33.2071 31.9009 32.9021L35.8369 28.1819C35.8889 28.1196 35.9174 28.0409 35.9174 27.9597Z" fill="#FAFAFA"/>
      <path d="M44.1534 19.6473L36.9489 27.1829C36.7326 27.409 36.3511 27.256 36.3511 26.9431V13.7093C36.3511 13.4839 36.5481 13.3428 36.7385 13.3637C36.9052 13.382 37.0229 13.5304 37.1545 13.6345L43.9636 19.0199C44.0952 19.124 44.2491 19.2388 44.2496 19.4065C44.2498 19.4933 44.2177 19.5801 44.1534 19.6473Z" fill="#FAFAFA"/>
      <path d="M27.055 11.1616C27.1782 10.9655 27.4614 11.029 27.6865 11.0836L35.2316 12.9119C35.4567 12.9665 35.739 12.9595 35.8633 13.1549C35.8976 13.2087 35.9174 13.2725 35.9174 13.341V22.5144C35.9174 22.6913 35.7938 22.8194 35.6463 22.8532C35.4359 22.9015 35.2785 22.6888 35.1505 22.515L27.3129 11.8721C27.1849 11.6983 26.9828 11.5365 27.0013 11.3215C27.0062 11.2648 27.0247 11.2097 27.055 11.1616Z" fill="#FAFAFA"/>
      <path d="M45.4923 12.7809L45.0009 18.6326C44.9678 18.8251 44.795 18.9347 44.6265 18.9198C44.4546 18.9047 44.3322 18.7521 44.1962 18.6459L39.6365 15.0868C39.5005 14.9806 39.34 14.8626 39.3433 14.6901C39.3462 14.5437 39.4413 14.403 39.601 14.3604L45.0609 12.3869C45.3053 12.3217 45.5352 12.5315 45.4923 12.7809Z" fill="#FAFAFA"/>
      <path d="M45.7088 15.5723L45.9262 12.7609C45.9563 12.5896 46.0994 12.4818 46.2517 12.474C46.4287 12.465 46.5733 12.6057 46.7254 12.6965L48.6531 13.847C48.8052 13.9378 48.9849 14.0386 48.999 14.2152C49.0038 14.2755 48.9928 14.3364 48.9675 14.3912C48.8857 14.5682 48.6654 14.6231 48.4934 14.7148L46.4084 15.8268C46.2363 15.9186 46.0332 16.0305 45.8678 15.9273C45.7541 15.8565 45.6826 15.7216 45.7088 15.5723Z" fill="#FAFAFA"/>
    </svg>
  );
}

const items: { color: string; content: React.ReactNode }[] = [
  {
    color: "#3654A3",
    content: (
      <>Currently at <a href="https://www.quillaudits.com" target="_blank" rel="noreferrer" className="hero-status-link" style={linkStyle}>QuillAudits<span aria-hidden className="hero-status-link__tip"><QuillAuditsTip /></span></a>, designing for Web, Product &amp; Marketing</>
    ),
  },
  {
    color: "#F01D25",
    content: (
      <>Founding brand designer – <a href="https://www.bluethroatlabs.com" target="_blank" rel="noreferrer" className="hero-status-link" style={linkStyle}>Bluethroat Labs<span aria-hidden className="hero-status-link__tip"><BluethroatLabsTip /></span></a></>
    ),
  },
  {
    color: "#6BBD40",
    content: (
      <>Into Art, Technology, Psychology &amp; Building <span style={mutedStyle}>personal softwares with AI</span></>
    ),
  },
  {
    color: "#F7ED12",
    content: (
      <>Check out my thoughts / rants / quirks on everything - <Link href="/personal-archive" style={{ ...wavyStyle, color: "inherit" }}>Personal Archive</Link></>
    ),
  },
];

export default function HeroStatus() {
  return (
    <div className="hero-status-list" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      {items.map(({ color, content }, i) => (
        <div key={i} className="hero-status-item" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: color,
              width: "8px",
              height: "8px",
              flexShrink: 0,
            }}
          />
          <div
            className="hero-status-row"
            style={{
              color: "var(--color-neutral-12)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              lineHeight: "180%",
              whiteSpace: "nowrap",
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </div>
  );
}
