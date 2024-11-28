import { auth } from "@/auth";
import db from "@/server/db";
import { directory } from "@/server/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = params.id;

	const session = await auth();

	if (!session || !session.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	if (id === "root") {
		const homeDirectory = await db.query.directory.findFirst({
			where: and(
				isNull(directory.directoryId),
				eq(directory.userId, session.user.id),
			),
			with: {
				parent: true,
				directories: true,
				diagrams: true,
			},
		});
		return NextResponse.json(homeDirectory);
	}

	const subDirectory = await db.query.directory.findFirst({
		where: and(eq(directory.userId, session.user.id), eq(directory.id, id)),
		with: {
			parent: true,
			directories: true,
			diagrams: true,
		},
	});

	return NextResponse.json(subDirectory);
}
