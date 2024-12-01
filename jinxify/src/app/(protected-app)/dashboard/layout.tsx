import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	if (!session || !session.user) {
		redirect("/");
	}

	return <SidebarProvider>{children}</SidebarProvider>;
}
