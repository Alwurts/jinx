import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { GENERATE_DOCUMENT_PROMPT } from "@/lib/prompts";
import db from "@/server/db";
import { document } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const maxDuration = 60;

const generateDiagramSchema = z.object({
	input: z.string().min(1),
	currentEditor: z.object({
		type: z.string().min(1),
		id: z.string().min(1),
	}),
});

export async function POST(request: NextRequest) {
	const session = await auth();

	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const data = await request.json();

	console.log("data", data);
	const { input, currentEditor } = generateDiagramSchema.parse(data);

	const currentDocument = await db.query.document.findFirst({
		where: eq(document.id, currentEditor.id),
	});

	console.log("input", input);

	const parsedInputWithCurrentDocument = `<currentDocument>
		${currentDocument?.content}
	</currentDocument>
	<newRequirements>
		${input}
	</newRequirements>`;

	const result = await streamObject({
		model: openai("gpt-4o"),
		schema: z.object({
			markdown: z
				.string()
				.describe("The markdown for the given document description."),
		}),
		system: GENERATE_DOCUMENT_PROMPT,
		prompt: parsedInputWithCurrentDocument,
	});

	const response = result.toTextStreamResponse();
	return response;
}
