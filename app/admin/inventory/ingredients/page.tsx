import { InventoryService } from '@/src/modules/inventory/service';
import { prisma } from '@/src/lib/prisma';
import IngredientsClient from './IngredientsClient';

export default async function IngredientsPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const ingredients = await InventoryService.getIngredients(branchId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Ingredients & Stock</h1>
        <p className="text-aurum-text-body/60 mt-1">Manage stock levels, thresholds, and reorder quantities.</p>
      </div>
      <IngredientsClient initialData={ingredients} branchId={branchId} />
    </div>
  );
}
