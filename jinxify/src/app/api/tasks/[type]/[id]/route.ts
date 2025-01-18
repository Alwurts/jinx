import db from "@/server/db";
import { task } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
	request: Request,
	{ params }: { params: { type: string; id: string } },
) {
	try {
		const { type, id } = params;
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let tasks;

		switch (type) {
			case "diagram":
				tasks = await db.query.task.findMany({
					where: eq(task.linkedDiagramId, id),
				});
				break;
			case "document":
				tasks = await db.query.task.findMany({
					where: eq(task.linkedDocumentId, id),
				});
				break;
			case "form":
				tasks = await db.query.task.findMany({
					where: eq(task.linkedFormId, id),
				});
				break;
			default:
				return new Response("Invalid file type", { status: 400 });
		}

		return new Response(JSON.stringify(tasks), {
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching tasks:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
