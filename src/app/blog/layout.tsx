import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Jinx",
	description: "Pioneering AI Web Applications",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<article className="prose prose-headings:my-8 prose-headings:font-semibold prose-headings:text-foreground prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-p:my-3 prose-li:my-1 prose-ul:my-3 ">
			{children}
		</article>
	);
}
