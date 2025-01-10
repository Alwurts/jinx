"use client";

import { useChatContext } from "@/components/chat/chat-provider";
import { ChatSidebar } from "@/components/chat/sidebar-chat";
import Editor from "@/components/diagram/editor";
import { QuerySpinner } from "@/components/query/query-spinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TDiagram } from "@/types/db";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function page({ params }: { params: { id: string } }) {
	const { jinxChat } = useChatContext();

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
						<Link href={"/dashboard/files"}>Back</Link>
					</Button>
					<Separator orientation="vertical" />
					<h1 className="text-2xl font-bold">Form</h1>
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
				{data && <Editor diagram={data} />}
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
