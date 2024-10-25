import fs from "node:fs/promises"; // Use promises for async file system operations
import path from "node:path";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Frontmatter } from "@/types/mdx"; // Import Frontmatter type
import { MDXRemote, compileMDX } from "next-mdx-remote/rsc";

async function getPosts() {
	const postsDirectory = path.join(process.cwd(), "src/posts");
	const files = await fs.readdir(postsDirectory); // Use async readdir
	const posts = await Promise.all(
		files.map(async (fileName) => {
			const filePath = path.join(postsDirectory, fileName);
			const fileContents = await fs.readFile(filePath, "utf8"); // Use async readFile
			const { frontmatter } = await compileMDX<Frontmatter>({
				source: fileContents,
				options: {
					parseFrontmatter: true,
				},
			});
			return { fileName, frontmatter }; // Return frontmatter along with fileName
		}),
	);
	return posts;
}

export default async function BlogPage() {
	const posts = await getPosts(); // Await the posts

	return (
		<main className="container mx-auto px-4 py-4">
			<div className="text-center mb-10">
				<h1 className="text-5xl font-bold text-white mb-4">Blog</h1>
				<Separator className="mt-4" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{posts.map(({ fileName, frontmatter }) => (
					<Card
						key={fileName}
						className="bg-white/10 backdrop-blur-lg border-none"
					>
						<div className="p-6 flex flex-col items-start">
							<h2 className="text-2xl font-semibold text-white text-center mb-2">
								<a href={`/blog/${fileName.replace(".mdx", "")}`}>
									{frontmatter.title}
								</a>
							</h2>
							<p className="text-sm text-white/50 mb-2">
								{frontmatter.description}
							</p>
							<Badge className="bg-purple-500 hover:bg-purple-600 text-white">
								{new Date(frontmatter.date).toLocaleDateString()}{" "}
							</Badge>
						</div>
					</Card>
				))}
			</div>
		</main>
	);
}
