import { auth } from "@/auth"
import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BookmarksPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
        <p>Please log in to view your bookmarks.</p>
      </div>
    )
  }

  const bookmarks = await db.bookmark.findMany({
    where: { userId: session.user.id },
    include: { article: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Your Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p>You have not bookmarked any articles yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="border p-4 rounded">
              <Link href={`/articles/${bookmark.article.id}`} className="font-bold text-xl text-white-600 hover:underline">
                {bookmark.article.title}
              </Link>
              <p className="text-sm text-white-600 mt-1">
                Bookmarked on {bookmark.createdAt.toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}