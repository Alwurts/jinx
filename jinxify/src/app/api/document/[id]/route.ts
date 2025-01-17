import { auth } from "@/auth";
import db from "@/server/db";
import { document } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
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

	const foundDocument = await db.query.document.findFirst({
		where: and(eq(document.id, id), eq(document.userId, session.user.id)),
	});

	return NextResponse.json(foundDocument);
}

const updateDocumentSchema = z.object({
	title: z.string().min(1).optional(),
	content: z.string().optional(),
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

		const json = await request.json();
		const validated = updateDocumentSchema.parse(json);

		const [documentResponse] = await db
			.update(document)
			.set({
				...validated,
				updatedAt: new Date(),
			})
			.where(and(eq(document.id, id), eq(document.userId, session.user.id)))
			.returning();

		return NextResponse.json(documentResponse);
	} catch (error) {
		console.error("Error updating document:", error);
		return NextResponse.json(
			{ message: "Error updating document" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = params.id;
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const deletedDocument = await db
		.delete(document)
		.where(and(eq(document.id, id), eq(document.userId, session.user.id)))
		.returning();

	return NextResponse.json(deletedDocument[0]);
}
