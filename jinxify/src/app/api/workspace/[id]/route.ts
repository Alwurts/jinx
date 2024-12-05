import { auth } from "@/auth";
import db from "@/server/db";
import { diagram, directory } from "@/server/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
        eq(directory.userId, session.user.id)
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const session = await auth();
  const { title, type } = await request.json();

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (type === "diagram") {
    const updatedDiagram = await db
      .update(diagram)
      .set({ title })
      .where(and(eq(diagram.id, id), eq(diagram.userId, session.user.id)))
      .returning();
    return NextResponse.json(updatedDiagram[0]);
  }
  const updatedDirectory = await db
    .update(directory)
    .set({ title })
    .where(and(eq(directory.id, id), eq(directory.userId, session.user.id)))
    .returning();

  return NextResponse.json(updatedDirectory[0]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const session = await auth();
  const { type } = await request.json();
  console.log(type);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (type === "diagram") {
    const deletedDiagram = await db
      .delete(diagram)
      .where(and(eq(diagram.id, id), eq(diagram.userId, session.user.id)));
    return NextResponse.json(deletedDiagram);
  }

  const deletedDirectory = await db
    .delete(directory)
    .where(and(eq(directory.id, id), eq(directory.userId, session.user.id)));
  return NextResponse.json(deletedDirectory);
}
