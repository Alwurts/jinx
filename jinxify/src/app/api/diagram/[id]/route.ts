import { auth } from "@/auth";
import db from "@/server/db";
import { diagram } from "@/server/db/schema";

import { and, eq, isNull } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = params.id;

	const session = await auth();

	if (!session || !session.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const subDiagram = await db.query.diagram.findFirst({
		where: and(eq(diagram.userId, session.user.id), eq(diagram.id, id)),
	});

	return NextResponse.json(subDiagram);
}

const updateDiagramContentSchema = z.object({
	content: z.string().min(1),
});

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		const id = params.id;

		const reqData = await request.json();
		const validated = updateDiagramContentSchema.parse(reqData);

		const [diagramResponse] = await db
			.update(diagram)
			.set({ content: validated.content })
			.where(and(eq(diagram.id, id), eq(diagram.userId, session.user.id)))
			.returning();

		return NextResponse.json(diagramResponse);
	} catch (error) {
		console.error("Error creating workspace item:", error);
		return NextResponse.json(
			{ message: "Error creating workspace item" },
			{ status: 500 },
		);
	}
}
