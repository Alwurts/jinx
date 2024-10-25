import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navigation-bar"; // Import the Navbar component

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
				<Navbar /> {/* Add the Navbar component here */}
				{children}
			</body>
		</html>
	);
}
