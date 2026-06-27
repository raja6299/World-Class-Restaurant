/* ═══════════════════════════════════════════════════════
   AURUM RESTAURANT — Form Validation Utilities
   ═══════════════════════════════════════════════════════ */

export const validationRules = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address',
    },
  },
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^[+]?[\d\s()-]{7,15}$/,
      message: 'Please enter a valid phone number',
    },
  },
  date: {
    required: 'Date is required',
    validate: (value: string) => {
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today || 'Please select a future date';
    },
  },
  time: {
    required: 'Time is required',
    validate: (value: string) => {
      const [hours] = value.split(':').map(Number);
      return (hours >= 12 && hours <= 23) || 'Restaurant hours: 12:00 PM - 11:00 PM';
    },
  },
  partySize: {
    required: 'Party size is required',
  },
  dietaryReqs: {
    maxLength: { value: 200, message: 'Maximum 200 characters' },
  },
  specialRequests: {
    maxLength: { value: 300, message: 'Maximum 300 characters' },
  },
  agreeToTerms: {
    required: 'You must agree to the cancellation policy',
  },
};

export const partySizeOptions = [
  { value: '1', label: '1 Guest' },
  { value: '2', label: '2 Guests' },
  { value: '3', label: '3 Guests' },
  { value: '4', label: '4 Guests' },
  { value: '5', label: '5 Guests' },
  { value: '6-8', label: '6-8 Guests' },
  { value: '8-10', label: '8-10 Guests' },
  { value: '10+', label: '10+ Guests' },
];

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
