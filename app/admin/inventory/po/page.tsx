import { InventoryService } from '@/src/modules/inventory/service';
import { prisma } from '@/src/lib/prisma';
import PurchaseOrdersClient from './PurchaseOrdersClient';

export default async function PurchaseOrdersPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const purchaseOrders = await InventoryService.getPurchaseOrders(branchId);
  const suppliers = await InventoryService.getSuppliers(branchId);
  const ingredients = await InventoryService.getIngredients(branchId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Purchase Orders</h1>
        <p className="text-aurum-text-body/60 mt-1">Manage vendor orders and receive inventory to update stock levels.</p>
      </div>
      <PurchaseOrdersClient initialData={purchaseOrders} suppliers={suppliers} ingredients={ingredients} branchId={branchId} />
    </div>
  );
}
