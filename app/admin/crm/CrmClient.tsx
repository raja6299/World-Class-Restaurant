'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Eye, Upload } from 'lucide-react';
import CustomerDrawer from './CustomerDrawer';
import { CustomerProfileDto } from '@/src/modules/crm/dto';
import { format } from 'date-fns';
import { ImportDrawer } from '@/components/shared/ImportDrawer';
import { importCustomersAction } from '@/src/modules/crm/actions';

interface CrmClientProps {
  initialData: CustomerProfileDto[];
}

export default function CrmClient({ initialData }: CrmClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfileDto | null>(null);

  const filteredData = initialData.filter(user => 
    (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
    (user.phone && user.phone.includes(search))
  );

  const handleView = (user: CustomerProfileDto) => {
    setSelectedCustomer(user);
    setDrawerOpen(true);
  };

  const getSegmentColor = (segment?: string) => {
    switch(segment) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'LOYAL': return 'bg-blue-100 text-blue-800';
      case 'REGULAR': return 'bg-green-100 text-green-800';
      case 'NEW': return 'bg-orange-100 text-orange-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<CustomerProfileDto>[] = [
    {
      key: 'name',
      header: 'Customer Name',
      cell: (user: CustomerProfileDto) => (
        <div className="flex flex-col">
          <span className="font-medium text-aurum-text-heading">{user.name || 'Anonymous'}</span>
          <span className="text-xs text-aurum-text-body/60 mt-0.5">{user.phone || 'No Phone'}</span>
        </div>
      ),
    },
    {
      key: 'segment',
      header: 'Segment',
      cell: (user: CustomerProfileDto) => (
        <span className={`px-2 py-1 text-[10px] font-bold rounded-full tracking-wider uppercase ${getSegmentColor(user.segment)}`}>
          {user.segment || 'NEW'}
        </span>
      ),
    },
    {
      key: 'visits',
      header: 'Visits',
      align: 'right',
      cell: (user: CustomerProfileDto) => (
        <div className="flex flex-col items-end">
          <span className="font-medium">{user.profile?.totalVisits || 0}</span>
          {user.profile?.lastVisit && <span className="text-[10px] text-aurum-text-body/60 mt-0.5">Last: {format(new Date(user.profile.lastVisit), 'MMM d, yyyy')}</span>}
        </div>
      ),
    },
    {
      key: 'ltv',
      header: 'Lifetime Value',
      align: 'right',
      cell: (user: CustomerProfileDto) => (
        <span className="font-medium text-aurum-gold-primary">₹{(user.profile?.lifetimeValue || 0).toFixed(2)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Profile',
      align: 'right',
      cell: (user: CustomerProfileDto) => (
        <button onClick={() => handleView(user)} className="p-1.5 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors rounded hover:bg-aurum-gold-primary/10">
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md"></div>
        <button 
          onClick={() => setImportOpen(true)}
          className="flex items-center gap-2 bg-white text-aurum-text-heading border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>
      </div>
      <DataTable 
        data={filteredData} 
        columns={columns} 
        keyExtractor={(item) => item.id} 
        searchValue={search} 
        onSearch={setSearch} 
        searchPlaceholder="Search by name or phone..."
        exportData={filteredData.map(c => ({
          Name: c.name,
          Phone: c.phone,
          Email: c.email,
          Segment: c.segment,
          Visits: c.profile?.totalVisits || 0,
          LifetimeValue: c.profile?.lifetimeValue || 0,
        }))}
        exportFilename="customers_export"
      />
      <CustomerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} customer={selectedCustomer} />
      
      <ImportDrawer
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import Customers"
        expectedColumns={['name', 'phone', 'email']}
        onImport={async (data) => {
          // A mock or actual import logic would go here.
          // Since we need it to work perfectly without placeholders, we would need a server action for this.
          // For now, let's toast a message since creating user credentials for each row isn't straightforward in CRM import without passwords.
          // Let's call a server action `importCustomersAction` (we need to create this in crm/actions.ts).
          await importCustomersAction(data);
        }}
      />
    </div>
  );
}
