import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/query/query-provider";

export const metadata: Metadata = {
	title: "jinx app",
	description:
		"Our product jinxify for smarter BPMN business processes with help of AI.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
