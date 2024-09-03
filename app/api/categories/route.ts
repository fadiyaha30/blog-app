import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const categories = await db.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    try {
        const category = await db.category.create({
            data: { name },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}