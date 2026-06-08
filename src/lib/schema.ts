import {
  pgTable,
  varchar,
  text,
  pgEnum,
  timestamp,
  integer,
  boolean,
  numeric,
  serial,
  primaryKey,
  date,
  jsonb,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ENUMS
export const userRole = pgEnum('user_role', ['SuperAdmin', 'TallerAdmin', 'Recepcionista', 'Mechanic']);
export const subscriptionPlan = pgEnum('subscription_plan', ['Basic', 'Premium']);
export const orderStatus = pgEnum('order_status', ['Pending', 'InProgress', 'Ready', 'Completed', 'Cancelled']);
export const invoiceStatus = pgEnum('invoice_status', ['Paid', 'Pending', 'Overdue']);
export const workshopType = pgEnum('workshop_type', ['Automotriz', 'Motos', 'Camiones', 'Mixto']);
export const supportTicketStatus = pgEnum('support_ticket_status', ['Open', 'Closed']);

// TABLES
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  role: userRole('role').notNull(),
  avatarUrl: text('avatar_url'),
  workshopId: varchar('workshop_id', { length: 255 }).references((): AnyPgColumn => workshops.id, { onDelete: 'set null' }),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const workshops = pgTable('workshops', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ownerId: varchar('owner_id', { length: 255 }).notNull().references((): AnyPgColumn => users.id, { onDelete: 'set null' }),
  subscription: subscriptionPlan('subscription').notNull().default('Basic'),
  logoUrl: text('logo_url'),
  primaryColor: varchar('primary_color', { length: 7 }).default('#E53E3E'),
  accentColor: varchar('accent_color', { length: 7 }).default('#F56565'),
  sidebarBgColor: varchar('sidebar_bg_color', { length: 7 }).default('#4A0404'),
  type: workshopType('type').default('Automotriz'),
  employeeCount: varchar('employee_count', { length: 50 }),
  city: varchar('city', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const branches = pgTable('branches', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workshopId: varchar('workshop_id', { length: 255 }).notNull().references(() => workshops.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
});

export const clients = pgTable('clients', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workshopId: varchar('workshop_id', { length: 255 }).notNull().references(() => workshops.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  address: text('address'),
});

export const vehicles = pgTable('vehicles', {
  id: varchar('id', { length: 255 }).primaryKey(),
  plate: varchar('plate', { length: 20 }).notNull(),
  brand: varchar('brand', { length: 100 }),
  model: varchar('model', { length: 100 }),
  year: integer('year'),
  vin: varchar('vin', { length: 100 }),
  color: varchar('color', { length: 50 }),
  mileage: integer('mileage'),
  clientId: varchar('client_id', { length: 255 }).notNull().references(() => clients.id, { onDelete: 'cascade' }),
});

export const orders = pgTable('orders', {
  id: varchar('id', { length: 255 }).primaryKey(),
  orderNumber: varchar('order_number', { length: 100 }).notNull().unique(),
  clientId: varchar('client_id', { length: 255 }).notNull().references(() => clients.id, { onDelete: 'cascade' }),
  vehicleId: varchar('vehicle_id', { length: 255 }).references(() => vehicles.id, { onDelete: 'set null' }),
  workshopId: varchar('workshop_id', { length: 255 }).notNull().references(() => workshops.id, { onDelete: 'cascade' }),
  branchId: varchar('branch_id', { length: 255 }).notNull().references(() => branches.id, { onDelete: 'cascade' }),
  status: orderStatus('status').notNull().default('Pending'),
  total: numeric('total', { precision: 10, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  assignedMechanicId: varchar('assigned_mechanic_id', { length: 255 }).references(() => users.id, { onDelete: 'set null' }),
});

export const orderServices = pgTable('order_services', {
  id: serial('id').primaryKey(),
  orderId: varchar('order_id', { length: 255 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export const inventory = pgTable('inventory', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workshopId: varchar('workshop_id', { length: 255 }).notNull().references(() => workshops.id, { onDelete: 'cascade' }),
  branchId: varchar('branch_id', { length: 255 }).notNull().references(() => branches.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }),
  quantity: integer('quantity').notNull().default(0),
  minStock: integer('min_stock').notNull().default(5),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export const orderParts = pgTable('order_parts', {
  id: serial('id').primaryKey(),
  orderId: varchar('order_id', { length: 255 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  inventoryItemId: varchar('inventory_item_id', { length: 255 }).notNull().references(() => inventory.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export const invoices = pgTable('invoices', {
  id: varchar('id', { length: 255 }).primaryKey(),
  invoiceNumber: varchar('invoice_number', { length: 100 }).notNull().unique(),
  orderId: varchar('order_id', { length: 255 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  clientId: varchar('client_id', { length: 255 }).notNull().references(() => clients.id, { onDelete: 'cascade' }),
  workshopId: varchar('workshop_id', { length: 255 }).notNull().references(() => workshops.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: invoiceStatus('status').notNull().default('Pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  dueDate: date('due_date'),
});

export const appointments = pgTable('appointments', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workshopId: varchar('workshop_id', { length: 255 }).notNull().references(() => workshops.id, { onDelete: 'cascade' }),
  clientId: varchar('client_id', { length: 255 }).notNull().references(() => clients.id, { onDelete: 'cascade' }),
  service: text('service').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
});

export const orderAuditLogs = pgTable('order_audit_logs', {
  id: varchar('id', { length: 255 }).primaryKey(),
  orderId: varchar('order_id', { length: 255 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  previousValue: text('previous_value'),
  newValue: text('new_value'),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

export const orderChecklists = pgTable('order_checklists', {
  id: varchar('id', { length: 255 }).primaryKey(),
  orderId: varchar('order_id', { length: 255 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  task: text('task').notNull(),
  isCompleted: boolean('is_completed').notNull().default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const technicalProtocols = pgTable('technical_protocols', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  level: varchar('level', { length: 255 }).notNull(),
  description: text('description').notNull(),
  steps: jsonb('steps').notNull(),
  warning: text('warning'),
  tip: text('tip'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const conversations = pgTable('conversations', {
  id: varchar('id', { length: 255 }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const conversationParticipants = pgTable('conversation_participants', {
  conversationId: varchar('conversation_id', { length: 255 }).notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.conversationId, table.userId] }),
  };
});

export const messages = pgTable('messages', {
  id: varchar('id', { length: 255 }).primaryKey(),
  conversationId: varchar('conversation_id', { length: 255 }).notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: varchar('sender_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

export const supportTickets = pgTable('support_tickets', {
  id: varchar('id', { length: 255 }).primaryKey(),
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: supportTicketStatus('status').notNull().default('Open'),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  workshopId: varchar('workshop_id', { length: 255 }).references(() => workshops.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workshopId: varchar('workshop_id', { length: 255 }).notNull().references(() => workshops.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('Pending'),
  dueDate: timestamp('due_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// RELATIONS
export const usersRelations = relations(users, ({ one, many }) => ({
  workshop: one(workshops, {
    fields: [users.workshopId],
    references: [workshops.id],
  }),
  orders: many(orders),
  supportTickets: many(supportTickets),
  auditLogs: many(orderAuditLogs),
}));

export const workshopsRelations = relations(workshops, ({ one, many }) => ({
  owner: one(users, {
    fields: [workshops.ownerId],
    references: [users.id],
  }),
  users: many(users),
  branches: many(branches),
  clients: many(clients),
  orders: many(orders),
  inventory: many(inventory),
  invoices: many(invoices),
  appointments: many(appointments),
  supportTickets: many(supportTickets),
  tasks: many(tasks),
}));

export const branchesRelations = relations(branches, ({ one }) => ({
  workshop: one(workshops, {
    fields: [branches.workshopId],
    references: [workshops.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  workshop: one(workshops, {
    fields: [clients.workshopId],
    references: [workshops.id],
  }),
  vehicles: many(vehicles),
  orders: many(orders),
  invoices: many(invoices),
  appointments: many(appointments),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  client: one(clients, {
    fields: [vehicles.clientId],
    references: [clients.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  client: one(clients, {
    fields: [orders.clientId],
    references: [clients.id],
  }),
  vehicle: one(vehicles, {
    fields: [orders.vehicleId],
    references: [vehicles.id],
  }),
  workshop: one(workshops, {
    fields: [orders.workshopId],
    references: [workshops.id],
  }),
  branch: one(branches, {
    fields: [orders.branchId],
    references: [branches.id],
  }),
  assignedMechanic: one(users, {
    fields: [orders.assignedMechanicId],
    references: [users.id],
  }),
  services: many(orderServices),
  parts: many(orderParts),
  invoice: one(invoices, {
    fields: [orders.id],
    references: [invoices.orderId],
  }),
  auditLogs: many(orderAuditLogs),
  checklists: many(orderChecklists),
}));

export const orderServicesRelations = relations(orderServices, ({ one }) => ({
  order: one(orders, {
    fields: [orderServices.orderId],
    references: [orders.id],
  }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  workshop: one(workshops, {
    fields: [inventory.workshopId],
    references: [workshops.id],
  }),
  branch: one(branches, {
    fields: [inventory.branchId],
    references: [branches.id],
  }),
}));

export const orderPartsRelations = relations(orderParts, ({ one }) => ({
  order: one(orders, {
    fields: [orderParts.orderId],
    references: [orders.id],
  }),
  inventoryItem: one(inventory, {
    fields: [orderParts.inventoryItemId],
    references: [inventory.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  workshop: one(workshops, {
    fields: [invoices.workshopId],
    references: [workshops.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  workshop: one(workshops, {
    fields: [appointments.workshopId],
    references: [workshops.id],
  }),
  client: one(clients, {
    fields: [appointments.clientId],
    references: [clients.id],
  }),
}));

export const orderAuditLogsRelations = relations(orderAuditLogs, ({ one }) => ({
  order: one(orders, {
    fields: [orderAuditLogs.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [orderAuditLogs.userId],
    references: [users.id],
  }),
}));

export const orderChecklistsRelations = relations(orderChecklists, ({ one }) => ({
  order: one(orders, {
    fields: [orderChecklists.orderId],
    references: [orders.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
  messages: many(messages),
}));

export const conversationParticipantsRelations = relations(conversationParticipants, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationParticipants.conversationId],
    references: [conversations.id],
  }),
  user: one(users, {
    fields: [conversationParticipants.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  workshop: one(workshops, {
    fields: [supportTickets.workshopId],
    references: [workshops.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  workshop: one(workshops, {
    fields: [tasks.workshopId],
    references: [workshops.id],
  }),
}));