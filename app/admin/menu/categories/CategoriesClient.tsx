'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import CategoryDrawer from './CategoryDrawer';
import { deleteCategoryAction } from '@/src/modules/menu/actions';

import { CategoryDto } from '@/src/modules/menu/dto';

interface CategoriesClientProps {
  initialData: CategoryDto[];
  branchId: string;
}

export default function CategoriesClient({ initialData, branchId }: CategoriesClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);

  const filteredData = initialData.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (cat: CategoryDto) => {
    setSelectedCategory(cat);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? All associated items will lose this category.')) {
      await deleteCategoryAction(id);
    }
  };

  const columns: ColumnDef<CategoryDto>[] = [
    {
      key: 'name',
      header: 'Category Name',
      cell: (cat) => <span className="font-medium text-aurum-text-heading">{cat.name}</span>,
    },
    {
      key: 'sortOrder',
      header: 'Sort Order',
      cell: (cat) => cat.sortOrder,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (cat) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleEdit(cat)} className="p-1.5 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors rounded hover:bg-aurum-gold-primary/10">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-aurum-text-body/60 hover:text-red-500 transition-colors rounded hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md"></div>
        <button onClick={handleCreate} className="flex items-center gap-2 bg-aurum-gold-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-aurum-gold-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>
      <DataTable data={filteredData} columns={columns} keyExtractor={(item) => item.id} searchValue={search} onSearch={setSearch} searchPlaceholder="Search categories..." />
      <CategoryDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} category={selectedCategory} branchId={branchId} />
    </div>
  );
}
