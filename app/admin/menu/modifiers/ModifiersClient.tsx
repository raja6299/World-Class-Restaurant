'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import ModifierDrawer from './ModifierDrawer';
import { deleteModifierGroupAction } from '@/src/modules/menu/actions';
import { MenuItemDto, ModifierGroupDto, ModifierDto } from '@/src/modules/menu/dto';

interface ModifiersClientProps {
  menuItems: MenuItemDto[];
}

export default function ModifiersClient({ menuItems }: ModifiersClientProps) {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ModifierGroupDto | null>(null);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(null);
  
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.modifierGroups.some((g: ModifierGroupDto) => g.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (group: ModifierGroupDto, menuItemId: string) => {
    setSelectedMenuItemId(menuItemId);
    setSelectedGroup(group);
    setDrawerOpen(true);
  };

  const handleCreate = (menuItemId: string) => {
    setSelectedMenuItemId(menuItemId);
    setSelectedGroup(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this modifier group?')) {
      const result = await deleteModifierGroupAction(id);
      if (result?.error) {
        alert(result.error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
           <input 
            type="text"
            placeholder="Search menu items or modifiers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-aurum-cream-secondary border border-aurum-gold-primary/20 rounded-lg text-aurum-text-body focus:outline-none focus:border-aurum-gold-primary transition-colors text-sm"
          />
        </div>
      </div>

      <div className="bg-aurum-cream-primary rounded-xl border border-aurum-gold-primary/20 shadow-aurum-sm overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-aurum-text-body/60 text-sm">No menu items found matching &quot;{search}&quot;.</div>
        ) : (
          <div className="divide-y divide-aurum-gold-primary/10">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white">
                <div 
                  className="px-6 py-4 flex items-center justify-between hover:bg-aurum-cream-secondary transition-colors cursor-pointer"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-center gap-3">
                    {expandedItems[item.id] ? <ChevronDown className="w-5 h-5 text-aurum-gold-primary" /> : <ChevronRight className="w-5 h-5 text-aurum-text-body/40" />}
                    <h3 className="font-medium text-aurum-text-heading">{item.name}</h3>
                    <span className="text-xs bg-aurum-gold-primary/10 text-aurum-gold-earthy px-2 py-0.5 rounded-full border border-aurum-gold-primary/20">
                      {item.modifierGroups.length} Groups
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCreate(item.id); }}
                    className="flex items-center gap-1.5 text-xs font-medium text-aurum-gold-primary hover:text-aurum-gold-secondary transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Group
                  </button>
                </div>

                {expandedItems[item.id] && (
                  <div className="px-6 pb-4 bg-aurum-cream-secondary/50 border-t border-aurum-gold-primary/5">
                    {item.modifierGroups.length === 0 ? (
                      <p className="text-sm text-aurum-text-body/50 py-4 pl-8">No modifier groups configured for this item.</p>
                    ) : (
                      <div className="pl-8 pt-4 space-y-4">
                        {item.modifierGroups.map((group: ModifierGroupDto) => (
                          <div key={group.id} className="bg-white border border-aurum-gold-primary/10 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium text-aurum-text-heading text-sm">{group.name}</h4>
                                <span className="text-xs bg-aurum-gold-primary/10 text-aurum-gold-primary px-2 py-1 rounded">Required</span>
                                <span className="text-sm text-aurum-text-body/60 ml-2">
                                  {group.minSelect} - {group.maxSelect} selections
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEdit(group, item.id)} className="p-1 text-aurum-text-body/60 hover:text-aurum-gold-primary transition-colors">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(group.id)} className="p-1 text-aurum-text-body/60 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.modifiers.map((mod: ModifierDto) => (
                                <span key={mod.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-aurum-cream-secondary border border-aurum-gold-primary/10 text-xs text-aurum-text-body">
                                  {mod.name}
                                  {mod.extraPrice > 0 && <span className="font-medium text-aurum-gold-earthy">(+₹{mod.extraPrice})</span>}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {drawerOpen && selectedMenuItemId && (
        <ModifierDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          menuItemId={selectedMenuItemId}
          group={selectedGroup || null}
        />
      )}
    </div>
  );
}
