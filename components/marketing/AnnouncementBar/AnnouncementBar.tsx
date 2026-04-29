import styles from "./AnnouncementBar.module.scss";

export interface AnnouncementBarProps {
  message?: string | null;
  href?: string | null;
}

export default function AnnouncementBar({ message, href }: AnnouncementBarProps) {
  if (!message) return null;

  const content = (
    <div className={`flex items-center justify-center gap-4 ${styles.bar}`}>
      <span className={styles.glyph}>⌁</span>
      <span>{message}</span>
      <span className={styles.glyph}>⌁</span>
    </div>
  );

  return href ? (
    <a href={href} className={styles.link}>
      {content}
    </a>
  ) : (
    content
  );
}
