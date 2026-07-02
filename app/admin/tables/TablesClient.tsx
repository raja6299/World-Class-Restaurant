'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Plus, Edit2, Trash2, QrCode } from 'lucide-react';
import TableDrawer from './TableDrawer';
import { deleteTableAction } from '@/src/modules/tables/actions';

import { TableDto } from '@/src/modules/tables/dto';

interface TablesClientProps {
  initialData: TableDto[];
  branchId: string;
}

export default function TablesClient({ initialData, branchId }: TablesClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableDto | null>(null);

  const filteredData = initialData.filter(table => 
    table.tableNumber.toLowerCase().includes(search.toLowerCase()) ||
    (table.floor && table.floor.toLowerCase().includes(search.toLowerCase())) ||
    (table.zone && table.zone.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (table: TableDto) => {
    setSelectedTable(table);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedTable(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this table?')) {
      await deleteTableAction(id);
    }
  };

  const downloadQR = (url: string | null | undefined, tableNumber: string) => {
    if (!url) return;
    alert(`In production, this will download a beautiful QR Code for Table ${tableNumber} pointing to ${url}`);
  };

  const columns: ColumnDef<TableDto>[] = [
    {
      key: 'tableNumber',
      header: 'Table Number',
      cell: (table: TableDto) => (
        <div className="font-medium text-aurum-text-heading flex items-center gap-2">
          {table.tableNumber}
          {table.isVip && <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-aurum-gold-primary text-aurum-charcoal-primary">VIP</span>}
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity',
      cell: (table: TableDto) => `${table.capacity} guests`,
    },
    {
      key: 'location',
      header: 'Location',
      cell: (table: TableDto) => (
        <div className="flex flex-col">
          <span>{table.isIndoor ? 'Indoor' : 'Outdoor'}</span>
          <span className="text-xs text-aurum-text-body/60">
            {table.floor ? `${table.floor} ` : ''}{table.zone ? `(${table.zone})` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'qr',
      header: 'QR Code',
      cell: (table: TableDto) => (
        <button 
          onClick={() => downloadQR(table.qrCodeUrl, table.tableNumber)}
          className="flex items-center gap-1.5 text-xs font-medium text-aurum-gold-primary hover:text-aurum-gold-secondary transition-colors"
        >
          <QrCode className="w-4 h-4" />
          Download
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (table: TableDto) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleEdit(table)} className="p-1.5 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors rounded hover:bg-aurum-gold-primary/10">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(table.id)} className="p-1.5 text-aurum-text-body/60 hover:text-red-500 transition-colors rounded hover:bg-red-50">
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
          Add Table
        </button>
      </div>
      <DataTable data={filteredData} columns={columns} keyExtractor={(item) => item.id} searchValue={search} onSearch={setSearch} searchPlaceholder="Search tables by number, floor, or zone..." />
      <TableDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} table={selectedTable} branchId={branchId} />
    </div>
  );
}
