import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Frontmatter } from "@/types/mdx";
import { MDXRemote, compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";

function getPost(slug: string) {
	const filePath = path.join(process.cwd(), `src/posts/${slug}.mdx`);
	if (!fs.existsSync(filePath)) {
		return notFound();
	}
	const fileContents = fs.readFileSync(filePath, "utf8");
	return fileContents;
}

export async function generateStaticParams() {
	const postsDirectory = path.join(process.cwd(), "src/posts");
	const files = fs.readdirSync(postsDirectory);
	const postsFileNames = files.map((fileName) => {
		return fileName;
	});
	return postsFileNames.map((post) => ({
		slug: post,
	}));
}

export async function generateMetadata({
	params,
}: { params: { slug: string } }) {
	const fileContents = getPost(params.slug);
	const { frontmatter } = await compileMDX<Frontmatter>({
		source: fileContents,
		options: {
			parseFrontmatter: true,
		},
	});
	return {
		title: frontmatter.title,
		description: frontmatter.description,
	};
}

export default async function Page({ params }: { params: { slug: string } }) {
	const fileContents = getPost(params.slug);

	const { frontmatter } = await compileMDX<Frontmatter>({
		source: fileContents,
		options: {
			parseFrontmatter: true,
		},
	});

	console.log("frontmatter", frontmatter);
	return (
		<div className="py-10 px-4">
			<Card className="container mx-auto p-6">
				<article className="flex flex-col items-start">
					<div className="flex flex-col items-start gap-1">
						<h1 className="text-center text-4xl font-bold">
							{frontmatter.title}
						</h1>
						<p className="text-center text-lg">
							{new Date(frontmatter.date).toLocaleDateString()}
						</p>
					</div>
					<Separator className="mt-4" />
					<div className="max-w-none prose prose-headings:my-6 prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-p:my-3 prose-li:my-1 prose-ul:my-3 ">
						<MDXRemote
							source={fileContents}
							options={{
								parseFrontmatter: true,
							}}
						/>
					</div>
				</article>
			</Card>
		</div>
	);
}
