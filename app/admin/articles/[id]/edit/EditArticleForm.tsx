'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
};

export default function EditArticleForm({ article }: { article: Article }) {
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [categoryId, setCategoryId] = useState(article.categoryId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(article.imageUrl);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await fetch(`/api/articles/${article.id}/image`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setImagePreview(null);
        setImageFile(null);
      } else {
        throw new Error('Failed to remove image');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', categoryId);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        router.push(`/admin/articles/${article.id}`);
        router.refresh();
      } else {
        throw new Error('Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          rows={10}
          required
        />
      </div>
      <div>
        <label htmlFor="categoryId" className="block mb-2">Category</label>
        <select
          id="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="image" className="block mb-2">Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
      </div>
      {imagePreview && (
        <div className="relative">
          <Image src={imagePreview} alt="Article image preview" width={200} height={200} className="mt-2" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Remove Image
          </button>
        </div>
      )}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Update Article
      </button>
    </form>
  );
}