"use client";

import { useChat, type Message } from "ai/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { PaperclipIcon } from "lucide-react";
import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import { experimental_useObject as useObject } from "ai/react";

export function DiagramChatSidebar({
	onGenerated,
}: {
	onGenerated: (xml: string) => Promise<void>;
}) {
	const { messages, input, setInput, append, addToolResult } = useChat({
		api: "/api/ai/chat",
		maxSteps: 2,
	});

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize textarea
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			if (input.trim()) {
				append({ content: input, role: "user" });
				setInput("");
			}
		}
	};

	return (
		<div className="w-96 border-l bg-muted/10 flex flex-col h-full">
			<ScrollArea className="flex-1 p-4">
				<div className="space-y-4">
					{messages.map((message) => (
						<ChatMessage
							key={message.id}
							message={message}
							onGenerated={onGenerated}
							addToolResult={addToolResult}
						/>
					))}
				</div>
			</ScrollArea>

			<div className="p-4 border-t">
				<div className="relative">
					<Textarea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type a message..."
						className="min-h-[44px] pr-12 resize-none"
						rows={1}
					/>
					<Button
						size="icon"
						variant="ghost"
						className="absolute right-2 top-2 h-8 w-8"
						onClick={() => {
							// Handle file attachment
						}}
					>
						<PaperclipIcon className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}

function ChatMessage({
	message,
	onGenerated,
	addToolResult,
}: {
	message: Message;
	onGenerated: (xml: string) => Promise<void>;
	addToolResult: ({
		toolCallId,
		result,
	}: {
		toolCallId: string;
		result: string;
	}) => void;
}) {
	const {
		object,
		submit,
		isLoading: isGenerating,
	} = useObject({
		api: "/api/ai/diagram",
		schema: z.object({
			xml: z
				.string()
				.describe(
					"A XML compliant BPMN 2.0 diagram for the given process description.",
				),
		}),
	});

	useEffect(() => {
		if (object?.xml) {
			onGenerated(object.xml);
		}
		if (!isGenerating) {
			console.log("object", object);
		}
	}, [object, onGenerated, isGenerating]);

	return (
		<div
			key={message.id}
			className={cn(
				"p-4 rounded-lg prose prose-invert max-w-none",
				message.role === "user"
					? "bg-primary text-primary-foreground ml-8 prose-headings:text-primary-foreground prose-p:text-primary-foreground prose-li:text-primary-foreground prose-strong:text-primary-foreground prose-code:text-primary-foreground"
					: "bg-muted text-foreground mr-8 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-code:text-foreground",
			)}
		>
			<ReactMarkdown>{message.content}</ReactMarkdown>
			<div>
				{message.toolInvocations?.map((toolInvocation) => {
					const { toolName, toolCallId, state } = toolInvocation;
					const addResult = (result: string) =>
						addToolResult({ toolCallId, result });

					if (toolName === "generateBPMNDiagram") {
						if (state === "call") {
							return (
								<div key={toolCallId}>
									<Button
										variant="default"
										size="lg"
										onClick={() => {
											console.log(
												"Generate BPMN diagram",
												toolInvocation.args.processDescription,
											);
											addResult("BPMN diagram is being generated...");
											submit({
												input: toolInvocation.args.processDescription,
											});
										}}
									>
										Generate BPMN diagram
									</Button>
								</div>
							);
						}
						if (state === "result") {
							if (isGenerating) {
								return (
									<div key={toolCallId}>
										<Button
											variant="default"
											size="lg"
											disabled
											className="animate-pulse"
										>
											Generating...
										</Button>
									</div>
								);
							}
							return (
								<div key={toolCallId}>
									<Button variant="default" size="lg" disabled>
										Diagram Generated!
									</Button>
								</div>
							);
						}
					}
				})}
			</div>
		</div>
	);
}
