import { auth } from "@/auth";
import db from "@/server/db";
import { diagram } from "@/server/db/schema";

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

const generateDiagramSchema = z.object({
	input: z.string().min(1),
});

export async function POST(request: NextRequest) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const data = await request.json();

	const { input } = generateDiagramSchema.parse(data);

	const { object } = await generateObject({
		model: openai("gpt-4o"),
		schema: z.object({
			xml: z
				.string()
				.describe("The BPMN 2.0 XML for the given process description."),
		}),
		system: `You are a BPMN process generator. You are given a description of a process and you need to generate the BPMN 2.0 XML for that process.
				- The XML should be valid and complete.
				- The XML should be a valid BPMN 2.0 diagram make sure the XML is well formed and compliant with BPMN without ommiting anything.
				- The XML should include both the process elements (bpmn:process) and the diagram elements (bpmndi:BPMNDiagram).
				- Be sure to include the connections between the elements.`,
		prompt: input,
	});

	console.log("object", object);

	return NextResponse.json(object);
}
