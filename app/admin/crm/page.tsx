import { CrmService } from '@/src/modules/crm/service';
import { prisma } from '@/src/lib/prisma';
import CrmClient from './CrmClient';

export default async function CrmPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || '';

  const customers = await CrmService.getCustomers(branchId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Customer Relationship Management</h1>
        <p className="text-aurum-text-body/60 mt-1">View customer profiles, preferences, and lifetime value.</p>
      </div>
      <CrmClient initialData={customers} />
    </div>
  );
}
