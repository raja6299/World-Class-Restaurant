'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import IngredientDrawer from './IngredientDrawer';
import { deleteIngredientAction } from '@/src/modules/inventory/actions';

import { IngredientDto } from '@/src/modules/inventory/dto';

interface IngredientsClientProps {
  initialData: IngredientDto[];
  branchId: string;
}

export default function IngredientsClient({ initialData, branchId }: IngredientsClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientDto | null>(null);

  const filteredData = initialData.filter(ing => 
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (ing: IngredientDto) => {
    setSelectedIngredient(ing);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedIngredient(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this ingredient? It may be linked to recipes.')) {
      await deleteIngredientAction(id);
    }
  };

  const columns: ColumnDef<IngredientDto>[] = [
    {
      key: 'name',
      header: 'Ingredient Name',
      cell: (ing: IngredientDto) => <span className="font-medium text-aurum-text-heading">{ing.name}</span>,
    },
    {
      key: 'stock',
      header: 'Current Stock',
      cell: (ing: IngredientDto) => (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${ing.currentQuantity <= ing.minimumThreshold ? 'text-red-600' : 'text-aurum-text-heading'}`}>
            {ing.currentQuantity.toFixed(2)} {ing.unit}
          </span>
          {ing.currentQuantity <= ing.minimumThreshold && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
        </div>
      ),
    },
    {
      key: 'thresholds',
      header: 'Reorder Levels',
      cell: (ing: IngredientDto) => (
        <div className="flex flex-col text-xs text-aurum-text-body/60">
          <span>Min: {ing.minimumThreshold} {ing.unit}</span>
          <span>Reorder at: {ing.reorderLevel} {ing.unit}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (ing: IngredientDto) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleEdit(ing)} className="p-1.5 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors rounded hover:bg-aurum-gold-primary/10">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(ing.id)} className="p-1.5 text-aurum-text-body/60 hover:text-red-500 transition-colors rounded hover:bg-red-50">
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
          Add Ingredient
        </button>
      </div>
      <DataTable data={filteredData} columns={columns} keyExtractor={(item) => item.id} searchValue={search} onSearch={setSearch} searchPlaceholder="Search ingredients..." />
      <IngredientDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} ingredient={selectedIngredient} branchId={branchId} />
    </div>
  );
}
