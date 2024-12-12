import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/layout/sidebar";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	if (!session || !session.user) {
		redirect("/");
	}

	return (
		<div className="flex h-screen w-screen bg-gray-50">
			<SidebarProvider>
				<AppSidebar session={session ?? null} />
				<main className="flex-1 flex flex-col m-4 bg-background shadow-xl rounded-lg border border-border">
					{children}
				</main>
			</SidebarProvider>
		</div>
	);
}
