'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import MenuItemDrawer from './MenuItemDrawer';
import { deleteMenuItemAction } from '@/src/modules/menu/actions';
import Image from 'next/image';

import { MenuItemDto, CategoryDto } from '@/src/modules/menu/dto';

interface MenuItemsClientProps {
  initialData: MenuItemDto[];
  categories: CategoryDto[];
  branchId: string;
}

export default function MenuItemsClient({ initialData, categories, branchId }: MenuItemsClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemDto | null>(null);

  const filteredData = initialData.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.category?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item: MenuItemDto) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      await deleteMenuItemAction(id);
    }
  };

  const columns: ColumnDef<MenuItemDto>[] = [
    {
      key: 'image',
      header: '',
      width: '60px',
      cell: (item) => (
        item.imageUrl ? (
          <div className="w-10 h-10 rounded overflow-hidden relative border border-aurum-gold-primary/20 bg-aurum-cream-secondary">
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded border border-aurum-gold-primary/20 bg-aurum-cream-secondary flex items-center justify-center">
            <span className="text-xs text-aurum-text-body/40">No Img</span>
          </div>
        )
      ),
    },
    {
      key: 'name',
      header: 'Dish Name',
      cell: (item) => (
        <div>
          <div className="font-medium text-aurum-text-heading flex items-center gap-2">
            {item.name}
            {item.isVeg && <span className="w-2 h-2 rounded-full bg-green-500" title="Vegetarian"></span>}
            {item.isNonVeg && <span className="w-2 h-2 rounded-full bg-red-500" title="Non-Vegetarian"></span>}
          </div>
          <div className="text-xs text-aurum-text-body/60 mt-0.5 max-w-[200px] truncate">{item.description}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (item) => <span className="text-sm">{item.category?.name || 'Uncategorized'}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      cell: (item) => <span className="font-medium text-aurum-text-heading">₹{item.price.toFixed(2)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.isAvailable ? 'Available' : 'Out of Stock'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleEdit(item)} className="p-1.5 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors rounded hover:bg-aurum-gold-primary/10">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-aurum-text-body/60 hover:text-red-500 transition-colors rounded hover:bg-red-50">
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
          Add Menu Item
        </button>
      </div>
      <DataTable data={filteredData} columns={columns} keyExtractor={(item) => item.id} searchValue={search} onSearch={setSearch} searchPlaceholder="Search menu items..." />
      <MenuItemDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} item={selectedItem} categories={categories} branchId={branchId} />
    </div>
  );
}
