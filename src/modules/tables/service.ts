import { prisma } from '@/src/lib/prisma';
import { TableFormData, TableSchema } from './validation';


export class TableService {
  static async getTables(branchId: string) {
    return prisma.table.findMany({
      where: { branchId, deletedAt: null },
      orderBy: [
        { floor: 'asc' },
        { tableNumber: 'asc' }
      ]
    });
  }

  static async createTable(branchId: string, data: TableFormData) {
    const validated = TableSchema.parse(data);
    
    // Simple QR URL for now, could be pointing to the Next.js app route
    const tempId = crypto.randomUUID(); 
    const qrUrl = `/order/${branchId}?table=${tempId}`;

    return prisma.table.create({
      data: {
        id: tempId, // Force UUID to match the QR we generated
        branchId,
        tableNumber: validated.tableNumber,
        capacity: validated.capacity,
        floor: validated.floor,
        zone: validated.zone,
        isIndoor: validated.isIndoor,
        isVip: validated.isVip,
        qrCodeUrl: qrUrl,
      }
    });
  }

  static async updateTable(id: string, data: TableFormData) {
    const validated = TableSchema.parse(data);
    return prisma.table.update({
      where: { id },
      data: {
        tableNumber: validated.tableNumber,
        capacity: validated.capacity,
        floor: validated.floor,
        zone: validated.zone,
        isIndoor: validated.isIndoor,
        isVip: validated.isVip,
      }
    });
  }

  static async deleteTable(id: string) {
    return prisma.table.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
