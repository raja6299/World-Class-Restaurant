import { AnalyticsService } from '@/src/modules/analytics/service';
import { prisma } from '@/src/lib/prisma';
import { Star } from 'lucide-react';

export default async function AdminDashboardPage() {
  const demoBranch = await prisma.branch.findFirst();
  const branchId = demoBranch?.id || undefined;
  const kpis = await AnalyticsService.getExecutiveKPIs(branchId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair text-aurum-gold-primary">Executive Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-aurum-charcoal-secondary p-6 rounded-xl border border-aurum-gold-primary/10">
          <h3 className="text-aurum-cream-secondary text-sm font-medium uppercase tracking-wider">Today&apos;s Revenue</h3>
          <p className="text-3xl font-playfair text-aurum-cream-primary mt-2">
            ₹{kpis.todayRevenue.toLocaleString('en-IN')}
          </p>
          <p className={`text-sm mt-2 ${kpis.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {kpis.revenueChange > 0 ? '+' : ''}{kpis.revenueChange.toFixed(1)}% vs yesterday
          </p>
        </div>
        
        <div className="bg-aurum-charcoal-secondary p-6 rounded-xl border border-aurum-gold-primary/10">
          <h3 className="text-aurum-cream-secondary text-sm font-medium uppercase tracking-wider">Active Tables</h3>
          <p className="text-3xl font-playfair text-aurum-cream-primary mt-2">
            {kpis.activeTables} / {kpis.totalTables}
          </p>
          <p className="text-sm text-aurum-gold-secondary mt-2">
            {kpis.totalTables > 0 ? Math.round((kpis.activeTables / kpis.totalTables) * 100) : 0}% capacity
          </p>
        </div>
        
        <div className="bg-aurum-charcoal-secondary p-6 rounded-xl border border-aurum-gold-primary/10">
          <h3 className="text-aurum-cream-secondary text-sm font-medium uppercase tracking-wider">Kitchen Queue</h3>
          <p className="text-3xl font-playfair text-aurum-cream-primary mt-2">{kpis.pendingOrders}</p>
          <p className="text-sm text-yellow-400 mt-2">Orders pending</p>
        </div>

        <div className="bg-aurum-charcoal-secondary p-6 rounded-xl border border-aurum-gold-primary/10 flex flex-col justify-between">
          <div>
            <h3 className="text-aurum-cream-secondary text-sm font-medium uppercase tracking-wider">Inventory Alerts</h3>
            <p className="text-3xl font-playfair text-aurum-cream-primary mt-2">{kpis.lowInventoryCount}</p>
          </div>
          <p className="text-sm text-red-400 mt-2">Items below threshold</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-aurum-cream-secondary border border-aurum-gold-primary/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-aurum-text-heading mb-4 border-b border-aurum-gold-primary/20 pb-2">Top Performing Staff (Today)</h3>
          {kpis.staffPerformance.length === 0 ? (
            <p className="text-aurum-text-body/60 text-sm">No staff performance data for today.</p>
          ) : (
            <div className="space-y-4">
              {kpis.staffPerformance.map((staff, idx) => (
                <div key={staff.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-aurum-gold-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-aurum-gold-primary/10 flex items-center justify-center text-aurum-gold-primary font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-aurum-text-heading">{(staff as unknown as { user: { name: string } }).user.name}</p>
                      <p className="text-xs text-aurum-text-body/60">Wait Staff</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-aurum-text-heading">{staff.ordersCompleted} orders</p>
                    {staff.rating && (
                      <p className="flex items-center gap-1 text-xs text-aurum-gold-primary justify-end">
                        <Star className="w-3 h-3 fill-current" /> {staff.rating.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
