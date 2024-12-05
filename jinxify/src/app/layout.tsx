import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/query/query-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
				<QueryProvider>
					<ToastContainer />
					{children}
				</QueryProvider>
			</body>
		</html>
	);
}
