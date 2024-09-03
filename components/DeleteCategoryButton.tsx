'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
}

export const DeleteCategoryButton: React.FC<DeleteCategoryButtonProps> = ({ categoryId, categoryName }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      alert('Category and its contents deleted successfully');
      router.refresh(); // This will trigger a re-fetch of the page data
    } catch (error) {
      console.error('Error deleting category:', error);
      setError((error as Error).message);
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => setShowConfirmation(true)}
        disabled={isDeleting}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">
              This action will permanently delete the category {categoryName} and all its associated articles. This action cannot be undone.
            </p>
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setError(null);
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};