import { sanitizeHtml } from "@/utils/sanitize-html";

export interface FaqItem {
  question: string | null;
  answerHtml: string | null;
}

export interface FaqListProps {
  heading?: string | null;
  items?: FaqItem[] | null;
}

export default function FaqList({ heading, items }: FaqListProps) {
  if (!items?.length) return null;
  return (
    <section className="flex flex-col gap-4">
      {heading && <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>}
      <dl className="flex flex-col divide-y rounded-lg border">
        {items.map((item, i) =>
          item.question ? (
            <details key={i} className="group p-4">
              <summary className="cursor-pointer list-none font-medium">
                <dt>{item.question}</dt>
              </summary>
              {item.answerHtml && (
                <dd
                  className="mt-2 text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.answerHtml) }}
                />
              )}
            </details>
          ) : null,
        )}
      </dl>
    </section>
  );
}
