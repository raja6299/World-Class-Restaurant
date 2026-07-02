'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import SupplierDrawer from './SupplierDrawer';
import { deleteSupplierAction } from '@/src/modules/inventory/actions';

import { SupplierDto } from '@/src/modules/inventory/dto';

interface SuppliersClientProps {
  initialData: SupplierDto[];
  branchId: string;
}

export default function SuppliersClient({ initialData, branchId }: SuppliersClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDto | null>(null);

  const filteredData = initialData.filter(sup => 
    sup.name.toLowerCase().includes(search.toLowerCase()) ||
    (sup.contactPerson && sup.contactPerson.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (sup: SupplierDto) => {
    setSelectedSupplier(sup);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedSupplier(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      await deleteSupplierAction(id);
    }
  };

  const columns: ColumnDef<SupplierDto>[] = [
    {
      key: 'name',
      header: 'Supplier Name',
      cell: (sup: SupplierDto) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-aurum-text-heading">{sup.name}</span>
          {sup.isPreferred && <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-aurum-gold-primary/20 text-aurum-gold-earthy">Preferred</span>}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Person',
      cell: (sup: SupplierDto) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{sup.contactPerson || 'N/A'}</span>
          <span className="text-xs text-aurum-text-body/60">{sup.phone}</span>
        </div>
      ),
    },
    {
      key: 'compliance',
      header: 'Compliance',
      cell: (sup: SupplierDto) => (
        <div className="flex flex-col text-xs text-aurum-text-body/60 space-y-0.5">
          <span>GST: {sup.gstin || 'N/A'}</span>
          <span>FSSAI: {sup.fssaiLicense || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (sup: SupplierDto) => (
        sup.isActive ? 
          <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span> :
          <span className="flex items-center gap-1 text-red-600 text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> Inactive</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (sup: SupplierDto) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleEdit(sup)} className="p-1.5 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors rounded hover:bg-aurum-gold-primary/10">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(sup.id)} className="p-1.5 text-aurum-text-body/60 hover:text-red-500 transition-colors rounded hover:bg-red-50">
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
          Add Supplier
        </button>
      </div>
      <DataTable data={filteredData} columns={columns} keyExtractor={(item) => item.id} searchValue={search} onSearch={setSearch} searchPlaceholder="Search suppliers..." />
      <SupplierDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} supplier={selectedSupplier} branchId={branchId} />
    </div>
  );
}
