import { MenuService } from '@/src/modules/menu/service';
import { prisma } from '@/src/lib/prisma';
import CategoriesClient from './CategoriesClient';

export default async function CategoriesPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const categories = await MenuService.getCategories(branchId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Category Management</h1>
        <p className="text-aurum-text-body/60 mt-1">Manage your menu categories and their display order.</p>
      </div>
      <CategoriesClient initialData={categories} branchId={branchId} />
    </div>
  );
}
