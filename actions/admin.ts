"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import {db} from "@/lib/db";

export const admin = async () => {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
        return { success: "Allowed Server Action!" };
    }

    return { error: "Forbidden Server Action!" }
}

export const getUsersForAdmin = async () => {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) {
        throw new Error("Unauthorized");
    }

    return db.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
}

export const updateUserRole = async (userId: string, newRole: UserRole) => {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) {
        return { error: "Unauthorized" };
    }

    try {
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { role: newRole },
        });
        return { 
            success: `User role updated successfully. ${updatedUser.name} is now ${newRole}.` 
        };
    } catch (error) {
        console.error("Failed to update user role:", error);
        return { error: "Failed to update user role" };
    }
}