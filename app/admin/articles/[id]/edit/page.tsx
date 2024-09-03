import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EditArticleForm from './EditArticleForm';

type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  categoryId: string;
};

async function getArticle(id: string): Promise<Article | null> {
  try {
    const article = await db.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        categoryId: true,
      },
    });
    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error(`Failed to fetch article: ${(error as Error).message}`);
  }
}

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href={`/admin/articles/${article.id}`} className="text-blue-500 hover:underline mb-4 block">
        ← Back to Article
      </Link>
      <h1 className="text-3xl font-bold mb-4">Edit Article</h1>
      <EditArticleForm article={article} />
    </div>
  );
}