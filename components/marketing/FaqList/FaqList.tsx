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
    <section className="flex flex-col gap-6">
      {heading && (
        <h2
          className="t-display"
          style={{ fontSize: "var(--t-2xl)", letterSpacing: "0.06em", color: "var(--ink-0)" }}
        >
          {heading}
        </h2>
      )}
      <dl className="flex flex-col" style={{ border: "1px solid var(--border)" }}>
        {items.map((item, i) =>
          item.question ? (
            <details
              key={i}
              className="faq-item group"
              style={{
                borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-4 p-5"
                style={{ color: "var(--ink-0)" }}
              >
                <dt
                  className="t-display"
                  style={{ fontSize: "var(--t-sm)", letterSpacing: "0.06em" }}
                >
                  {item.question}
                </dt>
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--t-lg)",
                    color: "var(--cyan-3)",
                    lineHeight: 1,
                    flexShrink: 0,
                    transition: "transform 0.2s",
                  }}
                  className="faq-indicator"
                >
                  +
                </span>
              </summary>
              {item.answerHtml && (
                <dd
                  className="xeno-prose px-5 pb-5"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.answerHtml) }}
                />
              )}
            </details>
          ) : null,
        )}
      </dl>

      <style>{`
        .faq-item[open] .faq-indicator { transform: rotate(45deg); }
        .faq-item summary:hover { background: rgba(61,217,214,0.04); }
      `}</style>
    </section>
  );
}
