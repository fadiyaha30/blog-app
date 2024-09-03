
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {db} from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json(users);
}

export async function PUT(req: Request) {
  const session = await auth();

  // if (!session || session.user.role !== "ADMIN") {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }

  const { userId, role } = await req.json();

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: { role },
  });

  return NextResponse.json(updatedUser);
}