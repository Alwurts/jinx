import { auth } from "@/auth";
import db from "@/server/db";
import { formSubmission } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

export async function POST(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const formId = params.id;
		const data = await request.json();

		const [submission] = await db
			.insert(formSubmission)
			.values({
				formId,
				userId: session.user.id,
				data,
			})
			.returning();

		return NextResponse.json(submission);
	} catch (error) {
		console.error("Error submitting form:", error);
		return NextResponse.json(
			{ message: "Error submitting form" },
			{ status: 500 },
		);
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const submissions = await db.query.formSubmission.findMany({
			where: and(
				eq(formSubmission.formId, params.id),
				eq(formSubmission.userId, session.user.id),
			),
			orderBy: (submissions) => submissions.createdAt,
		});

		return NextResponse.json(submissions);
	} catch (error) {
		console.error("Error fetching form submissions:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
