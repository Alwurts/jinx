import { auth } from "@/auth";
import db from "@/server/db";
import { task } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateTaskSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
});

// Add this new schema for linking diagram
const linkDiagramSchema = z.object({
	diagramId: z.string().uuid(),
});

// GET a single task
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = params.id;
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const foundTask = await db.query.task.findFirst({
		where: and(eq(task.id, id), eq(task.userId, session.user.id)),
		with: {
			diagram: true,
		},
	});

	return NextResponse.json(foundTask);
}

// UPDATE a task
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = params.id;
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const json = await request.json();
	const validated = updateTaskSchema.parse(json);

	const updatedTask = await db
		.update(task)
		.set({ ...validated, updatedAt: new Date() })
		.where(and(eq(task.id, id), eq(task.userId, session.user.id)))
		.returning();

	return NextResponse.json(updatedTask[0]);
}

// DELETE a task
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = params.id;
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const deletedTask = await db
		.delete(task)
		.where(and(eq(task.id, id), eq(task.userId, session.user.id)))
		.returning();

	return NextResponse.json(deletedTask[0]);
}

// LINK task to diagram
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = params.id;
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const json = await request.json();
	const validated = linkDiagramSchema.parse(json);

	const updatedTask = await db
		.update(task)
		.set({
			createdFromDiagramId: validated.diagramId,
			updatedAt: new Date(),
		})
		.where(and(eq(task.id, id), eq(task.userId, session.user.id)))
		.returning();

	if (!updatedTask[0]) {
		return NextResponse.json(
			{ message: "Task not found or unauthorized" },
			{ status: 404 },
		);
	}

	return NextResponse.json(updatedTask[0]);
}
