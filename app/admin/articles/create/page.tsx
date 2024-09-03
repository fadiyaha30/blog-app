'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ArticleInputs = {
  title: string;
  content: string;
  category: string;
  image: FileList;
};

const AddArticlePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  
  const articleForm = useForm<ArticleInputs>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.map((category: { name: string }) => category.name));
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  // Protect the route
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // if (!session || session.user.role !== 'ADMIN') {
  //   router.push('/');
  //   return null;
  // }

  const onArticleSubmit: SubmitHandler<ArticleInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('categoryId', data.category);
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }
  
      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        setMessage('Article added successfully!');
        articleForm.reset();
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to add article.');
      }
    } catch (error) {
      console.error('Error in onArticleSubmit:', error);
      setMessage('An error occurred while adding the article.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/admin" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Admin Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-4">Add New Article</h1>
      
      {message && <p className="my-4 text-green-600">{message}</p>}

      <form onSubmit={articleForm.handleSubmit(onArticleSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Title:</label>
          <input {...articleForm.register('title', { required: true })} className="w-full border p-2" />
        </div>
        <div>
          <label className="block mb-1">Content:</label>
          <textarea {...articleForm.register('content', { required: true })} className="w-full border p-2" rows={4} />
        </div>
        <div>
          <label className="block mb-1">Category:</label>
          <select {...articleForm.register('category', { required: true })} className="w-full border p-2">
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Image:</label>
          <input 
            type="file" 
            accept="image/*"
            {...articleForm.register('image')} 
            className="w-full border p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Article</button>
      </form>
    </div>
  );
};

export default AddArticlePage;