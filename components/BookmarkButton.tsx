'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type BookmarkButtonProps = {
  articleId: string
  initialIsBookmarked: boolean
}

export function BookmarkButton({ articleId, initialIsBookmarked }: BookmarkButtonProps) {
  const { data: session } = useSession()
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const router = useRouter()

  const handleBookmark = async () => {
    if (!session) {
      // Handle unauthenticated user (e.g., redirect to login)
      return
    }

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId }),
      })

      if (response.ok) {
        setIsBookmarked(!isBookmarked)
        router.refresh() // This will refresh the current page
        // Alternatively, you can use:
        // router.push('/bookmarks') // This will navigate to the bookmarks page
      } else {
        console.error('Failed to update bookmark')
      }
    } catch (error) {
      console.error('Error updating bookmark:', error)
    }
  }

  return (
    <button
      onClick={handleBookmark}
      className={`px-4 py-2 rounded ${
        isBookmarked ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}
    >
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  )
}