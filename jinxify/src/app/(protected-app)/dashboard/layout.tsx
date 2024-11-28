import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	console.log(session?.user);
	if (!session || !session.user) {
		redirect("/");
	}

	return children;
}
