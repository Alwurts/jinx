import { auth } from "@/auth";
import db from "@/server/db";
import { directory, diagram, form, document } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";


export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {


	const session = await auth();

	if (!session || !session.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}


	const favoritesDocument = await db.query.document.findMany({
		where: and(eq(document.userId, session.user.id), eq(document.isFavorite, true)),
	
	});
	const favoritesForm = await db.query.form.findMany({
		where: and(eq(form.userId, session.user.id), eq(form.isFavorite, true)),
	
	});
	const favoritesDiagram = await db.query.diagram.findMany({
		where: and(eq(diagram.userId, session.user.id), eq(diagram.isFavorite, true)),
	
	});
    
	return NextResponse.json([...favoritesDocument,...favoritesForm,...favoritesDiagram]);
}

