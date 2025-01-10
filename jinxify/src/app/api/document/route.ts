import { auth } from "@/auth";
import db from "@/server/db";
import { document } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const documents = await db.query.document.findMany({
			where: eq(document.userId, session.user.id),
			orderBy: (document, { desc }) => [desc(document.updatedAt)],
		});

		return NextResponse.json(documents);
	} catch (error) {
		console.error("Error fetching documents:", error);
		return NextResponse.json(
			{ message: "Error fetching documents" },
			{ status: 500 },
		);
	}
}

const createDocumentSchema = z.object({
	title: z.string().min(1),
	content: z.string(),
	directoryId: z.string().min(1),
});

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const json = await request.json();
		const validated = createDocumentSchema.parse(json);

		const newDocument = await db
			.insert(document)
			.values({
				...validated,
				userId: session.user.id,
			})
			.returning();

		return NextResponse.json(newDocument[0]);
	} catch (error) {
		console.error("Error creating document:", error);
		return NextResponse.json(
			{ message: "Error creating document" },
			{ status: 500 },
		);
	}
} 