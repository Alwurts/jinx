import { auth } from "@/auth";
import { defDiagram } from "@/lib/defaults";
import db from "@/server/db";
import { directory, diagram, form, document } from "@/server/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createWorkspaceItemSchema = z.object({
	type: z.enum(["directory", "diagram", "form", "document"]),
	title: z.string().min(1),
	directoryId: z.string().min(1),
	content: z.union([z.string(), z.record(z.any())]).optional(),
});

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const json = await request.json();
		const validated = createWorkspaceItemSchema.parse(json);

		if (validated.type === "directory") {
			const newDirectory = await db
				.insert(directory)
				.values({
					title: validated.title,
					directoryId: validated.directoryId,
					userId: session.user.id,
				})
				.returning();

			return NextResponse.json(newDirectory[0]);
		}

		if (validated.type === "diagram") {
			const diagramContent =
				typeof validated.content === "string" ? validated.content : defDiagram;

			const newDiagram = await db
				.insert(diagram)
				.values({
					title: validated.title,
					content: diagramContent,
					directoryId: validated.directoryId,
					userId: session.user.id,
				})
				.returning();

			return NextResponse.json(newDiagram[0]);
		}

		if (validated.type === "form") {
			const formSchema =
				validated.content && typeof validated.content === "object"
					? validated.content
					: {
							type: "default",
							components: [],
						};

			const newForm = await db
				.insert(form)
				.values({
					title: validated.title,
					schema: formSchema,
					directoryId: validated.directoryId,
					userId: session.user.id,
				})
				.returning();

			return NextResponse.json(newForm[0]);
		}

		if (validated.type === "document") {
			const documentContent =
				typeof validated.content === "string" ? validated.content : "# Edit me";

			const newDocument = await db
				.insert(document)
				.values({
					title: validated.title,
					content: documentContent,
					directoryId: validated.directoryId,
					userId: session.user.id,
				})
				.returning();

			return NextResponse.json(newDocument[0]);
		}

		return NextResponse.json(
			{ message: "Invalid workspace item type" },
			{ status: 400 },
		);
	} catch (error) {
		console.error("Error creating workspace item:", error);
		return NextResponse.json(
			{ message: "Error creating workspace item" },
			{ status: 500 },
		);
	}
}
