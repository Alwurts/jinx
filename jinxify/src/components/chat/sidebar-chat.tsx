"use client";

import type { Message } from "ai/react";
import { ChatMessageArea } from "../ui/chat-message-area";
import { ChatMessageAvatar } from "../ui/chat-message";
import { ChatMessageContent } from "../ui/chat-message";
import { ChatMessage } from "../ui/chat-message";
import { ChatInputSubmit, ChatInputTextArea } from "../ui/chat-input";
import { ChatInput } from "../ui/chat-input";
import { ToolInvocationComponent } from "./tool-invocation";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

type SuggestionsByPath = {
	[key: string]: string[];
};

const getSuggestions = (pathname: string) => {
	if (pathname.startsWith("/diagram")) {
		return [
			"Help me create a diagram for the recruitment process",
			"Show me how to map the employee onboarding workflow on a diagram",
			"Create a diagram for performance review process",
			"Visualize the employee offboarding procedure on a diagram",
			"Design a workflow for leave request approvals on a diagram",
		];
	}
	if (pathname.startsWith("/form")) {
		return [
			"Create a form for employee feedback collection",
			"Generate a job application form template",
			"Help me design a performance evaluation form",
			"Make a form for training needs assessment",
			"Create an employee satisfaction form",
		];
	}
	if (pathname.startsWith("/document")) {
		return [
			"Write a sample employee handbook introduction document",
			"Help me draft a job description template document",
			"Create a policy for remote work guidelines document",
			"Write a memo about the new benefits program document",
			"Help me outline a training program document",
		];
	}
	return [];
};

function ChatSuggestions({
	onSuggestionClick,
}: { onSuggestionClick: (suggestion: string) => void }) {
	const pathname = usePathname();
	const suggestions = getSuggestions(pathname);

	return (
		<div className="flex-1 p-4 flex flex-col justify-end gap-2">
			{suggestions.map((suggestion) => (
				<Button
					key={suggestion}
					variant="outline"
					size="sm"
					className="whitespace-pre-wrap h-12"
					onClick={() => onSuggestionClick(suggestion)}
				>
					{suggestion}
				</Button>
			))}
		</div>
	);
}

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
			{messages.length > 0 ? (
				<ChatMessageArea className="flex-1 p-4 space-y-2">
					{messages.map((message) => (
						<ChatMessage
							key={message.id}
							id={message.id}
							variant={message.role === "user" ? "bubble" : "default"}
							type={message.role === "user" ? "outgoing" : "incoming"}
						>
							{message.role !== "user" && <ChatMessageAvatar />}
							<ChatMessageContent content={message.content}>
								{message.toolInvocations?.map((toolInvocation) => (
									<ToolInvocationComponent
										key={toolInvocation.toolCallId}
										toolInvocation={toolInvocation}
									/>
								))}
							</ChatMessageContent>
						</ChatMessage>
					))}
				</ChatMessageArea>
			) : (
				<ChatSuggestions
					onSuggestionClick={(suggestion) => {
						setInput(suggestion);
					}}
				/>
			)}

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
