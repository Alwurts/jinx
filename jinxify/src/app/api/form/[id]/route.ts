import { auth } from "@/auth";
import db from "@/server/db";
import { form } from "@/server/db/schema";
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

	const subForm = await db.query.form.findFirst({
		where: and(eq(form.userId, session.user.id), eq(form.id, id)),
	});

	return NextResponse.json(subForm);
}

const updateFormSchemaSchema = z.object({
	schema: z.any(),
	title: z.string().optional(),
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
		const validated = updateFormSchemaSchema.parse(reqData);

		const [formResponse] = await db
			.update(form)
			.set({
				schema: validated.schema,
				...(validated.title && { title: validated.title }),
			})
			.where(and(eq(form.id, id), eq(form.userId, session.user.id)))
			.returning();

		return NextResponse.json(formResponse);
	} catch (error) {
		console.error("Error updating form:", error);
		return NextResponse.json(
			{ message: "Error updating form" },
			{ status: 500 },
		);
	}
}
