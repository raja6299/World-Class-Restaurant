import { InventoryService } from '@/src/modules/inventory/service';
import Link from 'next/link';

export default async function AdminInventoryPage() {
  const data = await InventoryService.getDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair text-aurum-gold-primary">Inventory Management</h1>
        <div className="space-x-4">
          <Link href="/admin/suppliers" className="px-4 py-2 bg-aurum-charcoal-secondary text-aurum-cream-primary border border-aurum-gold-primary/30 rounded-lg hover:bg-aurum-gold-primary/20 transition-colors text-sm">
            Suppliers & POs
          </Link>
          <button className="px-4 py-2 bg-aurum-gold-primary text-aurum-charcoal-primary font-medium rounded-lg hover:bg-aurum-gold-secondary transition-colors text-sm">
            + Add Item
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-aurum-charcoal-secondary p-6 rounded-xl border border-aurum-gold-primary/10">
          <h3 className="text-aurum-cream-secondary text-sm font-medium uppercase tracking-wider">Total Items</h3>
          <p className="text-3xl font-playfair text-aurum-cream-primary mt-2">{data.metrics.totalItems}</p>
        </div>
        
        <div className="bg-aurum-charcoal-secondary p-6 rounded-xl border border-red-500/30 bg-gradient-to-br from-aurum-charcoal-secondary to-red-900/20">
          <h3 className="text-aurum-cream-secondary text-sm font-medium uppercase tracking-wider text-red-200">Low Stock Alerts</h3>
          <p className="text-3xl font-playfair text-red-400 mt-2">{data.metrics.lowStockCount}</p>
        </div>
        
        <div className="bg-aurum-charcoal-secondary p-6 rounded-xl border border-aurum-gold-primary/10">
          <h3 className="text-aurum-cream-secondary text-sm font-medium uppercase tracking-wider">Est. Value</h3>
          <p className="text-3xl font-playfair text-aurum-cream-primary mt-2">
            ₹{data.metrics.totalValue.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="bg-aurum-charcoal-secondary rounded-xl border border-aurum-gold-primary/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-aurum-charcoal-primary/50 text-aurum-gold-secondary text-xs uppercase tracking-wider border-b border-aurum-gold-primary/20">
              <th className="p-4 font-medium">Item Name</th>
              <th className="p-4 font-medium">Stock Level</th>
              <th className="p-4 font-medium">Reorder Level</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aurum-gold-primary/10">
            {data.allItems.map((item) => {
              const isLowStock = item.currentQuantity <= item.minimumThreshold;
              return (
                <tr key={item.id} className="hover:bg-aurum-gold-primary/5 transition-colors">
                  <td className="p-4">
                    <p className="text-aurum-cream-primary font-medium">{item.name}</p>
                    {item.batchNumber && <p className="text-xs text-aurum-cream-secondary">Batch: {item.batchNumber}</p>}
                  </td>
                  <td className="p-4">
                    <span className={`text-lg ${isLowStock ? 'text-red-400 font-bold' : 'text-aurum-cream-primary'}`}>
                      {item.currentQuantity}
                    </span>
                    <span className="text-sm text-aurum-cream-secondary ml-1">{item.unit}</span>
                  </td>
                  <td className="p-4 text-aurum-cream-secondary">
                    {item.reorderLevel} {item.unit}
                  </td>
                  <td className="p-4">
                    {isLowStock ? (
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30 uppercase">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded border border-green-500/30 uppercase">
                        Healthy
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-aurum-gold-secondary hover:text-aurum-gold-primary text-sm mr-4">Edit</button>
                    <button className="text-aurum-cream-secondary hover:text-red-400 text-sm">Log Waste</button>
                  </td>
                </tr>
              );
            })}
            
            {data.allItems.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-aurum-cream-secondary">
                  No inventory items found. Add your first ingredient to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
