import { TableService } from '@/src/modules/tables/service';
import { prisma } from '@/src/lib/prisma';
import TablesClient from './TablesClient';

export default async function TablesPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const tables = await TableService.getTables(branchId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Table Management</h1>
        <p className="text-aurum-text-body/60 mt-1">Manage restaurant layout, capacities, and table QR codes.</p>
      </div>
      <TablesClient initialData={tables as unknown as import('@/src/modules/tables/dto').TableDto[]} branchId={branchId} />
    </div>
  );
}
