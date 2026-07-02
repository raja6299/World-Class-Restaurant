import { MenuService } from '@/src/modules/menu/service';
import { prisma } from '@/src/lib/prisma';
import MenuItemsClient from './MenuItemsClient';

export default async function MenuItemsPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const menuItems = await MenuService.getMenuItems(branchId);
  const categories = await MenuService.getCategories(branchId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Menu Management</h1>
        <p className="text-aurum-text-body/60 mt-1">Manage dishes, prices, availability, and dietary flags.</p>
      </div>
      <MenuItemsClient initialData={menuItems} categories={categories} branchId={branchId} />
    </div>
  );
}
