import { type ToolInvocation, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { DIAGRAM_CHAT_SYSTEM_PROMPT } from "@/lib/prompts";

interface Message {
	role: "user" | "assistant";
	content: string;
	toolInvocations?: ToolInvocation[];
}

export async function POST(req: Request) {
	const { messages }: { messages: Message[] } = await req.json();

	const result = streamText({
		model: openai("gpt-4o-mini"),
		system: DIAGRAM_CHAT_SYSTEM_PROMPT,
		messages,
		tools: {
			generateBPMNDiagram: {
				description:
					"Return a button that the user can click to generate a BPMN diagram based on a business process.",
				parameters: z.object({
					processDescription: z
						.string()
						.describe(
							"The business process to model using the BPMN 2.0 standard terms.",
						),
				}),
			},
		},
	});

	return result.toDataStreamResponse();
}
