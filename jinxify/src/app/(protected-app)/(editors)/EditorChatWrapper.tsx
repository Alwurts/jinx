"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ChatProvider } from "@/components/chat/chat-provider";

interface EditorChatWrapperProps {
	children: ReactNode;
}

export default function EditorChatWrapper({
	children,
}: EditorChatWrapperProps) {
	const pathname = usePathname();
	const segments = pathname.split("/").filter((segment) => segment.length > 0);

	// If the URL includes a group folder like "editors" then adjust segments accordingly
	let editorType = "document";
	let documentId = "";

	if (segments.length === 0) {
		// fallback
		editorType = "document";
		documentId = "";
	} else {
		// If the first segment is "editors", then the real editor type is the second segment
		if (segments[0] === "editors") {
			editorType = segments[1] || "document";
			documentId = segments[2] || "";
		} else {
			// Otherwise assume the URL is like /{editorType}/{id}
			editorType = segments[0] || "document";
			documentId = segments[1] || "";
		}
	}

	return (
		<ChatProvider editorType={editorType} documentId={documentId}>
			{children}
		</ChatProvider>
	);
}
