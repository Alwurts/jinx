import { auth } from "@/auth";
import db from "@/server/db";
import { NextResponse } from "next/server";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, name, email } = await request.json();

    const validationResult = UpdateProfileSchema.safeParse({ id, name, email });
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    if (id !== session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized to update this profile" },
        { status: 403 }
      );
    }

    const updatedUser = await db
      .update(users)
      .set({
        name,
        email,
      })
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );
  }
}
