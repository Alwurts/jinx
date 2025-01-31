import { diagram, form, document } from "@/server/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { and, eq, ilike } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const searchQuery = await request.json();

		if (!searchQuery) {
			return NextResponse.json({ data: [] });
		}

		const { query, type } = searchQuery;
		console.log("Search Query:", searchQuery); // Log for debugging

		const userId = session.user.id;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let searchResults: any;

		if (type === "diagrams") {
			searchResults = await db
				.select()
				.from(diagram)
				.where(
					and(ilike(diagram.title, `%${query}%`), eq(diagram.userId, userId)),
				);
		} else if (type === "forms") {
			searchResults = await db
				.select()
				.from(form)
				.where(and(ilike(form.title, `%${query}%`), eq(form.userId, userId)));
		} else if (type === "documents") {
			searchResults = await db
				.select()
				.from(document)
				.where(
					and(ilike(document.title, `%${query}%`), eq(document.userId, userId)),
				);
		}

		return NextResponse.json({ data: searchResults });
	} catch (error) {
		console.error("Search error:", error);
		return NextResponse.json(
			{ error: "Failed to perform search" },
			{ status: 500 },
		);
	}
}
