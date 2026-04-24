export interface AnnouncementBarProps {
  message?: string | null;
  href?: string | null;
}

export default function AnnouncementBar({ message, href }: AnnouncementBarProps) {
  if (!message) return null;
  const content = (
    <span className="block bg-primary px-4 py-2 text-center text-sm text-primary-foreground">
      {message}
    </span>
  );
  return href ? <a href={href}>{content}</a> : content;
}
