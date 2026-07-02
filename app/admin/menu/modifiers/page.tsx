import { prisma } from '@/src/lib/prisma';
import ModifiersClient from './ModifiersClient';

export default async function ModifiersPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  // For modifiers, we first need to get the menu items so we can see which modifiers belong to which item.
  // We'll fetch menu items that have modifiers.
  const menuItems = await prisma.menuItem.findMany({
    where: { branchId, deletedAt: null },
    include: {
      modifierGroups: {
        include: { modifiers: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Modifiers & Add-ons</h1>
        <p className="text-aurum-text-body/60 mt-1">Manage add-ons, customization options, and variants for your menu items.</p>
      </div>
      <ModifiersClient menuItems={menuItems as unknown as import('../../../../src/modules/menu/dto').MenuItemDto[]} />
    </div>
  );
}
