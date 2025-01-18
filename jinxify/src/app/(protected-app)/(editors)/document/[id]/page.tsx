"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { ChatSidebar } from "@/components/chat/sidebar-chat";
import { useChatContext } from "@/components/chat/chat-provider";
import dynamic from "next/dynamic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TDocument } from "@/types/db";
import { QuerySpinner } from "@/components/query/query-spinner";
import { jsPDF } from "jspdf";
import { DownloadIcon } from "lucide-react";
import { serialize } from "next-mdx-remote/serialize";
import removeMd from "remove-markdown";
import { Download } from "lucide-react";
import { HiPencil } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa6";
import { Input } from "@/components/ui/input";

const Editor = dynamic(() => import("@/components/document/editor"), {
	ssr: false,
	loading: () => (
		<div className="flex-1 flex items-center justify-center">Loading...</div>
	),
});

export default function Document({ params }: { params: { id: string } }) {
	const { jinxChat } = useChatContext();
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState("");

	const { isLoading, data } = useQuery<TDocument>({
		queryKey: ["document", params.id],
		queryFn: async () => {
			const response = await fetch(`/api/document/${params.id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch document");
			}
			const result = await response.json();
			setTitle(result.title); //sets initial title
			return result;
		},
	});

	useEffect(() => {
		if (data) {
			setTitle(data?.title);
		}
	}, [data]);

	const queryClient = useQueryClient();

	// Rename mutation
	const renameMutation = useMutation({
		mutationFn: async () => {
			if (!params?.id) return;
			await fetch(`/api/document/${params.id}`, {
				method: "PATCH",
				body: JSON.stringify({ title: title }),
			});
		},
		onSuccess: () => {
			setIsEditing(false);
			queryClient.invalidateQueries({
				queryKey: ["document", params?.id],
			});
		},
		onError: (error) => {
			console.error("Rename failed:", error.message);
		},
	});

	const handleEditTitle = () => {
		setIsEditing(true);
	};

	const handleButtonClick = () => {
		if (isEditing) {
			renameMutation.mutate();
		} else {
			handleEditTitle();
		}
	};

	return (
		<div className="w-screen h-screen flex flex-col">
			<div className="flex justify-between items-center h-14 px-4 border-b">
				<div className="w-full flex items-center gap-4">
					<Button variant="outline" asChild>
						<Link href={`/dashboard/files?directoryId=${data?.directoryId}`}>
							Back
						</Link>
					</Button>

					<div className="w-full flex items-center justify-between">
						<div className="flex items-center">
							{isEditing ? (
								<Input
									type="text"
									placeholder="Edit title..."
									defaultValue={data?.title ?? ""}
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="text-2xl"
								/>
							) : (
								<h1 className="text-2xl font-bold">{data?.title}</h1>
							)}
							<Button
								variant="ghost"
								disabled={renameMutation.isPending}
								onClick={handleButtonClick}
								className="ml-2 p-2 bg-white"
								aria-label="Edit title"
							>
								{isEditing ? (
									<FaCheck className="text-primary" />
								) : (
									<HiPencil className="text-primary" />
								)}
							</Button>
						</div>

						<Button
							variant="outline"
							onClick={async () => {
								if (!data) return;
								try {
									const plainText = removeMd(data.content);
									const doc = new jsPDF();
									doc.setFont("helvetica");
									doc.setFontSize(24);
									doc.text(data.title, 20, 20);
									doc.setFontSize(12);
									const lineHeight = 7;
									const margin = 20;
									const pageWidth = doc.internal.pageSize.width;
									const maxWidth = pageWidth - margin * 2;
									const lines = doc.splitTextToSize(plainText, maxWidth);
									let y = 40;
									// biome-ignore lint/complexity/noForEach: <explanation>
									lines.forEach((line: string) => {
										if (y > doc.internal.pageSize.height - margin) {
											doc.addPage();
											y = margin;
										}
										doc.text(line, margin, y);
										y += lineHeight;
									});
									doc.save(`${data.title}.pdf`);
								} catch (error) {
									console.error("Error generating PDF:", error);
								}
							}}
							className="flex flex-row-reverse items-center gap-2"
						>
							<DownloadIcon />
							Download PDF
						</Button>
					</div>

					<Separator orientation="vertical" />
				</div>

				<div className="flex items-center gap-2">
					<QuerySpinner />
				</div>
			</div>
			<div className="flex-1 flex relative overflow-hidden">
				{isLoading && !data && (
					<div className="flex-1 flex items-center justify-center">
						Loading...
					</div>
				)}
				{data && <Editor document={data} />}
				<ChatSidebar
					messages={jinxChat.messages}
					input={jinxChat.input}
					setInput={jinxChat.setInput}
					handleSubmit={jinxChat.handleSubmit}
					isLoading={jinxChat.isLoading}
					stop={jinxChat.stop}
				/>
			</div>
		</div>
	);
}
