"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type React from "react";
import { Editor } from "@/components/form-js/editor";
import { ChatSidebar } from "@/components/chat/sidebar-chat";
import { useChatContext } from "@/components/chat/chat-provider";
import { useEffect } from "react";

export default function Form() {
	const { jinxChat } = useChatContext();

	useEffect(() => {
		console.log("jinxChat", jinxChat.messages);
	}, [jinxChat.messages]);

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
					<Button>Save</Button>
				</div>
			</div>
			<div className="flex-1 flex relative overflow-hidden">
				<Editor />
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
