// import { db } from '@/lib/db';
// import Link from 'next/link';

// type Category = {
//   id: string;
//   name: string;
// };

// async function getCategories(): Promise<Category[]> {
//   console.log('DB object:', db);
//   console.log('DB category object:', db?.category);
  
//   if (!db || !db.category) {
//     throw new Error('Database or category model is not properly initialized');
//   }

//   try {
//     const categories = await db.category.findMany();
//     console.log('Fetched categories:', categories);
//     return categories;
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     throw new Error(`Failed to fetch categories: ${(error as Error).message}`);
//   }
// }

// export default async function BlogsPage() {
//   let categories: Category[] = [];
//   let error: Error | null = null;

//   try {
//     categories = await getCategories();
//   } catch (e) {
//     error = e as Error;
//     console.error('Error in BlogsPage:', e);
//   }

//   if (error) {
//     return <div>An error occurred: {error.message}</div>;
//   }

//   return (
//     <div className='max-w-4xl mx-auto py-8'>
//       <Link href="/admin" className="text-blue-500 hover:underline mb-4 block">
//         ← Back to Admin Dashboard
//       </Link>
//       <h1 className='text-3xl font-bold mb-4'>All Categories</h1>
//       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
//         {categories.map((category) => (
//           <Link
//             key={category.id}
//             href={`/admin/categories/${category.id}`}
//             className='bg-white p-4 rounded-md shadow-md'
//           >
//             <h2 className='text-xl font-bold'>{category.name}</h2>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );  
// }



// app/admin/categories/page.tsx
import { db } from '@/lib/db';
import Link from 'next/link';
import { DeleteCategoryButton } from '@/components/DeleteCategoryButton';

type Category = {
  id: string;
  name: string;
};

async function getCategories(): Promise<Category[]> {
  console.log('DB object:', db);
  console.log('DB category object:', db?.category);
  
  if (!db || !db.category) {
    throw new Error('Database or category model is not properly initialized');
  }

  try {
    const categories = await db.category.findMany();
    console.log('Fetched categories:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(`Failed to fetch categories: ${(error as Error).message}`);
  }
}

export default async function BlogsPage() {
  let categories: Category[] = [];
  let error: Error | null = null;

  try {
    categories = await getCategories();
  } catch (e) {
    error = e as Error;
    console.error('Error in BlogsPage:', e);
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div className='max-w-4xl mx-auto py-8'>
      <Link href="/admin" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Admin Dashboard
      </Link>
      <h1 className='text-3xl font-bold mb-4'>All Categories</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {categories.map((category) => (
          <div key={category.id} className='bg-white p-4 rounded-md shadow-md flex flex-col'>
            <Link
              href={`/admin/categories/${category.id}`}
              className='flex-grow'
            >
              <h2 className='text-xl font-bold'>{category.name}</h2>
            </Link>
            <DeleteCategoryButton
              categoryId={category.id}
              categoryName={category.name}
            />
          </div>
        ))}
      </div>
    </div>
  );  
}