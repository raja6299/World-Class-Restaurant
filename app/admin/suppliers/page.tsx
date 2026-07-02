import { SupplierService } from '@/src/modules/suppliers/service';
import Link from 'next/link';

export default async function AdminSuppliersPage() {
  const data = await SupplierService.getDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair text-aurum-gold-primary">Suppliers & Purchase Orders</h1>
        <div className="space-x-4">
          <Link href="/admin/inventory" className="px-4 py-2 bg-aurum-charcoal-secondary text-aurum-cream-primary border border-aurum-gold-primary/30 rounded-lg hover:bg-aurum-gold-primary/20 transition-colors text-sm">
            Back to Inventory
          </Link>
          <button className="px-4 py-2 bg-aurum-gold-primary text-aurum-charcoal-primary font-medium rounded-lg hover:bg-aurum-gold-secondary transition-colors text-sm">
            + New Supplier
          </button>
          <button className="px-4 py-2 bg-aurum-gold-primary text-aurum-charcoal-primary font-medium rounded-lg hover:bg-aurum-gold-secondary transition-colors text-sm">
            + Create PO
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-aurum-charcoal-secondary p-6 rounded-xl border border-aurum-gold-primary/10">
          <h3 className="text-aurum-cream-secondary text-sm font-medium uppercase tracking-wider">Total Suppliers</h3>
          <p className="text-3xl font-playfair text-aurum-cream-primary mt-2">{data.metrics.totalSuppliers}</p>
          <p className="text-sm text-green-400 mt-2">{data.metrics.activeSuppliersCount} Active</p>
        </div>
        
        <div className="bg-aurum-charcoal-secondary p-6 rounded-xl border border-aurum-gold-primary/10">
          <h3 className="text-aurum-cream-secondary text-sm font-medium uppercase tracking-wider">Pending POs</h3>
          <p className="text-3xl font-playfair text-aurum-cream-primary mt-2">{data.metrics.pendingPoCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Suppliers List */}
        <div className="bg-aurum-charcoal-secondary rounded-xl border border-aurum-gold-primary/20 overflow-hidden">
          <div className="p-4 border-b border-aurum-gold-primary/20 bg-aurum-charcoal-primary/50">
            <h2 className="text-lg font-inter text-aurum-cream-primary">Supplier Directory</h2>
          </div>
          <div className="divide-y divide-aurum-gold-primary/10">
            {data.suppliers.map((supplier) => (
              <div key={supplier.id} className="p-4 hover:bg-aurum-gold-primary/5 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-aurum-cream-primary font-medium">{supplier.name}</h3>
                    <p className="text-sm text-aurum-cream-secondary mt-1">Contact: {supplier.contactPerson} ({supplier.phone})</p>
                    {supplier.gstin && <p className="text-xs text-aurum-gold-secondary mt-1">GSTIN: {supplier.gstin}</p>}
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded border uppercase ${
                      supplier.isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}>
                      {supplier.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {data.suppliers.length === 0 && (
              <div className="p-8 text-center text-aurum-cream-secondary">
                No suppliers found. Add your first supplier to begin creating Purchase Orders.
              </div>
            )}
          </div>
        </div>

        {/* Purchase Orders List */}
        <div className="bg-aurum-charcoal-secondary rounded-xl border border-aurum-gold-primary/20 overflow-hidden">
          <div className="p-4 border-b border-aurum-gold-primary/20 bg-aurum-charcoal-primary/50">
            <h2 className="text-lg font-inter text-aurum-cream-primary">Recent Purchase Orders</h2>
          </div>
          <div className="divide-y divide-aurum-gold-primary/10">
            {data.purchaseOrders.map((po: { id: string; supplier: { name: string }; items: unknown[]; totalAmount: number; createdAt: Date | string; status: string }) => (
              <div key={po.id} className="p-4 hover:bg-aurum-gold-primary/5 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-aurum-cream-primary font-medium">PO to: {po.supplier.name}</h3>
                    <p className="text-sm text-aurum-cream-secondary mt-1">
                      {po.items.length} items • ₹{po.totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-aurum-gold-secondary mt-1">
                      Created: {new Date(po.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="px-2 py-1 bg-aurum-gold-primary/20 text-aurum-gold-primary text-xs rounded border border-aurum-gold-primary/30 uppercase">
                      {po.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {data.purchaseOrders.length === 0 && (
              <div className="p-8 text-center text-aurum-cream-secondary">
                No purchase orders found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
