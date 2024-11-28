import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navigation-bar"; // Import the Navbar component
import { ThemeProvider } from "@/components/theme/theme-provider";
import Footer from "@/components/layout/footer";

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
			<body className="min-h-screen flex flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar /> {/* Add the Navbar component here */}
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}