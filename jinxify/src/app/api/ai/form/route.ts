import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { GENERATE_FORM_JS_PROMPT } from "@/lib/prompts";
import db from "@/server/db";
import { form } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const maxDuration = 60;

const generateFormSchema = z.object({
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
	const { input, currentEditor } = generateFormSchema.parse(data);
	const currentForm = await db.query.form.findFirst({
		where: eq(form.id, currentEditor.id),
	});
	const parsedInputWithCurrentDocument = `<currentForm>
		${JSON.stringify(currentForm?.schema)}
	</currentForm>
	<CURRENT_CURSOR_POSITION>
		<newRequirements>
			${input}
		</newRequirements>`;

	console.log("input", input);

	const result = await streamObject({
		model: openai("gpt-4o"),
		output: "array",
		schema: z
			.any()
			.describe(
				"A form-js component compliant with the form-js standard schema",
			),
		system: GENERATE_FORM_JS_PROMPT,
		prompt: parsedInputWithCurrentDocument,
	});

	const response = result.toTextStreamResponse();
	return response;
}
