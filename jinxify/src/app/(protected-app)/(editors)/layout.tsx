import EditorChatWrapper from "./EditorChatWrapper";

export default async function EditorsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <EditorChatWrapper>{children}</EditorChatWrapper>;
}
