export interface BranchDto {
  id: string;
  restaurantId: string;
  name: string;
  location: string | null;
  phone: string | null;
  status: string;
  isDefault: boolean;
  printerSettings: unknown;
  createdAt: Date;
  updatedAt: Date;
}
