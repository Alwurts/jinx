import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/query/query-provider";
import { poppins } from "@/components/ui/fonts";


export const metadata: Metadata = {
	title: "jinxify",
	description:
		"Our product jinxify for smarter BPMN business processes with help of AI.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${poppins.variable}`}>
			<body>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
