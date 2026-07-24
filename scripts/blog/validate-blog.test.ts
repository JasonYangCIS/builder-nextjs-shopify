import { describe, expect, it } from "vitest";
import { validateBlogPublishingInput, type BlogPublishingInput } from "./validate-blog";

function validInput(): BlogPublishingInput {
  const now = "2026-01-15T12:00:00.000Z";
  return {
    action: "draft",
    workflow: {
      entryId: null,
      currentStatus: "new",
      savedDraftRevalidated: false,
    },
    brief: {
      title: "Practical storefront performance guide",
      purpose: "Help commerce teams improve storefront performance.",
      audience: "Commerce engineering leads",
      primaryKeyword: "storefront performance",
      brandVoiceId: "clear-expert",
      deliverables: ["Publish a practical implementation guide"],
    },
    content: {
      title: "A Practical Guide to Faster Storefronts",
      slug: "practical-guide-faster-storefronts",
      excerpt:
        "Learn a measured process for diagnosing and improving storefront speed without sacrificing customer experience.",
      seoTitle: "Practical Guide to Faster Storefronts",
      seoDescription:
        "Learn how commerce teams can measure storefront performance, prioritize meaningful fixes, and verify improvements with reliable primary-source guidance.",
      canonicalUrl: "https://example.com/blog/practical-guide-faster-storefronts",
      categories: ["Engineering"],
      tags: ["Performance", "Commerce"],
      blocks: [
        {
          id: "heading-1",
          type: "heading",
          level: 2,
          text: "Measure storefront performance",
        },
        {
          id: "paragraph-1",
          type: "paragraph",
          text: "Web performance metrics help teams focus on measurable customer experiences.",
          citationIds: ["web-vitals"],
          links: [
            { label: "Read the Web Vitals guidance", url: "https://web.dev/articles/vitals" },
          ],
        },
        { id: "heading-2", type: "heading", level: 2, text: "Prioritize before changing" },
        { id: "image-1", type: "image", assetId: "builder-media-1" },
      ],
      citations: [
        {
          id: "web-vitals",
          title: "Web Vitals",
          url: "https://web.dev/articles/vitals",
          publisher: "Google",
          accessedAt: "2026-01-15",
          primarySource: true,
        },
      ],
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
      scheduledAt: null,
    },
    policy: {
      now,
      approvedBrandVoiceIds: ["clear-expert"],
      allowedBlockTypes: ["heading", "paragraph", "quote", "list", "image", "embed"],
      approvedCategories: ["Engineering"],
      approvedTags: ["Performance", "Commerce"],
      approvedCanonicalOrigins: ["https://example.com"],
    },
    attestations: {
      copyEdited: true,
      originalityReviewed: true,
      noKnownLegalIssue: true,
      containsNoSecretsOrChainOfThought: true,
    },
  };
}

describe("validateBlogPublishingInput", () => {
  it("accepts a complete deterministic draft", () => {
    expect(validateBlogPublishingInput(validInput())).toEqual({
      valid: true,
      issues: [],
      blockingIssues: [],
      acceptedOverrideCodes: [],
    });
  });

  it("validates slug, metadata, headings, links, citations, taxonomy, and canonical URL", () => {
    const input = validInput();
    input.content.slug = "Bad Slug";
    input.content.seoTitle = "Short";
    input.content.canonicalUrl = "http://evil.example/post?preview=true";
    input.content.categories = ["Unknown"];
    input.content.blocks = [
      { id: "heading-3", type: "heading", level: 3, text: "Skipped heading" },
      {
        id: "paragraph-1",
        type: "paragraph",
        text: "Unsupported claim",
        links: [{ label: "Unsafe", url: "javascript:alert(1)" }],
      },
    ];

    const codes = validateBlogPublishingInput(input).blockingIssues.map(({ code }) => code);
    expect(codes).toEqual(
      expect.arrayContaining([
        "SLUG_INVALID",
        "SEO_TITLE_LENGTH",
        "CANONICAL_INVALID",
        "TAXONOMY_INVALID",
        "HEADING_STRUCTURE_INVALID",
        "LINK_INVALID",
        "CITATION_MISSING",
      ]),
    );
  });

  it("fails closed for unapproved blocks and invalid scheduling", () => {
    const input = validInput();
    input.action = "schedule";
    input.workflow = {
      entryId: "entry-1",
      currentStatus: "draft",
      savedDraftRevalidated: true,
    };
    input.content.scheduledAt = "2026-01-15T11:59:00.000Z";
    input.policy.allowedBlockTypes = ["heading", "paragraph"];

    const result = validateBlogPublishingInput(input);
    expect(result.valid).toBe(false);
    expect(result.blockingIssues.map(({ code }) => code)).toEqual(
      expect.arrayContaining(["BLOCK_TYPE_UNAPPROVED", "SCHEDULE_INVALID"]),
    );
  });

  it("accepts an authorized audit override only for present non-legal codes", () => {
    const input = validInput();
    input.content.seoTitle = "Too short";
    input.override = {
      authorized: true,
      actorId: "editor-42",
      reason: "Approved campaign title exception.",
      auditReference: "AUDIT-2026-014",
      approvedAt: "2026-01-15T11:00:00.000Z",
      issueCodes: ["SEO_TITLE_LENGTH"],
    };

    const result = validateBlogPublishingInput(input);
    expect(result.valid).toBe(true);
    expect(result.acceptedOverrideCodes).toEqual(["SEO_TITLE_LENGTH"]);
    expect(result.issues.map(({ code }) => code)).toContain("SEO_TITLE_LENGTH");
  });

  it("rejects attempts to override legal failures", () => {
    const input = validInput();
    input.attestations.noKnownLegalIssue = false;
    input.override = {
      authorized: true,
      actorId: "editor-42",
      reason: "Urgent request.",
      auditReference: "AUDIT-2026-015",
      approvedAt: "2026-01-15T11:00:00.000Z",
      issueCodes: ["LEGAL_RISK_PRESENT"],
    };

    const result = validateBlogPublishingInput(input);
    expect(result.valid).toBe(false);
    expect(result.blockingIssues.map(({ code }) => code)).toEqual(
      expect.arrayContaining(["LEGAL_RISK_PRESENT", "OVERRIDE_INVALID"]),
    );
  });

  it("requires a future schedule and rejects schedule dates on other actions", () => {
    const scheduled = validInput();
    scheduled.action = "schedule";
    scheduled.workflow = {
      entryId: "entry-1",
      currentStatus: "draft",
      savedDraftRevalidated: true,
    };
    scheduled.content.scheduledAt = "2026-01-16T12:00:00.000Z";
    scheduled.content.publishedAt = scheduled.content.scheduledAt;
    expect(validateBlogPublishingInput(scheduled).valid).toBe(true);

    const draft = validInput();
    draft.content.scheduledAt = "2026-01-16T12:00:00.000Z";
    expect(validateBlogPublishingInput(draft).blockingIssues.map(({ code }) => code)).toContain(
      "SCHEDULE_INVALID",
    );
  });

  it("requires a revalidated saved draft before publishing", () => {
    const input = validInput();
    input.action = "publish";
    input.workflow = {
      entryId: "entry-1",
      currentStatus: "draft",
      savedDraftRevalidated: false,
    };

    expect(validateBlogPublishingInput(input).blockingIssues.map(({ code }) => code)).toContain(
      "ACTION_STATE_INVALID",
    );
    input.workflow.savedDraftRevalidated = true;
    expect(validateBlogPublishingInput(input).blockingIssues.map(({ code }) => code)).toContain(
      "DATE_INVALID",
    );
    input.content.publishedAt = input.policy.now;
    expect(validateBlogPublishingInput(input).valid).toBe(true);
  });

  it("rejects missing brief fields and invalid primary-source ledger records", () => {
    const input = validInput();
    input.brief.purpose = " ";
    const citation = input.content.citations[0];
    if (citation) {
      citation.url = "https://user:password@example.com/source";
      citation.accessedAt = "2026-02-30";
      citation.primarySource = false;
    }

    expect(validateBlogPublishingInput(input).blockingIssues.map(({ code }) => code)).toEqual(
      expect.arrayContaining(["REQUIRED_FIELD", "CITATION_INVALID"]),
    );
  });

  it("rejects non-ISO chronological dates", () => {
    const input = validInput();
    input.content.updatedAt = "January 15, 2026";

    expect(validateBlogPublishingInput(input).blockingIssues.map(({ code }) => code)).toEqual(
      expect.arrayContaining(["DATE_INVALID"]),
    );
  });
});
