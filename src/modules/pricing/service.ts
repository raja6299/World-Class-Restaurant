import { BranchSettings } from '@prisma/client';

export interface PricingInputItem {
  id: string;
  basePrice: number;
  quantity: number;
  discountAmount?: number;
  modifiers?: { price: number }[];
}

export interface PricingResult {
  subTotal: number;
  modifierTotal: number;
  discountTotal: number;
  serviceChargeAmount: number;
  taxableAmount: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grandTotal: number;
  roundedTotal: number;
}

export class PricingService {
  static calculateOrderTotal(items: PricingInputItem[], settings: BranchSettings, globalDiscount: number = 0): PricingResult {
    let subTotal = 0;
    let modifierTotal = 0;
    let discountTotal = globalDiscount;

    for (const item of items) {
      const itemModifierTotal = (item.modifiers || []).reduce((sum, mod) => sum + mod.price, 0) * item.quantity;
      const itemBaseTotal = item.basePrice * item.quantity;
      
      subTotal += itemBaseTotal;
      modifierTotal += itemModifierTotal;
      discountTotal += (item.discountAmount || 0) * item.quantity;
    }

    const totalBeforeTax = (subTotal + modifierTotal) - discountTotal;
    
    // Service Charge
    const serviceChargeAmount = totalBeforeTax * (settings.serviceCharge / 100);
    const taxableAmount = totalBeforeTax + serviceChargeAmount;

    // Taxes
    const gstAmount = taxableAmount * (settings.gst / 100);
    const cgstAmount = taxableAmount * (settings.cgst / 100);
    const sgstAmount = taxableAmount * (settings.sgst / 100);
    const igstAmount = taxableAmount * (settings.igst / 100);

    const grandTotal = taxableAmount + cgstAmount + sgstAmount + igstAmount; // Assuming GST is split into CGST/SGST or IGST based on settings, but we calculate them dynamically.
    const roundedTotal = Math.round(grandTotal);

    return {
      subTotal,
      modifierTotal,
      discountTotal,
      serviceChargeAmount,
      taxableAmount,
      gstAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grandTotal,
      roundedTotal,
    };
  }
}
