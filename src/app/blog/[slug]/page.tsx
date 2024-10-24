import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "node:fs";
import path from "node:path";

/* export async function generateStaticParams() {
	const posts = await fetch("https://.../posts").then((res) => res.json());

	return posts.map((post) => ({
		slug: post.slug,
	}));
} */

export default async function Page({ params }: { params: { slug: string } }) {
	const filePath = path.join(process.cwd(), `src/posts/${params.slug}.mdx`);
	const source = fs.readFileSync(filePath, "utf8");
	return <MDXRemote source={source} />;
}
