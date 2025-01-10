"use client";

import { useChat, experimental_useObject as useObject } from "ai/react";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { z } from "zod";

interface ChatContextType {
	jinxChat: ReturnType<typeof useChat>;
	generateForm: ReturnType<typeof useObject>;
	generateDiagram: ReturnType<typeof useObject>;
	generateDocument: ReturnType<typeof useObject>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({
	children,
}: {
	children: ReactNode;
}) {
	const formGenerationParams = useRef<{
		toolId: string;
	} | null>(null);

	const bpmnGenerationParams = useRef<{
		toolId: string;
	} | null>(null);

	const documentGenerationParams = useRef<{
		toolId: string;
	} | null>(null);

	const generateForm = useObject({
		api: "/api/ai/form",
		schema: z.array(z.any()),
		onFinish: ({ object }) => {
			console.log("generateForm.onFinish", { object, formGenerationParams });
			if (object && formGenerationParams.current) {
				console.log("Adding tool result");
				console.log(
					"toolId",
					JSON.stringify(formGenerationParams.current.toolId),
				);
				jinxChat.addToolResult({
					toolCallId: formGenerationParams.current.toolId,
					result: "Finished generating form",
				});
				formGenerationParams.current = null;
			}
		},
	});

	const generateBPMNDiagram = useObject({
		api: "/api/ai/diagram",
		schema: z.object({
			xml: z.string(),
		}),
		onFinish: ({ object }) => {
			console.log("generateBPMNDiagram.onFinish", {
				object,
				bpmnGenerationParams,
			});
			if (object && bpmnGenerationParams.current) {
				jinxChat.addToolResult({
					toolCallId: bpmnGenerationParams.current.toolId,
					result: "Finished generating BPMN diagram",
				});
				bpmnGenerationParams.current = null;
			}
		},
	});

	const generateMarkdownDocument = useObject({
		api: "/api/ai/document",
		schema: z.string(),
		onFinish: ({ object }) => {
			console.log("generateMarkdownDocument.onFinish", {
				object,
				documentGenerationParams,
			});
			if (object && documentGenerationParams.current) {
				jinxChat.addToolResult({
					toolCallId: documentGenerationParams.current.toolId,
					result: "Finished generating document",
				});
				documentGenerationParams.current = null;
			}
		},
	});

	const jinxChat = useChat({
		api: "/api/ai/chat",
		maxSteps: 5,
		async onToolCall({ toolCall }) {
			console.log("Calling tool", toolCall);
			switch (toolCall.toolName) {
				case "generateForm": {
					const formDescription = (toolCall.args as { formDescription: string })
						.formDescription;
					formGenerationParams.current = {
						toolId: toolCall.toolCallId,
					};
					console.log("toolCallId", toolCall.toolCallId);
					console.log(
						"formGenerationParams.current",
						formGenerationParams.current,
					);

					console.log("formDescription", formDescription);

					generateForm.submit({
						input: formDescription,
					});
					break;
				}

				case "generateBPMNDiagram": {
					const processDescription = (
						toolCall.args as { processDescription: string }
					).processDescription;
					bpmnGenerationParams.current = {
						toolId: toolCall.toolCallId,
					};

					generateBPMNDiagram.submit({
						input: processDescription,
					});
					break;
				}

				case "generateDocument": {
					const documentDescription = (
						toolCall.args as { documentDescription: string }
					).documentDescription;
					documentGenerationParams.current = {
						toolId: toolCall.toolCallId,
					};

					generateMarkdownDocument.submit({
						input: documentDescription,
					});
					break;
				}
			}
		},
	});

	return (
		<ChatContext.Provider
			value={{
				jinxChat,
				generateForm,
				generateDiagram: generateBPMNDiagram,
				generateDocument: generateMarkdownDocument,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export function useChatContext() {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChatContext must be used within a ChatProvider");
	}
	return context;
}
