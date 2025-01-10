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
					"Trigger the generation of a BPMN diagram based on a business process.",
				parameters: z.object({
					processDescription: z
						.string()
						.describe(
							"The business process to model using the BPMN 2.0 standard terms.",
						),
				}),
			},
			generateForm: {
				description:
					"Trigger the generation of a form-js component based on a form description.",
				parameters: z.object({
					formDescription: z
						.string()
						.describe("The form description to generate."),
				}),
			},
			generateDocument: {
				description:
					"Trigger the generation of a document based on a document description.",
				parameters: z.object({
					documentDescription: z
						.string()
						.describe("The document description to generate."),
				}),
			},
		},
	});

	return result.toDataStreamResponse();
}
