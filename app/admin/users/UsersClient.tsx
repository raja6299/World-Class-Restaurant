'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import UserDrawer from './UserDrawer';
import { deleteUserAction } from '@/src/modules/users/actions';

import { UserDto } from '@/src/modules/users/dto';

interface UsersClientProps {
  initialData: UserDto[];
}

export default function UsersClient({ initialData }: UsersClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const filteredData = initialData.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (user: UserDto) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member? This cannot be undone.')) {
      await deleteUserAction(id);
    }
  };

  const columns: ColumnDef<UserDto>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (user: UserDto) => (
        <div className="font-medium text-aurum-text-heading">
          {user.name || 'N/A'}
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email / Phone',
      cell: (user: UserDto) => (
        <div className="flex flex-col">
          <span>{user.email || 'N/A'}</span>
          <span className="text-xs text-aurum-text-body/60">{user.phone || 'No phone'}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (user: UserDto) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-aurum-gold-primary/10 text-aurum-gold-earthy border border-aurum-gold-primary/20 uppercase">
          {user.role}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (user: UserDto) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="p-1.5 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors rounded hover:bg-aurum-gold-primary/10"
            title="Edit User"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className="p-1.5 text-aurum-text-body/60 hover:text-red-500 transition-colors rounded hover:bg-red-50"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          {/* Using DataTable's built in search via state */}
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-aurum-gold-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-aurum-gold-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Search staff by name, email or role..."
        emptyStateMessage="No staff members found."
      />

      <UserDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
