import type { RegisteredComponent } from "@builder.io/sdk-react";
import FaqList from "./FaqList";

export const faqListConfig: RegisteredComponent = {
  component: FaqList,
  name: "FaqList",
  inputs: [
    { name: "heading", type: "string" },
    {
      name: "items",
      type: "list",
      subFields: [
        { name: "question", type: "string" },
        { name: "answerHtml", type: "richText" },
      ],
    },
  ],
};
