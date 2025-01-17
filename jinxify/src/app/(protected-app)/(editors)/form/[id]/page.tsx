"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type React from "react";
import { ChatSidebar } from "@/components/chat/sidebar-chat";
import { useChatContext } from "@/components/chat/chat-provider";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import type { TForm } from "@/types/db";
import { QuerySpinner } from "@/components/query/query-spinner";
import { SharePopover } from "@/components/share/share-popover";
import { FormSubmissionsDialog } from "@/components/form-js/submissions-dialog";

const Editor = dynamic(() => import("@/components/form-js/editor"), {
	ssr: false,
	loading: () => (
		<div className="flex-1 flex items-center justify-center">Loading...</div>
	),
});

export default function FormEditor({ params }: { params: { id: string } }) {
	const { jinxChat } = useChatContext();

	const { isLoading, data } = useQuery<TForm>({
		queryKey: ["form", params.id],
		queryFn: async () => {
			const response = await fetch(`/api/form/${params.id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch diagram");
			}
			return response.json();
		},
	});

	const shareUrl = `${window.location.origin}/form/view/${params.id}`;

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
					<h1 className="text-2xl font-bold">Form</h1>
				</div>

				<div className="flex items-center gap-2">
					<FormSubmissionsDialog formId={params.id} />
					<SharePopover url={shareUrl} />
					<QuerySpinner />
				</div>
			</div>
			<div className="flex-1 flex relative overflow-hidden">
				{isLoading && !data && (
					<div className="flex-1 flex items-center justify-center">
						Loading...
					</div>
				)}
				{data && <Editor form={data} />}
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
