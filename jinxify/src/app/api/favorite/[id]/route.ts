import { auth } from "@/auth";
import db from "@/server/db";
import { diagram, form, document } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateFavoritesSchema = z.object({
	type: z.enum(["diagram", "form", "document"]),
	isFavorite: z.boolean(),
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
		const validated = updateFavoritesSchema.parse(reqData);

		let tableToUse = null;
		switch (validated.type) {
			case "diagram":
				tableToUse = diagram;
				break;
			case "form":
				tableToUse = form;
				break;
			case "document":
				tableToUse = document;
				break;
		}
		if (tableToUse) {
			await db
				.update(tableToUse)
				.set({
					isFavorite: validated.isFavorite,
				})
				.where(
					and(eq(tableToUse.id, id), eq(tableToUse.userId, session.user.id)),
				);

			return NextResponse.json({ message: "Favorites is updated" });
		}
	} catch (error) {
		console.error("Error updating favorite:", error);
		return NextResponse.json(
			{ message: "Error updating favorite" },
			{ status: 500 },
		);
	}
}
