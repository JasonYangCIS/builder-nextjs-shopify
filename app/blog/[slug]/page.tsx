import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BlogArticleHeader,
  BlogAuthorBio,
  BlogCta,
  BlogReferences,
  BlogRelatedPosts,
} from "@jasonyangcis/core-ui";
import BlogAnalyticsBoundary from "@/components/blog/BlogAnalyticsBoundary/BlogAnalyticsBoundary";
import RenderBuilderContent from "@/components/builder/RenderBuilderContent/RenderBuilderContent";
import { config } from "@/config";
import {
  getBlogPostBySlug,
  listBlogPostSlugs,
  listRelatedBlogPosts,
} from "@/lib/builder/client";
import { createBlogJsonLd, serializeJsonLd } from "@/lib/blog/json-ld";

export const revalidate = 5;
export const dynamicParams = true;

type ArticleParams = Promise<{ slug: string }>;

function publishedLabel(value: string | null): string | null {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export async function generateStaticParams() {
  const posts = await listBlogPostSlugs().catch(() => []);
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: ArticleParams }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug).catch(() => null);
  if (!result) return {};
  const { post } = result;
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt ?? undefined;
  const canonical = post.canonicalUrl ?? `/blog/${post.slug}`;
  const images = post.featuredImage ? [{ url: post.featuredImage.url, alt: post.featuredImage.alt ?? post.title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical },
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      authors: post.author ? [post.author.name] : undefined,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description, images: images?.map(({ url }) => url) },
  };
}

export default async function BlogArticlePage({ params }: { params: ArticleParams }) {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug).catch(() => null);
  if (!result) notFound();
  const { content, post } = result;
  const related = await listRelatedBlogPosts(post).catch(() => []);
  const origin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  const jsonLd = createBlogJsonLd({ origin, post });

  return (
    <BlogAnalyticsBoundary postId={post.id}>
      <nav aria-label="Breadcrumb" data-slot="blog-breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog">Blog</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{post.title}</li>
        </ol>
      </nav>

      <article data-slot="blog-article">
        <BlogArticleHeader
          title={post.title}
          eyebrow={post.categories[0]?.name ?? "Dispatch"}
          description={post.excerpt}
          authorName={post.author?.name}
          publishedAt={post.publishedAt}
          publishedLabel={publishedLabel(post.publishedAt)}
          readingTime={post.readingTimeMinutes ? `${post.readingTimeMinutes} min read` : null}
          imageSrc={post.featuredImage?.url}
          imageAlt={post.featuredImage?.alt}
        />

        <section data-slot="blog-article-body" aria-label="Article content">
          <RenderBuilderContent content={content} model={config.models.blogPost} />
        </section>

        <BlogReferences
          heading="Sources"
          items={post.citations.map((citation) => ({
            title: citation.title,
            href: citation.url,
            description: citation.publisher,
          }))}
        />

        {post.author ? (
          <BlogAuthorBio
            name={post.author.name}
            bio={post.author.bio}
            avatarSrc={post.author.avatar?.url}
            avatarAlt={post.author.avatar?.alt ?? post.author.name}
          />
        ) : null}
      </article>

      <BlogRelatedPosts
        data-blog-analytics="related"
        posts={related.map((relatedPost) => ({
          title: relatedPost.title,
          href: `/blog/${relatedPost.slug}`,
          excerpt: relatedPost.excerpt,
          imageSrc: relatedPost.featuredImage?.url,
          imageAlt: relatedPost.featuredImage?.alt,
        }))}
      />

      {post.cta ? (
        <BlogCta
          data-blog-analytics="cta"
          heading={post.cta.heading}
          body={post.cta.body}
          actionLabel={post.cta.actionLabel}
          actionHref={post.cta.actionHref}
          variant="emphasis"
        />
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
    </BlogAnalyticsBoundary>
  );
}
