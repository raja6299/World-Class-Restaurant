import { prisma } from '@/src/lib/prisma';
import NotificationsClient from './NotificationsClient';

export default async function NotificationsPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const notifications = await prisma.notification.findMany({
    where: { branchId },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Notifications Center</h1>
        <p className="text-aurum-text-body/60 mt-1">Review alerts, updates, and system notifications.</p>
      </div>
      <NotificationsClient initialData={notifications as unknown as import('@/src/modules/notifications/dto').NotificationDto[]} />
    </div>
  );
}
