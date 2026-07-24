import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateBlogPublishingInput } from "./validate-blog.ts";
import type { BlogPublishingInput } from "./validate-blog.ts";

const inputPath = process.argv[2];

if (!inputPath) {
  process.stderr.write("Usage: npm run blog:validate -- path/to/input.json\n");
  process.exitCode = 2;
} else {
  try {
    const input = JSON.parse(readFileSync(resolve(inputPath), "utf8")) as BlogPublishingInput;
    const result = validateBlogPublishingInput(input);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.valid) process.exitCode = 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to validate blog input.";
    process.stderr.write(`Blog validation failed: ${message}\n`);
    process.exitCode = 2;
  }
}
