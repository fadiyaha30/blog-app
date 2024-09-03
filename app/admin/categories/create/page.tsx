'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CategoryInput = {
  name: string;
};

const AddCategoryPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  
  const categoryForm = useForm<CategoryInput>();

  // Protect the route
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // if (!session || session.user.role !== 'ADMIN') {
  //   router.push('/');
  //   return null;
  // }

  const onCategorySubmit: SubmitHandler<CategoryInput> = async (data) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      setMessage('Category added successfully!');
      categoryForm.reset();
    } catch (error) {
      console.error('Error in onCategorySubmit:', error);
      setMessage('An error occurred while adding the category.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/admin" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Admin Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      
      {message && <p className="my-4 text-green-600">{message}</p>}

      <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Category Name:</label>
          <input {...categoryForm.register('name', { required: true })} className="w-full border p-2" />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategoryPage;