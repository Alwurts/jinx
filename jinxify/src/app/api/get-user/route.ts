import { auth } from "@/auth";
import db from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await auth();
	if (!session) {
		return NextResponse.json({
			status: 401,
			message: "Not allowed",
		});
	}
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, session.user?.id ?? ""),
	});
	if (!user) {
		return NextResponse.json({
			status: 401,
			message: "Not allowed",
		});
	}

	return NextResponse.json({
		user,
	});
}
