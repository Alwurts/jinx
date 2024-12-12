import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamObject } from "ai";
import {
	GENERATE_BPMN_PROMPT,
	GENERATE_TODOS_OUTOF_DIAGRAM_PROMPT,
} from "@/lib/prompts";
import { TTask, TTaskSchema } from "@/types/db";
import { and } from "drizzle-orm";
import db from "@/server/db";
import { eq } from "drizzle-orm";
import { diagram, task } from "@/server/db/schema";

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const session = await auth();

	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const userId = session.user.id;

	const diagramId = params.id;

	const diagramResult = await db.query.diagram.findFirst({
		where: and(eq(diagram.userId, userId), eq(diagram.id, diagramId)),
	});

	if (!diagramResult) {
		return new Response("Diagram not found", { status: 404 });
	}

	const diagramXML = diagramResult.content;

	const { object } = await generateObject({
		model: openai("gpt-4o"),
		output: "array",
		schema: TTaskSchema,
		system: GENERATE_TODOS_OUTOF_DIAGRAM_PROMPT,
		prompt: diagramXML,
	});

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const tasksParsed: any[] = object.map((task) => ({
		...task,
		userId: userId,
		createdFromDiagramId: diagramId,
	}));

	await db.insert(task).values(tasksParsed);

	return Response.json({
		diagramId,
	});
}
