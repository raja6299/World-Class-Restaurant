import { CartRepository } from './repository';
import { PricingService, PricingInputItem } from '@/src/modules/pricing/service';
import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';

export class CartService {
  static async getOrCreateCart(diningSessionId: string) {
    let cart = await CartRepository.findActiveBySession(diningSessionId);
    if (!cart) {
      cart = await CartRepository.create(diningSessionId);
    }
    return cart;
  }

  static async addItem(diningSessionId: string, menuItemId: string, quantity: number, modifiers: Prisma.InputJsonValue = [], notes: string = '') {
    const cart = await this.getOrCreateCart(diningSessionId);
    
    // Fetch menu item to get base price
    const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
    if (!menuItem) throw new Error("Menu item not found");

    const modifierCost = (modifiers as { price?: number }[]).reduce((sum, mod) => sum + (mod.price || 0), 0);
    const unitPrice = menuItem.price + modifierCost;
    const totalPrice = unitPrice * quantity;

    await CartRepository.addItem(cart.id, {
      menuItemId,
      quantity,
      modifiers,
      notes,
      unitPrice,
      totalPrice
    });

    // Recalculate totals
    await this.recalculateCart(cart.id);
  }

  static async recalculateCart(cartId: string) {
    // 1. Fetch updated cart
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true, diningSession: { include: { branch: { include: { settings: true } } } } }
    });

    if (!cart || !cart.diningSession.branch.settings) return;

    // 2. Format items for PricingEngine
    const pricingItems: PricingInputItem[] = cart.items.map(item => ({
      id: item.id,
      basePrice: item.unitPrice, // unitPrice includes modifiers here for simplicity, or we separate them
      quantity: item.quantity,
      modifiers: (item.modifiers as unknown as { price: number }[]) || [],
    }));

    // 3. Use Pricing Engine
    const totals = PricingService.calculateOrderTotal(pricingItems, cart.diningSession.branch.settings);

    // 4. Update cart
    await CartRepository.updateTotals(cartId, {
      subTotal: totals.subTotal,
      taxTotal: totals.cgstAmount + totals.sgstAmount + totals.igstAmount,
      discountTotal: totals.discountTotal,
      grandTotal: totals.roundedTotal,
    });
  }
}
