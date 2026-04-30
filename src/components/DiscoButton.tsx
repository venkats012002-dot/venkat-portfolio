"use client";

import { useDiscoMode, setDiscoMode } from "@/hooks/useDiscoMode";

function DefaultIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M8.424 6.004H15.628V8.404H8.424V6.004Z" fill={color} />
      <path d="M8.424 15.604H15.628V18.004H8.424V15.604Z" fill={color} />
      <path d="M18.028 18.006H20.428V20.406H18.028V18.006Z" fill={color} />
      <path d="M18.041 3.606H20.441V6.006H18.041V3.606Z" fill={color} />
      <path d="M3.628 18.004H6.028V20.404H3.628V18.004Z" fill={color} />
      <path d="M3.641 3.606H6.041V6.006H3.641V3.606Z" fill={color} />
      <path d="M1.241 20.406H3.641V22.806H1.241V20.406Z" fill={color} />
      <path d="M20.441 20.406H22.841V22.806H20.441V20.406Z" fill={color} />
      <path d="M1.241 1.206H3.641V3.606H1.241V1.206Z" fill={color} />
      <path d="M20.441 1.206H22.841V3.606H20.441V1.206Z" fill={color} />
      <path d="M10.841 20.406H13.241V22.806H10.841V20.406Z" fill={color} />
      <path d="M1.241 10.806H3.641V13.206H1.241V10.806Z" fill={color} />
      <path d="M20.441 10.806H22.841V13.206H20.441V10.806Z" fill={color} />
      <path d="M10.841 1.206H13.241V3.606H10.841V1.206Z" fill={color} />
      <path d="M8.428 8.404H6.028C6.031 10.807 6.026 13.206 6.028 15.609H8.428C8.426 13.206 8.431 10.807 8.428 8.404Z" fill={color} />
      <path d="M18.027 8.399H15.627C15.629 10.802 15.625 13.201 15.627 15.604H18.027C18.025 13.201 18.029 10.802 18.027 8.399Z" fill={color} />
    </svg>
  );
}

function DiscoIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <clipPath id="disco-icon-clip">
          <rect width="24" height="24" fill="#fff" />
        </clipPath>
      </defs>
      <g clipPath="url(#disco-icon-clip)">
        <path d="M21.882 21.176H23.294V22.588H21.882V21.176Z" fill={color} />
        <path d="M21.882 12.706H19.059V11.294H17.647V12.706H7.765V11.294H6.353V12.706H3.53V9.882H2.118V16.941H3.53V14.118H6.353V15.529H7.765V14.118H17.647V15.529H19.059V14.118H21.882V16.941H23.294V9.882H21.882V12.706Z" fill={color} />
        <path d="M21.882 1.412H23.294V2.824H21.882V1.412Z" fill={color} />
        <path d="M20.471 2.824H21.882V4.235H20.471V2.824Z" fill={color} />
        <path d="M20.471 0H21.882V1.412H20.471V0Z" fill={color} />
        <path d="M19.059 19.765H20.471V21.176H19.059V19.765Z" fill={color} />
        <path d="M17.647 16.941V15.529H16.235V18.353H20.471V19.765H21.882V16.941H17.647Z" fill={color} />
        <path d="M16.235 8.471V11.294H17.647V9.882H21.882V7.059H20.471V8.471H16.235Z" fill={color} />
        <path d="M19.059 5.647H20.471V7.059H19.059V5.647Z" fill={color} />
        <path d="M19.059 1.412H20.471V2.824H19.059V1.412Z" fill={color} />
        <path d="M16.235 21.176H19.059V22.588H16.235V21.176Z" fill={color} />
        <path d="M16.235 4.235H19.059V5.647H16.235V4.235Z" fill={color} />
        <path d="M14.824 21.176H13.412V22.588H12V21.176H10.588V22.588H9.177V24H16.235V22.588H14.824V21.176Z" fill={color} />
        <path d="M9.177 18.353V21.176H10.588V19.765H14.824V21.176H16.235V18.353H9.177Z" fill={color} />
        <path d="M16.235 8.471V5.647H14.824V7.059H10.588V5.647H9.177V8.471H16.235Z" fill={color} />
        <path d="M10.588 5.647H12V4.235H13.412V5.647H14.824V4.235H16.235V2.824H13.412V0H12V2.824H9.177V4.235H10.588V5.647Z" fill={color} />
        <path d="M6.353 21.176H9.177V22.588H6.353V21.176Z" fill={color} />
        <path d="M6.353 4.235H9.177V5.647H6.353V4.235Z" fill={color} />
        <path d="M4.941 19.765H6.353V21.176H4.941V19.765Z" fill={color} />
        <path d="M9.177 18.353V15.529H7.765V16.941H3.53V19.765H4.941V18.353H9.177Z" fill={color} />
        <path d="M7.765 9.882V11.294H9.177V8.471H4.941V7.059H3.53V9.882H7.765Z" fill={color} />
        <path d="M4.941 5.647H6.353V7.059H4.941V5.647Z" fill={color} />
        <path d="M3.53 2.824H4.941V4.235H3.53V2.824Z" fill={color} />
        <path d="M2.118 4.235H3.53V5.647H2.118V4.235Z" fill={color} />
        <path d="M2.118 1.412H3.53V2.824H2.118V1.412Z" fill={color} />
        <path d="M0.706 7.059H2.118V8.471H0.706V7.059Z" fill={color} />
        <path d="M0.706 2.824H2.118V4.235H0.706V2.824Z" fill={color} />
      </g>
    </svg>
  );
}

function ModeCell({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        alignItems: "center",
        backgroundColor: active ? "var(--color-neutral-light)" : "var(--color-neutral-1)",
        border: "none",
        borderRadius: 0,
        boxSizing: "border-box",
        cursor: "pointer",
        display: "flex",
        gap: 17,
        outline: "1px solid var(--color-neutral-dark)",
        overflow: "clip",
        padding: "18px 17px",
      }}
    >
      {children}
    </button>
  );
}

export default function DiscoButton() {
  const enabled = useDiscoMode();

  return (
    <div
      style={{
        alignItems: "start",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <ModeCell active={!enabled} onClick={() => setDiscoMode(false)}>
        <DefaultIcon color={!enabled ? "#333333" : "#CACACA"} />
      </ModeCell>
      <ModeCell active={enabled} onClick={() => setDiscoMode(true)}>
        <DiscoIcon color={enabled ? "#333333" : "#CACACA"} />
      </ModeCell>
    </div>
  );
}
