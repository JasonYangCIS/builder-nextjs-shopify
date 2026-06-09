import { FaqList as CoreFaqList } from "@jasonyangcis/core-ui";
import { sanitizeHtml } from "@/utils/sanitize-html";
import type { FaqListProps } from "@jasonyangcis/core-ui";

export type { FaqListProps, FaqItem } from "@jasonyangcis/core-ui";

export default function FaqList({ items, ...rest }: FaqListProps) {
  const sanitized =
    items?.map((item) => ({
      ...item,
      answerHtml: item.answerHtml ? sanitizeHtml(item.answerHtml) : null,
    })) ?? null;
  return <CoreFaqList {...rest} items={sanitized} />;
}
