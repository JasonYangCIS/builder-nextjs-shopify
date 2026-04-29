export interface AnnouncementBarProps {
  message?: string | null;
  href?: string | null;
}

export default function AnnouncementBar({ message, href }: AnnouncementBarProps) {
  if (!message) return null;

  const content = (
    <div
      className="flex items-center justify-center gap-4"
      style={{
        padding: "6px 24px",
        background: "rgba(6, 9, 15, 0.7)",
        borderBottom: "1px solid var(--cyan-line)",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--ink-2)",
      }}
    >
      <span style={{ color: "var(--cyan-3)" }}>⌁</span>
      <span>{message}</span>
      <span style={{ color: "var(--cyan-3)" }}>⌁</span>
    </div>
  );

  return href ? (
    <a href={href} style={{ display: "block", textDecoration: "none" }}>
      {content}
    </a>
  ) : (
    content
  );
}
