import { auth } from "@/auth";
import db from "@/server/db";
import { diagram } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const diagrams = await db.query.diagram.findMany({
			where: eq(diagram.userId, session.user.id),
			orderBy: (diagram, { desc }) => [desc(diagram.createdAt)],
		});

		return NextResponse.json(diagrams);
	} catch (error) {
		console.error("Error fetching diagrams:", error);
		return NextResponse.json(
			{ message: "Error fetching diagrams" },
			{ status: 500 },
		);
	}
}
