"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(values: { name: string; email: string }) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.update({
    where: { id: session.user.id },
    data: {
      name: values.name,
      email: values.email,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/profile");

  return user;
}