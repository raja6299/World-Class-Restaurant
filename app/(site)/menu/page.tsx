import { MenuService } from '@/src/modules/menu/service';
import { prisma } from '@/src/lib/prisma';
import ClientMenu from './ClientMenu';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function MenuPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const categories = await MenuService.getCategories(branchId);
  const menuItems = await MenuService.getMenuItems(branchId);
  
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('dining_session_id')?.value || null;

  return <ClientMenu categories={categories} menuItems={menuItems} sessionId={sessionId} />;
}

