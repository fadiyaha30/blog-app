import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CommentSection from "./CommentSection";
import { auth } from "@/auth";
import { BookmarkButton } from "@/components/BookmarkButton";
import { UserRole } from "@prisma/client";

type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    role: UserRole;
    isTwoFactorEnabled: boolean;
  };
  category: {
    id: string;
    name: string;
  };
};

export const revalidate = 0;

async function getArticle(id: string): Promise<Article | null> {
  try {
    const article = await db.article.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
      },
    });

    if (!article) return null;

    return {
      id: article.id,
      title: article.title,
      content: article.content,
      imageUrl: article.imageUrl,
      createdAt: article.createdAt,
      author: {
        id: article.author.id,
        name: article.author.name,
        email: article.author.email,
        emailVerified: article.author.emailVerified,
        image: article.author.image,
        password: article.author.password,
        role: article.author.role,
        isTwoFactorEnabled: article.author.isTwoFactorEnabled,
      },
      category: {
        id: article.category.id,
        name: article.category.name,
      },
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    throw new Error(`Failed to fetch article: ${(error as Error).message}`);
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  const isBookmarked = session?.user
    ? await db.bookmark.findUnique({
        where: {
          userId_articleId: {
            userId: session.user.id,
            articleId: article.id,
          },
        },
      })
    : false;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Articles
      </Link>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{article.title}</h1>
      </div>
      <div className="mb-4">
        <p>Written by: {article.author.name}</p>
        <p>Category: {article.category.name}</p>
        <p>Published: {new Date(article.createdAt).toLocaleDateString()}</p>
      </div>
      {article.imageUrl && (
        <div className="mb-4">
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
        </div>
      )}
      <div className="prose lg:prose-xl w-full max-w-full">
        <p
          className="break-words"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
      <div className="mt-8">
        <CommentSection articleId={article.id} />
      </div>
      {session?.user && (
        <div className="mt-4">
          <BookmarkButton
            articleId={article.id}
            initialIsBookmarked={!!isBookmarked}
          />
        </div>
      )}
    </div>
  );
}
