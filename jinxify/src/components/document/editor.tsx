"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import dynamic from "next/dynamic";

import { useCallback, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useChatContext } from "../chat/chat-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TDocument } from "@/types/db";

const InitializedMDXEditor = dynamic(() => import("./initialized-mdx-editor"), {
	ssr: false,
	loading: () => (
		<div className="flex-1 flex items-center justify-center">
			Loading editor...
		</div>
	),
});

export default function Editor({ document }: { document: TDocument }) {
	const editorRef = useRef<MDXEditorMethods>(null);
	const { generateDocument } = useChatContext();
	const queryClient = useQueryClient();
	const updateDocument = useMutation({
		mutationFn: async (values: { documentId: string; content: string }) => {
			const res = await fetch(`/api/document/${values.documentId}`, {
				method: "PATCH",
				body: JSON.stringify({ content: values.content }),
			});
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["document", document.id],
			});
		},
	});

	const debouncedSave = useDebouncedCallback((content: string) => {
		console.log("Saving document", content);
		updateDocument.mutate({ documentId: document.id, content });
	}, 200);

	const onChange = useCallback(
		(content: string) => {
			debouncedSave(content);
		},
		[debouncedSave],
	);

	useEffect(() => {
		if (generateDocument.object) {
			if (
				typeof generateDocument.object === "object" &&
				"markdown" in generateDocument.object &&
				typeof generateDocument.object.markdown === "string" &&
				generateDocument.object.markdown.trim().length > 0
			) {
				console.log("generateDocument.object", generateDocument.object);
				editorRef.current?.setMarkdown(generateDocument.object.markdown);
				debouncedSave(generateDocument.object.markdown);
			}
		}
	}, [generateDocument.object, debouncedSave]);

	return (
		<div className="flex-1 h-full w-full overflow-auto">
			<InitializedMDXEditor
				editorRef={editorRef}
				markdown={document.content}
				onChange={onChange}
			/>
		</div>
	);
}
