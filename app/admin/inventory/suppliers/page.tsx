import { InventoryService } from '@/src/modules/inventory/service';
import { prisma } from '@/src/lib/prisma';
import SuppliersClient from './SuppliersClient';

export default async function SuppliersPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const suppliers = await InventoryService.getSuppliers(branchId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Suppliers</h1>
        <p className="text-aurum-text-body/60 mt-1">Manage vendors, compliance details, and contact information.</p>
      </div>
      <SuppliersClient initialData={suppliers} branchId={branchId} />
    </div>
  );
}
