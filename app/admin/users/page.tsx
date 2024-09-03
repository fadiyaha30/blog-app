
import { getUsersForAdmin } from '@/actions/admin';
import UserManagementTable from '@/components/admin/user-management-table';
import { User } from '@prisma/client'

export default async function AdminUsersPage() {
  const result = await getUsersForAdmin();

  if ('error' in result) {
    return <div>Error: {result.error as string}</div>;
  }

  const users = result as User[];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">User Management</h1>
      <UserManagementTable initialUsers={users} />
    </div>
  );
}