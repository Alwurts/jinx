import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navigation-bar"; // Import the Navbar component
import { ThemeProvider } from "@/components/theme/theme-provider";

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
		<html lang="en">
			<body className="min-h-screen ">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar /> {/* Add the Navbar component here */}
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
