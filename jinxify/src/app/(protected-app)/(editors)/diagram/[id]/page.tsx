"use client";

import { useChatContext } from "@/components/chat/chat-provider";
import { ChatSidebar } from "@/components/chat/sidebar-chat";
import Editor from "@/components/diagram/editor";
import { QuerySpinner } from "@/components/query/query-spinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { TDiagram } from "@/types/db";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Settings2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PropertiesPanel } from "@/components/properties/properties-panel";

export default function page({ params }: { params: { id: string } }) {
	const { jinxChat } = useChatContext();
	const [sidebarView, setSidebarView] = useState<"chat" | "properties">("chat");

	const { isLoading, data } = useQuery<TDiagram>({
		queryKey: ["diagram", params.id],
		queryFn: async () => {
			const response = await fetch(`/api/diagram/${params.id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch diagram");
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
					<Separator orientation="vertical" />
					<h1 className="text-2xl font-bold">Diagram</h1>
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
				{data && <Editor diagram={data} />}
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
						fileType="diagram"
						title={data?.title || ""}
						createdAt={data?.createdAt || new Date()}
						updatedAt={data?.updatedAt || new Date()}
					/>
				)}
			</div>
		</div>
	);
}
