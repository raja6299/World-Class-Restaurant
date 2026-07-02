'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Plus, Edit2, Trash2, Clock, Users, MapPin, Calendar } from 'lucide-react';
import ReservationDrawer from './ReservationDrawer';
import { deleteReservationAction } from '@/src/modules/reservations/actions';
import { ReservationDto } from '@/src/modules/reservations/dto';
import { TableDto } from '@/src/modules/tables/dto';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface StaffMember {
  id: string;
  name: string | null;
  role: string;
}

interface ReservationsClientProps {
  initialData: ReservationDto[];
  tables: TableDto[];
  staff: StaffMember[];
  branchId: string;
}

export default function ReservationsClient({ initialData, tables, staff, branchId }: ReservationsClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<ReservationDto | null>(null);

  const filteredData = initialData.filter(res => 
    res.guestName.toLowerCase().includes(search.toLowerCase()) ||
    res.guestPhone.includes(search)
  );

  const handleEdit = (res: ReservationDto) => {
    setSelectedRes(res);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedRes(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      const res = await deleteReservationAction(id);
      if (res.error) toast.error(res.error);
      else toast.success('Reservation cancelled');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'CHECKED_IN': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800';
      case 'WALK_IN': return 'bg-orange-100 text-orange-800';
      case 'WAIT_LIST': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<ReservationDto>[] = [
    {
      key: 'guestName',
      header: 'Guest',
      cell: (res: ReservationDto) => (
        <div className="flex flex-col">
          <span className="font-medium text-aurum-text-heading">{res.guestName}</span>
          <span className="text-xs text-aurum-text-body/60">{res.guestPhone}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date & Time',
      cell: (res: ReservationDto) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="w-3.5 h-3.5 text-aurum-gold-primary" />
            {format(new Date(res.date), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-aurum-text-body/60 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            {res.time} ({res.expectedDuration}m)
          </div>
        </div>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      cell: (res: ReservationDto) => (
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-aurum-gold-primary" />
            {res.guestCount} Guests
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-aurum-gold-primary" />
            {res.table?.tableNumber ? `Table ${res.table.tableNumber}` : 'Unassigned'}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (res: ReservationDto) => (
        <div className="flex flex-col gap-1 items-start">
          <span className={`px-2 py-1 text-[10px] font-bold rounded-full tracking-wider uppercase ${getStatusColor(res.status)}`}>
            {res.status.replace('_', ' ')}
          </span>
          {res.source === 'ONLINE' && <span className="text-[10px] text-blue-500 font-semibold border border-blue-200 px-1.5 py-0.5 rounded">ONLINE</span>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (res: ReservationDto) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleEdit(res)} className="p-1.5 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors rounded hover:bg-aurum-gold-primary/10">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(res.id)} className="p-1.5 text-aurum-text-body/60 hover:text-red-500 transition-colors rounded hover:bg-red-50">
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
          New Reservation
        </button>
      </div>
      <DataTable data={filteredData} columns={columns} keyExtractor={(item) => item.id} searchValue={search} onSearch={setSearch} searchPlaceholder="Search by guest name or phone..." />
      <ReservationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} reservation={selectedRes} tables={tables} staff={staff} branchId={branchId} />
    </div>
  );
}
