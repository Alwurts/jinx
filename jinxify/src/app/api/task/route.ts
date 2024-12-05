import { auth } from "@/auth";
import db from "@/server/db";
import { task } from "@/server/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createTaskSchema = z.object({
	title: z.string().min(1),
	description: z.string(),
	status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("TODO"),
	createdFromDiagramId: z.string().optional(),
});

// GET all tasks for the authenticated user
export async function GET() {
	const session = await auth();

	const userId = session?.user?.id;

	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const tasks = await db.query.task.findMany({
		where: (task, { eq }) => eq(task.userId, userId),
		with: {
			diagram: true,
		},
	});

	return NextResponse.json(tasks);
}

// CREATE a new task
export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const json = await request.json();
		const validated = createTaskSchema.parse(json);

		const newTask = await db
			.insert(task)
			.values({
				...validated,
				userId: session.user.id,
			})
			.returning();

		return NextResponse.json(newTask[0]);
	} catch (error) {
		console.error("Error creating task:", error);
		return NextResponse.json(
			{ message: "Error creating task" },
			{ status: 500 },
		);
	}
}
