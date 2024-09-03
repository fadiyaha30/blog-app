"use client";

import React, { useState } from 'react';
import { User, UserRole } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { updateUserRole } from '@/actions/admin';
import { toast } from 'sonner';

interface UserManagementTableProps {
  initialUsers: User[];
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);

  const toggleUserRole = async (userId: string, currentRole: UserRole) => {
    const newRole = currentRole === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    const result = await updateUserRole(userId, newRole);
    
    if (result.success) {
      setUsers(users.map(user => 
        user.id === userId ? {...user, role: newRole} : user
      ));
      toast.success(result.success);
    } else {
      toast.error(result.error || 'Failed to update user role');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Role</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{user.id}</td>
              <td className="py-3 px-6 text-left">{user.name}</td>
              <td className="py-3 px-6 text-left">{user.email}</td>
              <td className="py-3 px-6 text-left">{user.role}</td>
              <td className="py-3 px-6 text-center">
                <Button
                  onClick={() => toggleUserRole(user.id, user.role)}
                  className={`${
                    user.role === UserRole.ADMIN 
                      ? 'bg-red-500 hover:bg-red-700' 
                      : 'bg-blue-500 hover:bg-blue-700'
                  } text-white font-bold py-1 px-3 rounded`}
                >
                  {user.role === UserRole.ADMIN ? 'Make User' : 'Make Admin'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;