import { ReservationService } from '@/src/modules/reservations/service';
import { TableService } from '@/src/modules/tables/service';
import { prisma } from '@/src/lib/prisma';
import ReservationsClient from './ReservationsClient';


export default async function ReservationsPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const reservations = await ReservationService.getReservations(branchId);
  const tables = await TableService.getTables(branchId);
  
  const staff = await prisma.user.findMany({
    where: { restaurantId: demoBranch?.restaurantId || '', role: { not: 'CUSTOMER' } },
    select: { id: true, name: true, role: true }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Reservations</h1>
        <p className="text-aurum-text-body/60 mt-1">Manage table bookings, waitlists, and guest occasions.</p>
      </div>
      <ReservationsClient 
        initialData={reservations as unknown as import('@/src/modules/reservations/dto').ReservationDto[]} 
        tables={tables as unknown as import('@/src/modules/tables/dto').TableDto[]} 
        staff={staff}
        branchId={branchId} 
      />
    </div>
  );
}
