import { sanitizeHtml } from "@/utils/sanitize-html";
import styles from "./FaqList.module.scss";

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
      {heading && <h2 className={`t-display ${styles.heading}`}>{heading}</h2>}
      <dl className={`flex flex-col ${styles.list}`}>
        {items.map((item, i) =>
          item.question ? (
            <details key={i} className={`group ${styles.item}`}>
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 p-5 ${styles.summary}`}
              >
                <dt className={`t-display ${styles.question}`}>{item.question}</dt>
                <span aria-hidden="true" className={styles.indicator}>+</span>
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
    </section>
  );
}
