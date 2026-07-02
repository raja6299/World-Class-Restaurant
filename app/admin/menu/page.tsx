import { MenuRepository } from '@/src/modules/menu/repository';

import { prisma } from '@/src/lib/prisma';

export default async function AdminMenuPage() {
  const branch = await prisma.branch.findFirst();
  const menuItems = branch ? await MenuRepository.getMenuItems(branch.id) : [];

  // Group by category for easier display
  const groupedItems = menuItems.reduce((acc, item) => {
    const catName = item.category?.name || 'Uncategorized';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair text-aurum-gold-primary">Menu & Modifiers</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-aurum-gold-primary text-aurum-charcoal-primary font-medium rounded-lg hover:bg-aurum-gold-secondary transition-colors text-sm">
            + New Category
          </button>
          <button className="px-4 py-2 bg-aurum-gold-primary text-aurum-charcoal-primary font-medium rounded-lg hover:bg-aurum-gold-secondary transition-colors text-sm">
            + New Item
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedItems).map(([categoryName, items]) => (
          <div key={categoryName} className="bg-aurum-charcoal-secondary rounded-xl border border-aurum-gold-primary/20 overflow-hidden">
            <div className="p-4 border-b border-aurum-gold-primary/20 bg-aurum-charcoal-primary/50 flex justify-between items-center">
              <h2 className="text-xl font-playfair text-aurum-cream-primary">{categoryName}</h2>
              <span className="text-sm text-aurum-cream-secondary">{items.length} items</span>
            </div>
            
            <div className="divide-y divide-aurum-gold-primary/10">
              {items.map((item) => (
                <div key={item.id} className="p-6 hover:bg-aurum-gold-primary/5 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-aurum-cream-primary flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.isVeg && <span className="w-3 h-3 rounded-full bg-green-500 inline-block ml-2" title="Veg"></span>}
                        {item.isNonVeg && <span className="w-3 h-3 rounded-full bg-red-500 inline-block ml-2" title="Non-Veg"></span>}
                        {item.isJain && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1 rounded ml-1 border border-yellow-500/30">Jain</span>}
                        {item.isSwaminarayan && <span className="text-xs bg-orange-500/20 text-orange-300 px-1 rounded ml-1 border border-orange-500/30">Swaminarayan</span>}
                        {item.isHalal && <span className="text-xs bg-green-500/20 text-green-300 px-1 rounded ml-1 border border-green-500/30">Halal</span>}
                        {item.isEgg && <span className="text-xs bg-yellow-100/20 text-yellow-100 px-1 rounded ml-1 border border-yellow-100/30">Egg</span>}
                      </h3>
                      <p className="text-sm text-aurum-cream-secondary mt-1 max-w-xl">{item.description}</p>
                      
                      {item.modifierGroups && item.modifierGroups.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs text-aurum-gold-secondary uppercase tracking-wider font-semibold">Modifiers:</p>
                          {item.modifierGroups.map((mg) => (
                            <div key={mg.id} className="text-sm text-aurum-cream-primary bg-aurum-charcoal-primary/30 p-2 rounded border border-aurum-gold-primary/10">
                              <span className="font-medium">{mg.name}</span>
                              <span className="text-aurum-cream-secondary ml-2">
                                (Select {mg.minSelect} - {mg.maxSelect})
                              </span>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {mg.modifiers.map((m) => (
                                  <span key={m.id} className="text-xs bg-aurum-gold-primary/10 px-2 py-1 rounded text-aurum-cream-secondary border border-aurum-gold-primary/20">
                                    {m.name} {m.extraPrice > 0 ? `(+₹${m.extraPrice})` : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <div className="text-2xl font-playfair text-aurum-gold-primary">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                      <div className="mt-4 space-x-3">
                        <button className="text-aurum-cream-secondary hover:text-aurum-gold-primary text-sm transition-colors">Edit Item</button>
                        <button className="text-aurum-cream-secondary hover:text-aurum-gold-primary text-sm transition-colors">+ Add Modifier</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(groupedItems).length === 0 && (
          <div className="p-8 text-center text-aurum-cream-secondary border border-aurum-gold-primary/20 rounded-xl">
            No menu items found.
          </div>
        )}
      </div>
    </div>
  );
}
