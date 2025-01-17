import { auth } from "@/auth";
import db from "@/server/db";
import { form } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const forms = await db.query.form.findMany({
			where: eq(form.userId, session.user.id),
			orderBy: (form, { desc }) => [desc(form.updatedAt)],
		});

		return NextResponse.json(forms);
	} catch (error) {
		console.error("Error fetching forms:", error);
		return NextResponse.json(
			{ message: "Error fetching forms" },
			{ status: 500 },
		);
	}
}
