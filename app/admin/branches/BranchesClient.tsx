'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Plus, Edit2, Trash2, MapPin, Phone } from 'lucide-react';
import BranchDrawer from './BranchDrawer';
import { deleteBranchAction } from '@/src/modules/branches/actions';
import { BranchDto } from '@/src/modules/branches/dto';
import { toast } from 'react-hot-toast';

interface BranchesClientProps {
  initialData: BranchDto[];
  restaurantId: string;
}

export default function BranchesClient({ initialData, restaurantId }: BranchesClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchDto | null>(null);

  const filteredData = initialData.filter(branch => 
    branch.name.toLowerCase().includes(search.toLowerCase()) ||
    (branch.location && branch.location.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (branch: BranchDto) => {
    setSelectedBranch(branch);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedBranch(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error('Cannot delete the default branch. Set another branch as default first.');
      return;
    }
    if (confirm('Are you sure you want to deactivate this branch?')) {
      await deleteBranchAction(id);
      toast.success('Branch deactivated');
    }
  };

  const columns: ColumnDef<BranchDto>[] = [
    {
      key: 'name',
      header: 'Branch Name',
      cell: (branch: BranchDto) => (
        <div className="font-medium text-aurum-text-heading flex items-center gap-2">
          {branch.name}
          {branch.isDefault && <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-aurum-gold-primary text-aurum-charcoal-primary">Default</span>}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      cell: (branch: BranchDto) => (
        <div className="flex items-center gap-1.5 text-aurum-text-body/80">
          <MapPin className="w-4 h-4 text-aurum-gold-primary" />
          {branch.location || 'N/A'}
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (branch: BranchDto) => (
        <div className="flex items-center gap-1.5 text-aurum-text-body/80">
          <Phone className="w-4 h-4 text-aurum-gold-primary" />
          {branch.phone || 'N/A'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (branch: BranchDto) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          branch.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          branch.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {branch.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (branch: BranchDto) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleEdit(branch)} className="p-1.5 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors rounded hover:bg-aurum-gold-primary/10">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(branch.id, branch.isDefault)} className="p-1.5 text-aurum-text-body/60 hover:text-red-500 transition-colors rounded hover:bg-red-50">
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
          Add Branch
        </button>
      </div>
      <DataTable data={filteredData} columns={columns} keyExtractor={(item) => item.id} searchValue={search} onSearch={setSearch} searchPlaceholder="Search branches by name or location..." />
      <BranchDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} branch={selectedBranch} restaurantId={restaurantId} />
    </div>
  );
}
