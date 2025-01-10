import { ChatProvider } from "@/components/chat/chat-provider";

export default async function EditorsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ChatProvider>{children}</ChatProvider>;
}
