"use client";

import { useChat, experimental_useObject as useObject } from "ai/react";
import { type ReactNode, createContext, useContext } from "react";
import { z } from "zod";

interface ChatContextType {
	jinxChat: ReturnType<typeof useChat>;
	generateForm: ReturnType<typeof useObject>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({
	children,
}: {
	children: ReactNode;
}) {
	const generateForm = useObject({
		api: "/api/ai/generate-bpmn-diagram",
		schema: z.object({
			toolId: z.string(),
			diagramId: z.string(),
			xml: z.string(),
		}),
		onFinish: ({ object }) => {
			console.log("generateDiagram.onFinish", object);
			if (object) {
				jinxChat.addToolResult({
					toolCallId: object.toolId,
					result: "Diagram has finished generating",
				});
			}
		},
	});

	const jinxChat = useChat({
		api: "/api/ai/chat",
		maxSteps: 5,
		async onToolCall({ toolCall }) {
			console.log("Calling tool", toolCall);
			switch (toolCall.toolName) {
				case "generateBPMNDiagram": {
					const processDescription = (
						toolCall.args as { processDescription: string }
					).processDescription;
					const diagramId = (toolCall.args as { diagramId: string }).diagramId;

					generateForm.submit({
						input: processDescription,
						toolId: toolCall.toolCallId,
						diagramId: diagramId,
					});
				}
			}
		},
	});

	return (
		<ChatContext.Provider value={{ jinxChat, generateForm }}>
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
