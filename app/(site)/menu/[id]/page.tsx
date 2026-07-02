import { prisma } from '@/src/lib/prisma';
import { cookies } from 'next/headers';
import ClientMenuDetail from './ClientMenuDetail';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!item) {
    notFound();
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get('dining_session_id')?.value || null;

  return <ClientMenuDetail item={item} sessionId={sessionId} />;
}
