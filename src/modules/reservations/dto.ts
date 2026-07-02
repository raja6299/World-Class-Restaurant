export interface ReservationDto {
  id: string;
  branchId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  guestCount: number;
  date: Date;
  time: string;
  status: string;
  source: string;
  tableId: string | null;
  assignedWaiterId: string | null;
  expectedDuration: number;
  deposit: number;
  arrivalStatus: string | null;
  reminderStatus: string | null;
  specialRequests: string | null;
  occasion: string | null;
  createdAt: Date;
  updatedAt: Date;
  table?: {
    id: string;
    tableNumber: string;
  } | null;
  assignedWaiter?: {
    id: string;
    name: string | null;
  } | null;
}
