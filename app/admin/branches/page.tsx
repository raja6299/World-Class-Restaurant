import React from 'react';
import { prisma } from '@/src/lib/prisma';
import { BranchService } from '@/src/modules/branches/service';
import BranchesClient from './BranchesClient';


export default async function BranchesPage() {
  const demoBranch = await prisma.branch.findFirst();
  const restaurantId = demoBranch?.restaurantId || '';

  const branches = await BranchService.getBranches(restaurantId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-aurum-text-heading">Branches</h1>
        <p className="text-aurum-text-body/70 mt-2">Manage your restaurant branches and locations</p>
      </div>
      
      <BranchesClient initialData={branches as unknown as import('@/src/modules/branches/dto').BranchDto[]} restaurantId={restaurantId} />
    </div>
  );
}
