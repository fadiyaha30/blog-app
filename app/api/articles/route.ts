import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId');

        let articles;
        if (categoryId) {
            articles = await db.article.findMany({
                where: { categoryId },
                include: { author: true, category: true },
            });
        } else {
            articles = await db.article.findMany({
                include: { author: true, category: true },
            });
        }
        return NextResponse.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    console.log('Received POST request for creating article');

    // Test database connection
    try {
        await db.$queryRaw`SELECT 1`;
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error);
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const session = await auth();
    console.log('Session:', session);
    console.log('User role:', session?.user?.role);

    if (!session || session.user?.role !== 'ADMIN') {
        console.log('Unauthorized access attempt');
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        console.log('Received FormData:', Object.fromEntries(formData));

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const categoryId = formData.get('categoryId') as string;
        const image = formData.get('image') as File | null;

        if (!title || !content || !categoryId) {
            console.log('Missing required fields');
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const categoryExists = await db.category.findUnique({
            where: { name: categoryId }
        });
        if (!categoryExists) {
            console.log('Category does not exist:', categoryId);
            return NextResponse.json({ error: "Category does not exist" }, { status: 400 });
        }

        let imageUrl = null;
        if (image) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const path = join('public', 'uploads', image.name);
            try {
                await writeFile(path, buffer);
                imageUrl = `/uploads/${image.name}`;
                console.log('Image saved successfully:', imageUrl);
            } catch (writeError) {
                console.error('Error writing file:', writeError);
                return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
            }
        }

        const article = await db.article.create({
            data: {
                title,
                content,
                imageUrl,
                author: { connect: { id: session.user.id } },
                category: { connect: { name: categoryId } }
            },
        });

        console.log('Article created successfully:', article);
        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        console.error('Error creating article:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ error: "A unique constraint would be violated." }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
    }
}