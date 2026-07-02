'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Plus, CheckCircle, Package } from 'lucide-react';
import PurchaseOrderDrawer from './PurchaseOrderDrawer';
import { updatePurchaseOrderStatusAction } from '@/src/modules/inventory/actions';
import { format } from 'date-fns';
import { SupplierDto, IngredientDto, PurchaseOrderDto } from '@/src/modules/inventory/dto';

interface PurchaseOrdersClientProps {
  initialData: PurchaseOrderDto[];
  suppliers: SupplierDto[];
  ingredients: IngredientDto[];
  branchId: string;
}

export default function PurchaseOrdersClient({ initialData, suppliers, ingredients, branchId }: PurchaseOrdersClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredData = initialData.filter(po => 
    po.id.toLowerCase().includes(search.toLowerCase()) ||
    po.supplier?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setDrawerOpen(true);
  };

  const handleMarkReceived = async (id: string) => {
    if (confirm('Mark this PO as received? This will automatically update your ingredient stock levels.')) {
      await updatePurchaseOrderStatusAction(id, 'RECEIVED');
    }
  };

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
    SENT: 'bg-blue-100 text-blue-800 border-blue-200',
    APPROVED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    RECEIVED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  };

  const columns: ColumnDef<PurchaseOrderDto>[] = [
    {
      key: 'poNumber',
      header: 'Date / ID',
      cell: (po: PurchaseOrderDto) => (
        <div className="flex flex-col">
          <span className="font-medium text-aurum-text-heading">{format(new Date(po.createdAt), 'MMM d, yyyy')}</span>
          <span className="text-xs text-aurum-text-body/60 font-mono" title={po.id}>{po.id.slice(0, 8).toUpperCase()}</span>
        </div>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      cell: (po: PurchaseOrderDto) => <span className="font-medium">{po.supplier?.name || '-'}</span>,
    },
    {
      key: 'items',
      header: 'Items',
      cell: (po: PurchaseOrderDto) => <span className="text-sm">{po.items.length} items</span>,
    },
    {
      key: 'total',
      header: 'Total Amount',
      align: 'right',
      cell: (po: PurchaseOrderDto) => <span className="font-medium">₹{po.totalAmount.toFixed(2)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (po: PurchaseOrderDto) => (
        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border ${statusColors[po.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
          {po.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (po: PurchaseOrderDto) => (
        <div className="flex items-center justify-end gap-2">
          {po.status !== 'RECEIVED' && po.status !== 'CANCELLED' && (
            <button 
              onClick={() => handleMarkReceived(po.id)} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              Receive
            </button>
          )}
          {po.status === 'RECEIVED' && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 px-3 py-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Stock Updated
            </span>
          )}
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
          Create PO
        </button>
      </div>
      <DataTable data={filteredData} columns={columns} keyExtractor={(item) => item.id} searchValue={search} onSearch={setSearch} searchPlaceholder="Search by supplier name..." />
      <PurchaseOrderDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} suppliers={suppliers} ingredients={ingredients} branchId={branchId} />
    </div>
  );
}
