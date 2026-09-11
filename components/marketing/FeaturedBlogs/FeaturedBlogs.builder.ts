import type { RegisteredComponent } from "@builder.io/sdk-react";
import { config } from "@/config";
import FeaturedBlogs from "./FeaturedBlogs";

export const featuredBlogsConfig: RegisteredComponent = {
  component: FeaturedBlogs,
  name: "FeaturedBlogs",
  inputs: [
    { name: "heading", type: "string", defaultValue: "Featured" },
    {
      name: "featuredBlog1",
      type: "reference",
      model: config.models.blogPost,
      helperText: "First featured blog post",
    },
    {
      name: "featuredBlog2",
      type: "reference",
      model: config.models.blogPost,
      helperText: "Second featured blog post (optional)",
    },
    {
      name: "featuredBlog3",
      type: "reference",
      model: config.models.blogPost,
      helperText: "Third featured blog post (optional)",
    },
  ],
};
