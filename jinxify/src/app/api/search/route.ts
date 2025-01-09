import { diagram } from "@/server/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { like, or } from "drizzle-orm";

export async function POST(request: NextRequest) {
	try {
		const searchQuery = await request.json();

		if (!searchQuery) {
			return NextResponse.json({ data: [] });
		}

		const searchResults = await db
			.select()
			.from(diagram)
			.where(or(like(diagram.title, `%${searchQuery}%`)));

		return NextResponse.json({ data: searchResults });
	} catch (error) {
		console.error("Search error:", error);
		return NextResponse.json(
			{ error: "Failed to perform search" },
			{ status: 500 },
		);
	}
}
