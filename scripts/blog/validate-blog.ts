export const BLOG_BLOCK_TYPES = [
  "heading",
  "paragraph",
  "quote",
  "list",
  "image",
  "embed",
] as const;

export type BlogAction = "draft" | "publish" | "schedule" | "update" | "archive";
export type BlogBlockType = (typeof BLOG_BLOCK_TYPES)[number];
export type BlogIssueSeverity = "error" | "warning";

export interface BlogBrief {
  title: string;
  purpose: string;
  audience: string;
  primaryKeyword: string;
  brandVoiceId: string;
  deliverables: readonly string[];
}

export interface BlogCitation {
  id: string;
  title: string;
  url: string;
  publisher: string;
  accessedAt: string;
  primarySource: boolean;
}

export interface BlogMediaAsset {
  id: string;
  url: string;
  alt: string;
  decorative: boolean;
  rightsStatus: "approved" | "pending" | "rejected";
  rightsOwner: string;
  license: string;
  sourceUrl: string;
  approvalId: string;
  rightsExpiresAt: string | null;
}

interface BlogBlockBase {
  id: string;
  type: BlogBlockType;
  citationIds?: readonly string[];
}

export interface BlogHeadingBlock extends BlogBlockBase {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface BlogTextBlock extends BlogBlockBase {
  type: "paragraph" | "quote" | "list";
  text: string;
  links?: readonly BlogLink[];
}

export interface BlogImageBlock extends BlogBlockBase {
  type: "image";
  assetId: string;
}

export interface BlogEmbedBlock extends BlogBlockBase {
  type: "embed";
  url: string;
  title: string;
}

export interface BlogLink {
  label: string;
  url: string;
}

export type BlogBlock = BlogHeadingBlock | BlogTextBlock | BlogImageBlock | BlogEmbedBlock;

export interface BlogContent {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  categories: readonly string[];
  tags: readonly string[];
  blocks: readonly BlogBlock[];
  citations: readonly BlogCitation[];
  media: readonly BlogMediaAsset[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  scheduledAt: string | null;
}

export interface BlogPolicy {
  now: string;
  approvedBrandVoiceIds: readonly string[];
  allowedBlockTypes: readonly BlogBlockType[];
  approvedCategories: readonly string[];
  approvedTags: readonly string[];
  approvedCanonicalOrigins: readonly string[];
  approvedMediaAssetIds: readonly string[];
}

export interface BlogAttestations {
  copyEdited: boolean;
  originalityReviewed: boolean;
  noKnownLegalIssue: boolean;
  containsNoSecretsOrChainOfThought: boolean;
}

export interface BlogOverride {
  authorized: boolean;
  actorId: string;
  reason: string;
  auditReference: string;
  approvedAt: string;
  issueCodes: readonly BlogIssueCode[];
}

export type BlogEntryStatus = "new" | "draft" | "published" | "scheduled" | "archived";

export interface BlogWorkflowState {
  entryId: string | null;
  currentStatus: BlogEntryStatus;
  savedDraftRevalidated: boolean;
}

export interface BlogPublishingInput {
  action: BlogAction;
  workflow: BlogWorkflowState;
  brief: BlogBrief;
  content: BlogContent;
  policy: BlogPolicy;
  attestations: BlogAttestations;
  override?: BlogOverride;
}

export type BlogIssueCode =
  | "REQUIRED_FIELD"
  | "SLUG_INVALID"
  | "TITLE_LENGTH"
  | "EXCERPT_LENGTH"
  | "SEO_TITLE_LENGTH"
  | "SEO_DESCRIPTION_LENGTH"
  | "CANONICAL_INVALID"
  | "BRAND_VOICE_UNAPPROVED"
  | "BLOCK_TYPE_UNAPPROVED"
  | "HEADING_STRUCTURE_INVALID"
  | "LINK_INVALID"
  | "CITATION_INVALID"
  | "CITATION_MISSING"
  | "TAXONOMY_INVALID"
  | "DATE_INVALID"
  | "SCHEDULE_INVALID"
  | "ACTION_STATE_INVALID"
  | "COPY_EDIT_INCOMPLETE"
  | "ORIGINALITY_REVIEW_INCOMPLETE"
  | "LEGAL_RISK_PRESENT"
  | "LEGAL_QUOTE_INVALID"
  | "LEGAL_MEDIA_RIGHTS_INVALID"
  | "CONFIDENTIALITY_ATTESTATION_MISSING"
  | "OVERRIDE_INVALID";

export interface BlogValidationIssue {
  code: BlogIssueCode;
  severity: BlogIssueSeverity;
  path: string;
  message: string;
  overridable: boolean;
}

export interface BlogValidationResult {
  valid: boolean;
  issues: readonly BlogValidationIssue[];
  blockingIssues: readonly BlogValidationIssue[];
  acceptedOverrideCodes: readonly BlogIssueCode[];
}

const OVERRIDABLE_CODES: ReadonlySet<BlogIssueCode> = new Set([
  "TITLE_LENGTH",
  "EXCERPT_LENGTH",
  "SEO_TITLE_LENGTH",
  "SEO_DESCRIPTION_LENGTH",
  "COPY_EDIT_INCOMPLETE",
  "ORIGINALITY_REVIEW_INCOMPLETE",
]);
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function parseTimestamp(value: string): number | null {
  if (!ISO_TIMESTAMP.test(value)) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isCalendarDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function parseHttpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function addIssue(
  issues: BlogValidationIssue[],
  code: BlogIssueCode,
  path: string,
  message: string,
): void {
  issues.push({
    code,
    severity: "error",
    path,
    message,
    overridable: OVERRIDABLE_CODES.has(code),
  });
}

function requireText(issues: BlogValidationIssue[], value: string, path: string): void {
  if (!hasText(value)) addIssue(issues, "REQUIRED_FIELD", path, "A non-empty value is required.");
}

function validateLength(
  issues: BlogValidationIssue[],
  value: string,
  path: string,
  code: BlogIssueCode,
  minimum: number,
  maximum: number,
): void {
  const length = value.trim().length;
  if (length < minimum || length > maximum) {
    addIssue(issues, code, path, `Length must be between ${minimum} and ${maximum} characters.`);
  }
}

function validateRequired(input: BlogPublishingInput, issues: BlogValidationIssue[]): void {
  const fields: readonly [string, string][] = [
    [input.brief.title, "brief.title"],
    [input.brief.purpose, "brief.purpose"],
    [input.brief.audience, "brief.audience"],
    [input.brief.primaryKeyword, "brief.primaryKeyword"],
    [input.brief.brandVoiceId, "brief.brandVoiceId"],
    [input.content.title, "content.title"],
    [input.content.slug, "content.slug"],
    [input.content.excerpt, "content.excerpt"],
    [input.content.seoTitle, "content.seoTitle"],
    [input.content.seoDescription, "content.seoDescription"],
    [input.content.canonicalUrl, "content.canonicalUrl"],
  ];
  for (const [value, path] of fields) requireText(issues, value, path);
  if (
    input.brief.deliverables.length === 0 ||
    input.brief.deliverables.some((item) => !hasText(item))
  ) {
    addIssue(
      issues,
      "REQUIRED_FIELD",
      "brief.deliverables",
      "At least one non-empty deliverable is required.",
    );
  }
  if (input.content.blocks.length === 0) {
    addIssue(issues, "REQUIRED_FIELD", "content.blocks", "At least one content block is required.");
  }
}

function validateMetadata(input: BlogPublishingInput, issues: BlogValidationIssue[]): void {
  if (
    !SLUG.test(input.content.slug) ||
    input.content.slug.length < 3 ||
    input.content.slug.length > 80
  ) {
    addIssue(
      issues,
      "SLUG_INVALID",
      "content.slug",
      "Slug must be 3-80 characters in lowercase kebab-case.",
    );
  }
  validateLength(issues, input.content.title, "content.title", "TITLE_LENGTH", 10, 100);
  validateLength(issues, input.content.excerpt, "content.excerpt", "EXCERPT_LENGTH", 50, 300);
  validateLength(issues, input.content.seoTitle, "content.seoTitle", "SEO_TITLE_LENGTH", 30, 60);
  validateLength(
    issues,
    input.content.seoDescription,
    "content.seoDescription",
    "SEO_DESCRIPTION_LENGTH",
    120,
    160,
  );

  const canonical = parseHttpsUrl(input.content.canonicalUrl);
  const approvedOrigins = new Set(input.policy.approvedCanonicalOrigins);
  if (
    !canonical ||
    canonical.search.length > 0 ||
    canonical.hash.length > 0 ||
    !approvedOrigins.has(canonical.origin) ||
    canonical.pathname.split("/").filter(Boolean).at(-1) !== input.content.slug
  ) {
    addIssue(
      issues,
      "CANONICAL_INVALID",
      "content.canonicalUrl",
      "Canonical URL must use an approved HTTPS origin and end with the slug.",
    );
  }
}

function validateBlocks(input: BlogPublishingInput, issues: BlogValidationIssue[]): void {
  const allowedBlocks = new Set(input.policy.allowedBlockTypes);
  const citationIds = new Set(input.content.citations.map(({ id }) => id));
  let bodyHeadingCount = 0;
  let previousHeadingLevel = 1;

  input.content.blocks.forEach((block, index) => {
    const path = `content.blocks[${index}]`;
    requireText(issues, block.id, `${path}.id`);
    if (!allowedBlocks.has(block.type)) {
      addIssue(issues, "BLOCK_TYPE_UNAPPROVED", `${path}.type`, "Block type is not allowlisted.");
    }
    if (block.type === "heading") {
      requireText(issues, block.text, `${path}.text`);
      bodyHeadingCount += 1;
      if (block.level === 1) {
        addIssue(
          issues,
          "HEADING_STRUCTURE_INVALID",
          `${path}.level`,
          "The article shell renders the only level-one heading; body headings must start at level two.",
        );
      }
      if (block.level > previousHeadingLevel + 1) {
        addIssue(
          issues,
          "HEADING_STRUCTURE_INVALID",
          `${path}.level`,
          "Heading levels cannot be skipped.",
        );
      }
      previousHeadingLevel = block.level;
    }
    if (block.type === "paragraph" || block.type === "quote" || block.type === "list") {
      requireText(issues, block.text, `${path}.text`);
      for (const [linkIndex, link] of (block.links ?? []).entries()) {
        if (!hasText(link.label) || !parseHttpsUrl(link.url)) {
          addIssue(
            issues,
            "LINK_INVALID",
            `${path}.links[${linkIndex}]`,
            "Links require a label and absolute HTTPS URL without credentials.",
          );
        }
      }
      if (
        block.type === "quote" &&
        (block.text.length > 280 || (block.citationIds ?? []).length === 0)
      ) {
        addIssue(
          issues,
          "LEGAL_QUOTE_INVALID",
          path,
          "Quotes must be at most 280 characters and attributed to a citation.",
        );
      }
    }
    if (block.type === "embed" && (!hasText(block.title) || !parseHttpsUrl(block.url))) {
      addIssue(issues, "LINK_INVALID", path, "Embeds require a title and absolute HTTPS URL.");
    }
    if (block.type === "paragraph" || block.type === "quote") {
      if ((block.citationIds ?? []).length === 0) {
        addIssue(
          issues,
          "CITATION_MISSING",
          `${path}.citationIds`,
          "Claim-bearing text requires at least one primary-source citation.",
        );
      }
    }
    for (const citationId of block.citationIds ?? []) {
      if (!citationIds.has(citationId)) {
        addIssue(
          issues,
          "CITATION_MISSING",
          `${path}.citationIds`,
          `Citation '${citationId}' is not in the ledger.`,
        );
      }
    }
  });

  if (bodyHeadingCount === 0) {
    addIssue(
      issues,
      "HEADING_STRUCTURE_INVALID",
      "content.blocks",
      "Article body content must contain at least one level-two section heading.",
    );
  }
}

function validateCitations(input: BlogPublishingInput, issues: BlogValidationIssue[]): void {
  const seen = new Set<string>();
  input.content.citations.forEach((citation, index) => {
    const path = `content.citations[${index}]`;
    const validAccessDate = isCalendarDate(citation.accessedAt);
    if (
      !hasText(citation.id) ||
      seen.has(citation.id) ||
      !hasText(citation.title) ||
      !hasText(citation.publisher) ||
      !parseHttpsUrl(citation.url) ||
      !validAccessDate ||
      !citation.primarySource
    ) {
      addIssue(
        issues,
        "CITATION_INVALID",
        path,
        "Ledger entries must be unique, complete, primary sources with valid HTTPS URLs and access dates.",
      );
    }
    seen.add(citation.id);
  });
}

function validateMedia(
  input: BlogPublishingInput,
  issues: BlogValidationIssue[],
  now: number | null,
): void {
  const approvedAssets = new Set(input.policy.approvedMediaAssetIds);
  const mediaById = new Map(input.content.media.map((asset) => [asset.id, asset]));
  for (const [index, block] of input.content.blocks.entries()) {
    if (block.type !== "image") continue;
    const asset = mediaById.get(block.assetId);
    if (!asset || !approvedAssets.has(block.assetId)) {
      addIssue(
        issues,
        "LEGAL_MEDIA_RIGHTS_INVALID",
        `content.blocks[${index}].assetId`,
        "Image must reference an approved Builder Media asset.",
      );
    }
  }
  input.content.media.forEach((asset, index) => {
    const path = `content.media[${index}]`;
    const expiry = asset.rightsExpiresAt === null ? null : parseTimestamp(asset.rightsExpiresAt);
    const metadataComplete =
      hasText(asset.id) &&
      parseHttpsUrl(asset.url) !== null &&
      (asset.decorative ? asset.alt.length === 0 : hasText(asset.alt)) &&
      hasText(asset.rightsOwner) &&
      hasText(asset.license) &&
      parseHttpsUrl(asset.sourceUrl) !== null &&
      hasText(asset.approvalId);
    if (
      !approvedAssets.has(asset.id) ||
      asset.rightsStatus !== "approved" ||
      !metadataComplete ||
      (asset.rightsExpiresAt !== null && (expiry === null || now === null || expiry <= now))
    ) {
      addIssue(
        issues,
        "LEGAL_MEDIA_RIGHTS_INVALID",
        path,
        "Asset approval, alt text, HTTPS source, and current rights metadata are required.",
      );
    }
  });
}

function validateTaxonomy(input: BlogPublishingInput, issues: BlogValidationIssue[]): void {
  const categories = new Set(input.content.categories);
  const tags = new Set(input.content.tags);
  const approvedCategories = new Set(input.policy.approvedCategories);
  const approvedTags = new Set(input.policy.approvedTags);
  if (
    categories.size !== input.content.categories.length ||
    categories.size < 1 ||
    categories.size > 5 ||
    input.content.categories.some((value) => !approvedCategories.has(value)) ||
    tags.size !== input.content.tags.length ||
    tags.size < 1 ||
    tags.size > 10 ||
    input.content.tags.some((value) => !approvedTags.has(value))
  ) {
    addIssue(
      issues,
      "TAXONOMY_INVALID",
      "content.categories",
      "Categories and tags must be unique, within limits, and allowlisted.",
    );
  }
}

function validateDates(input: BlogPublishingInput, issues: BlogValidationIssue[]): number | null {
  const now = parseTimestamp(input.policy.now);
  const created = parseTimestamp(input.content.createdAt);
  const updated = parseTimestamp(input.content.updatedAt);
  const published =
    input.content.publishedAt === null ? null : parseTimestamp(input.content.publishedAt);
  const scheduled =
    input.content.scheduledAt === null ? null : parseTimestamp(input.content.scheduledAt);
  if (
    now === null ||
    created === null ||
    updated === null ||
    updated < created ||
    (input.content.publishedAt !== null && (published === null || published < created)) ||
    ((input.action === "publish" || input.action === "schedule") && published === null) ||
    (input.action === "schedule" && scheduled !== null && published !== scheduled)
  ) {
    addIssue(
      issues,
      "DATE_INVALID",
      "content",
      "Validation, creation, update, and publication dates must be valid and chronologically ordered.",
    );
  }
  if (
    (input.action === "schedule" && (scheduled === null || now === null || scheduled <= now)) ||
    (input.action !== "schedule" && input.content.scheduledAt !== null)
  ) {
    addIssue(
      issues,
      "SCHEDULE_INVALID",
      "content.scheduledAt",
      "Schedule actions require a future date; other actions must omit it.",
    );
  }
  return now;
}

function validateActionState(input: BlogPublishingInput, issues: BlogValidationIssue[]): void {
  const hasEntryId = input.workflow.entryId !== null && hasText(input.workflow.entryId);
  const requiresSavedDraft = input.action === "publish" || input.action === "schedule";
  const requiresExistingEntry = input.action === "update" || input.action === "archive";
  if (
    (input.workflow.currentStatus === "new" && hasEntryId) ||
    (input.workflow.currentStatus !== "new" && !hasEntryId) ||
    (requiresSavedDraft &&
      (!hasEntryId ||
        input.workflow.currentStatus !== "draft" ||
        !input.workflow.savedDraftRevalidated)) ||
    (requiresExistingEntry && !hasEntryId) ||
    (input.action === "archive" && input.workflow.currentStatus === "archived")
  ) {
    addIssue(
      issues,
      "ACTION_STATE_INVALID",
      "workflow",
      "Action is not allowed from the supplied entry state; publishing and scheduling require a revalidated saved draft.",
    );
  }
}

function validatePolicy(input: BlogPublishingInput, issues: BlogValidationIssue[]): void {
  if (!input.policy.approvedBrandVoiceIds.includes(input.brief.brandVoiceId)) {
    addIssue(
      issues,
      "BRAND_VOICE_UNAPPROVED",
      "brief.brandVoiceId",
      "Brand voice is not approved.",
    );
  }
  if (!input.attestations.copyEdited) {
    addIssue(
      issues,
      "COPY_EDIT_INCOMPLETE",
      "attestations.copyEdited",
      "Copy editing must be completed.",
    );
  }
  if (!input.attestations.originalityReviewed) {
    addIssue(
      issues,
      "ORIGINALITY_REVIEW_INCOMPLETE",
      "attestations.originalityReviewed",
      "Originality review must be completed.",
    );
  }
  if (!input.attestations.noKnownLegalIssue) {
    addIssue(
      issues,
      "LEGAL_RISK_PRESENT",
      "attestations.noKnownLegalIssue",
      "Known legal concerns must be resolved.",
    );
  }
  if (!input.attestations.containsNoSecretsOrChainOfThought) {
    addIssue(
      issues,
      "CONFIDENTIALITY_ATTESTATION_MISSING",
      "attestations.containsNoSecretsOrChainOfThought",
      "Secrets and hidden reasoning are prohibited.",
    );
  }
}

function applyOverride(
  input: BlogPublishingInput,
  issues: BlogValidationIssue[],
  now: number | null,
): readonly BlogIssueCode[] {
  const override = input.override;
  if (!override) return [];
  const currentCodes = new Set(issues.map(({ code }) => code));
  const uniqueCodes = new Set(override.issueCodes);
  const approvedAt = parseTimestamp(override.approvedAt);
  const valid =
    override.authorized &&
    hasText(override.actorId) &&
    hasText(override.reason) &&
    hasText(override.auditReference) &&
    approvedAt !== null &&
    now !== null &&
    approvedAt <= now &&
    uniqueCodes.size === override.issueCodes.length &&
    override.issueCodes.length > 0 &&
    override.issueCodes.every((code) => currentCodes.has(code) && OVERRIDABLE_CODES.has(code));
  if (!valid) {
    addIssue(
      issues,
      "OVERRIDE_INVALID",
      "override",
      "Override must be authorized, auditable, current, unique, and limited to present overridable codes.",
    );
    return [];
  }
  return [...uniqueCodes].sort();
}

export function validateBlogPublishingInput(input: BlogPublishingInput): BlogValidationResult {
  const issues: BlogValidationIssue[] = [];
  validateRequired(input, issues);
  validateMetadata(input, issues);
  validateBlocks(input, issues);
  validateCitations(input, issues);
  validateTaxonomy(input, issues);
  const now = validateDates(input, issues);
  validateActionState(input, issues);
  validateMedia(input, issues, now);
  validatePolicy(input, issues);
  const acceptedOverrideCodes = applyOverride(input, issues, now);
  const accepted = new Set(acceptedOverrideCodes);
  const blockingIssues = issues.filter(
    (issue) => issue.severity === "error" && !accepted.has(issue.code),
  );
  return {
    valid: blockingIssues.length === 0,
    issues,
    blockingIssues,
    acceptedOverrideCodes,
  };
}
