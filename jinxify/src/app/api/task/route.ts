import { auth } from "@/auth";
import db from "@/server/db";
import { task } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return new Response("Unauthorized", { status: 401 });
		}

		const tasks = await db.query.task.findMany({
			where: eq(task.userId, session.user.id),
			with: {
				diagram: true,
				document: true,
				form: true,
			},
		});

		return new Response(JSON.stringify(tasks), {
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching tasks:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
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
			dueDate,
		} = body;

		const newTask = await db
			.insert(task)
			.values({
				title,
				description,
				status,
				userId: session.user.id,
				linkedDiagramId: linkedDiagramId || null,
				linkedDocumentId: linkedDocumentId || null,
				linkedFormId: linkedFormId || null,
				dueDate: dueDate ? new Date(dueDate) : null,
			})
			.returning();

		return new Response(JSON.stringify(newTask[0]), {
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Error creating task:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
