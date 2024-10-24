import type { NextConfig } from "next";
import createMDX from "@next/mdx";
const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	images: {
		domains: ["imageplaceholder.net"],
	},
};

const withMDX = createMDX();

export default withMDX(nextConfig);
