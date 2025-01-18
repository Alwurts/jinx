import { auth } from "@/auth";
import db from "@/server/db";
import { task } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await auth();
		const userId = session?.user?.id;
		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		const foundTask = await db.query.task.findFirst({
			where: (tasks, { eq, and }) =>
				and(eq(tasks.id, params.id), eq(tasks.userId, userId)),
			with: {
				diagram: true,
				document: true,
				form: true,
			},
		});

		if (!foundTask) {
			return new Response("Task not found", { status: 404 });
		}

		return new Response(JSON.stringify(foundTask), {
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching task:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await auth();
		const userId = session?.user?.id;
		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await request.json();
		const {
			title,
			description,
			status,
			linkedDiagramId,
			linkedDocumentId,
			linkedFormId,
		} = body;

		const updatedTask = await db
			.update(task)
			.set({
				title,
				description,
				status,
				linkedDiagramId: linkedDiagramId || null,
				linkedDocumentId: linkedDocumentId || null,
				linkedFormId: linkedFormId || null,
			})
			.where(and(eq(task.id, params.id), eq(task.userId, userId)))
			.returning();

		if (!updatedTask.length) {
			return new Response("Task not found", { status: 404 });
		}

		return new Response(JSON.stringify(updatedTask[0]), {
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Error updating task:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await auth();
		const userId = session?.user?.id;
		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		const deletedTask = await db
			.delete(task)
			.where(and(eq(task.id, params.id), eq(task.userId, userId)))
			.returning();

		if (!deletedTask.length) {
			return new Response("Task not found", { status: 404 });
		}

		return new Response(JSON.stringify(deletedTask[0]), {
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Error deleting task:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
