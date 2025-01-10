"use client";

import type { Message } from "ai/react";
import { ChatMessageArea } from "../ui/chat-message-area";
import { ChatMessageAvatar } from "../ui/chat-message";
import { ChatMessageContent } from "../ui/chat-message";
import { ChatMessage } from "../ui/chat-message";
import { ChatInputSubmit, ChatInputTextArea } from "../ui/chat-input";
import { ChatInput } from "../ui/chat-input";

export function ChatSidebar({
	messages,
	input,
	setInput,
	handleSubmit,
	isLoading,
	stop,
}: {
	messages: Message[];
	input: string;
	setInput: (input: string) => void;
	handleSubmit: () => void;
	isLoading: boolean;
	stop: () => void;
}) {
	return (
		<div className="w-96 border-l bg-muted/10 flex flex-col h-full">
			<ChatMessageArea className="flex-1 p-4 space-y-2">
				{messages.map((message) => (
					<ChatMessage
						key={message.id}
						id={message.id}
						variant={message.role === "user" ? "bubble" : "default"}
						type={message.role === "user" ? "outgoing" : "incoming"}
					>
						{message.role !== "user" && <ChatMessageAvatar />}
						<ChatMessageContent content={message.content} />
					</ChatMessage>
				))}
			</ChatMessageArea>

			<div className="p-4 border-t">
				<ChatInput
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onSubmit={handleSubmit}
					loading={isLoading}
					onStop={stop}
				>
					<ChatInputTextArea placeholder="Type a message..." />
					<ChatInputSubmit />
				</ChatInput>
			</div>
		</div>
	);
}
