'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteArticleButton({ articleId }: { articleId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this article?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/articles/${articleId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/admin/articles');
          router.refresh();
        } else {
          throw new Error('Failed to delete article');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
    >
      {isDeleting ? 'Deleting...' : 'Delete Article'}
    </button>
  );
}