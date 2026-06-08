export type Role = 'SuperAdmin' | 'TallerAdmin' | 'Recepcionista' | 'Mechanic';
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  role: Role;
  avatarUrl?: string | null;
  workshopId?: string | null;
  emailVerified?: boolean | null;
  failedAttempts?: number;
  isLocked?: boolean;
  createdAt: string;
};
export type SubscriptionPlan = 'Basic' | 'Premium';
export type WorkshopType = 'Automotriz' | 'Motos' | 'Camiones' | 'Mixto';
export type Workshop = {
  id: string;
  name: string;
  ownerId: string;
  subscription: SubscriptionPlan;
  branches: Branch[];
  logoUrl?: string | null;
  primaryColor?: string | null;
  accentColor?: string | null;
  sidebarBgColor?: string | null;
  type?: WorkshopType | null;
  employeeCount?: string | null;
  city?: string | null;
  phone?: string | null;
  createdAt?: string | null;
};
export type Branch = {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  workshopId?: string;
};
export type Client = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  workshopId: string;
};
export type Vehicle = {
  id: string;
  clientId: string;
  plate: string;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  vin?: string | null;
  color?: string | null;
  mileage?: number | null;
};
export type OrderStatus = 'Pending' | 'InProgress' | 'Ready' | 'Completed' | 'Cancelled';
export type Order = {
  id: string;
  orderNumber: string;
  clientId: string;
  vehicleId?: string | null;
  workshopId: string;
  branchId: string;
  status: OrderStatus;
  services: { name: string; price: number }[];
  parts: { inventoryItemId: string; name: string; price: number; quantity: number }[];
  total: number;
  createdAt: string;
  assignedMechanicId?: string | null;
  invoice?: Invoice | null;
  vehicle?: Pick<Vehicle, 'plate' | 'brand' | 'model'> | null;
};
export type InventoryItem = {
  id: string;
  name: string;
  sku?: string | null;
  quantity: number;
  price: number;
  minStock?: number | null;
  workshopId: string;
  branchId: string;
};
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';
export type Invoice = {
  id: string;
  invoiceNumber: string;
  orderId: string;
  clientId: string;
  workshopId: string;
  amount: number;
  status: InvoiceStatus;
  notes?: string | null;
  createdAt: string;
  dueDate?: string | null;
};
export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};
export type Conversation = {
  id: string;
  participantIds: string[];
  messages: Message[];
  otherParticipant?: Omit<User, 'password' | 'passwordHash'>;
};
export type Appointment = {
  id: string;
  workshopId: string;
  clientId: string;
  service: string;
  date: string;
};
export type SupportTicketStatus = 'Open' | 'Closed';
export type SupportTicket = {
  id: string;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  userId: string;
  workshopId?: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string | null;
  };
  workshop?: {
    name: string;
  } | null;
};
export type TaskStatus = 'Pending' | 'Completed';
export type Task = {
  id: string;
  workshopId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
  createdAt: string;
};