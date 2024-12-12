import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { GENERATE_BPMN_PROMPT } from "@/lib/prompts";

const generateDiagramSchema = z.object({
	input: z.string().min(1),
});

export async function POST(request: NextRequest) {
	const session = await auth();

	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const data = await request.json();
	const { input } = generateDiagramSchema.parse(data);

	console.log("input", input);

	const result = await streamObject({
		model: openai("gpt-4o"),
		schema: z.object({
			xml: z
				.string()
				.describe("The BPMN 2.0 XML for the given process description."),
		}),
		system: GENERATE_BPMN_PROMPT,
		prompt: input,
	});

	const response = result.toTextStreamResponse();
	return response;
}
