import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	if (!session || !session.user) {
		redirect("/");
	}

	return <SessionProvider>{children}</SessionProvider>;
}
