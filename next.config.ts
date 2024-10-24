import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	images: {
		domains: ["imageplaceholder.net"],
	},
};

const withMDX = createMDX({
	options: {
		remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
	},
});

export default withMDX(nextConfig);
