"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type React from "react";
import { ChatSidebar } from "@/components/chat/sidebar-chat";
import { useChatContext } from "@/components/chat/chat-provider";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import type { TDocument } from "@/types/db";
import { QuerySpinner } from "@/components/query/query-spinner";
import { jsPDF } from "jspdf";
import { DownloadIcon, MessageSquare, Settings2 } from "lucide-react";
import { serialize } from "next-mdx-remote/serialize";
import removeMd from "remove-markdown";
import { Download } from "lucide-react";
import { PropertiesPanel } from "@/components/properties/properties-panel";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Editor = dynamic(() => import("@/components/document/editor"), {
	ssr: false,
	loading: () => (
		<div className="flex-1 flex items-center justify-center">Loading...</div>
	),
});

export default function Document({ params }: { params: { id: string } }) {
	const { jinxChat } = useChatContext();
	const [sidebarView, setSidebarView] = useState<"chat" | "properties">("chat");

	const { isLoading, data } = useQuery<TDocument>({
		queryKey: ["document", params.id],
		queryFn: async () => {
			const response = await fetch(`/api/document/${params.id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch document");
			}
			return response.json();
		},
	});

	return (
		<div className="w-screen h-screen flex flex-col">
			<div className="flex justify-between items-center h-14 px-4 border-b">
				<div className="flex items-center gap-4">
					<Button variant="outline" asChild>
						<Link href={`/dashboard/files?directoryId=${data?.directoryId}`}>
							Back
						</Link>
					</Button>
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
						className="flex items-center gap-2"
					>
						<DownloadIcon />
						Download PDF
					</Button>
					<Separator orientation="vertical" />

					<h1 className="text-2xl font-bold">
						Document <span className="text-sm">{data?.title}</span>{" "}
					</h1>
				</div>

				<div className="flex items-center gap-2">
					<ToggleGroup
						type="single"
						value={sidebarView}
						onValueChange={(value) =>
							setSidebarView(value as "chat" | "properties")
						}
					>
						<ToggleGroupItem value="chat">
							<MessageSquare className="h-4 w-4" />
						</ToggleGroupItem>
						<ToggleGroupItem value="properties">
							<Settings2 className="h-4 w-4" />
						</ToggleGroupItem>
					</ToggleGroup>
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
				{sidebarView === "chat" ? (
					<ChatSidebar
						messages={jinxChat.messages}
						input={jinxChat.input}
						setInput={jinxChat.setInput}
						handleSubmit={jinxChat.handleSubmit}
						isLoading={jinxChat.isLoading}
						stop={jinxChat.stop}
					/>
				) : (
					<PropertiesPanel
						fileId={params.id}
						fileType="document"
						title={data?.title || ""}
						createdAt={data?.createdAt || new Date()}
						updatedAt={data?.updatedAt || new Date()}
					/>
				)}
			</div>
		</div>
	);
}
