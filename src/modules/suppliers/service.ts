import { SupplierRepository } from './repository';

export class SupplierService {
  static async getDashboardData(branchId?: string) {
    const suppliers = await SupplierRepository.findAll(branchId);
    const purchaseOrders = await SupplierRepository.findPurchaseOrders(branchId);
    
    const activeSuppliersCount = suppliers.filter(s => s.isActive).length;
    const pendingPoCount = purchaseOrders.filter(po => ['DRAFT', 'SENT'].includes(po.status)).length;

    return {
      suppliers,
      purchaseOrders,
      metrics: {
        totalSuppliers: suppliers.length,
        activeSuppliersCount,
        pendingPoCount
      }
    };
  }
}
