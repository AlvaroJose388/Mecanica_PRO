# **App Name**: MecanicaPro Demo

## Core Features:

- Simulated Login: Simulate user login with predefined roles (SuperAdmin, Taller Admin, Observer).
- Workshop Management (SuperAdmin): SuperAdmin can view, create, edit, and delete workshops and assign subscription plans (Basic/Premium).
- Workshop Dashboard (Taller Admin): Taller Admin can manage their workshop, including clients, vehicles, orders, inventory, and invoices. They can also use internal and inter-workshop chat.
- Read-Only Observer Role: Observer can view dashboards, orders, clients, inventory, and chat history but cannot modify anything.
- Subscription-Based Features: Implement conditional logic in the frontend to differentiate features between Basic and Premium subscription plans.
- Simulated WhatsApp Integration: Structure the code to simulate sending WhatsApp messages upon certain events (new appointment, order ready). Include a global configuration for the sender number and display notifications upon 'sending'.
- Real-Time Chat Module: Implement a fully functional chat module (internal and inter-workshop) using in-memory data. The SuperAdmin role can participate in all conversations. Administrators can send messages in their conversations. Observers can view.
- Multi-Branch (Premium Only): Premium workshops can have multiple branches, each with its own clients, inventory, schedule, chats, and dashboard. Admins can switch between branches and view statistics per branch or globally.
- Geographic Map: Adds a mini-map to the Appointments module, marking the client's address. Includes a simulated 'See Quick Route' button and a map to view all workshop clients.
- Internal Notifications: Implements a notification system for events like 'New appointment created,' 'New order assigned to you,' 'Low inventory,' and 'New chat message.' Each user has their own inbox.
- Real-Time Activity Panel: Adds a 'timeline' panel to the Dashboard showing events like 'Ana Gómez created order #RD_001,' 'Pedro Sánchez added vehicle Ford Fiesta,' and 'TurboRuedas sent message to MotorElite.'
- Advanced Permissions System (RBAC): Implements granular permissions like 'Can edit inventory,' 'Can delete orders,' 'Can send messages,' 'Can create appointments,' and 'Can view billing module.' Allows creating custom roles like 'Receptionist,' 'Head Mechanic,' and 'Finance.'
- Enhanced Billing: Adds features like taxes (VAT %), discounts per client, QR code for 'simulated payment,' billing history per client, mock PDF generation, and invoice status (Paid, Pending, Overdue). Includes a 'Top Clients by Revenue' module.
- Intelligent Parts Module (AI mock): Recommends parts based on monthly orders, predicts low inventory, and suggests restocking.
- Advanced Multi-Chat System: Expands chat functionality to include chats per order (Admin, Mechanics, Observers), chats with clients (Workshop ↔ Client) with WhatsApp integration and message history, and group chats between workshops.
- Internal Audit (SuperAdmin): Provides a panel for the SuperAdmin with a log of all system events, recent logins, mock suspicious actions, and workshop usage history.
- Complete Dark Mode: Adds a global switch for Light/Dark mode, applying dark sidebars, illuminated cards, and smooth transitions.
- Advanced Configuration Panel: Adds settings within Admin settings to change workshop logo, colors, name, address, WhatsApp number, internal notifications, and user permissions.
- Workshop Marketing Module (Simulated): Creates a section showing automated messages for clients, featured messages (templates), and client retention statistics.
- Simulated SMS Integration: Simulates sending SMS to clients, showing SMS history, and displaying a fake cost panel.
- Module of Roles by Workshop Areas: Adds operational roles within the workshop, such as Reception, Mechanic, Mechanic Senior, Washing/Detailing, Cashier/Finances, Diagnostics/Scanner, Branch Administrator, and General Manager. Each role has different screens and restricted buttons.
- Mechanic Control Module (Timesheets): Each mechanic starts and closes a 'shift'. Each service order assigns hours worked. Shows productivity: hours worked per mechanic, real time invested per order, estimated vs. real time, productivity ranking of the month.
- Orders with Photos, Videos, and Evidence: Upload photos of the vehicle's condition. Upload short videos (simulated). Gallery per order. 'Before and after'. Digital signature of the client.
- Real-Time Vehicle Status (Fake IoT Mode): Although simulated, the UI shows it as if it were real: Status: 'In diagnosis', 'On elevator', 'Parts installed', 'Washing', etc. Progress bars per phase of the service. Traffic light type indicators.
- Integration with Plates (Simulated Consultation RUNT/SOAT): When entering a plate: Show simulated data: Brand, Model, Year, SOAT (Valid/Not valid), Technical-Mechanical Review (date).
- Global Vehicle History: Each vehicle has: Order history, Maintenance history, History of installed parts, Quick PDF report.
- Workshop Document Center: An internal Google Drive: Upload invoices (mock), Upload technical manuals, Upload price lists, Upload legal documents, 'Folder by branch'.
- Complete Calendar Google Calendar Style: Monthly, weekly and daily view. Drag appointments (drag & drop). Changes reflected in timeline. Mock integration with Google Calendar.
- Automations Engine: A 'internal Zapier' mode where the workshop can create rules such as: 'If an order goes to Ready → Send WhatsApp + SMS.' 'If the inventory falls < minimum stock → notification + add to restocking list.' 'If a client is 6 months without coming → send promotion message.'
- Promotions and Coupons Module: The administrator creates: Discount coupons, Season promotions, Loyalty promotions, Referral coupons. Clients have a 'profile with points'.
- Financial Status of the Workshop: Balance of the month, Profits vs expenses (mock), Cost of parts vs profit margin, Simulated cash flow, Suppliers panel, General financial dashboard.
- Integration with Suppliers (Simulated Marketplace): Parts marketplace (mock): Catalog of suppliers, Simulated price list, 'Buy spare part' (only adds to a shopping cart), Chat with supplier.
- Support Ticket System (for SuperAdmin): Each workshop can send: Support tickets, Questions, Requests, And SuperAdmin responds.
- Advanced Analytics (Business Intelligence Mock): Panel with: Revenue graph by branch, Month to month comparison, Most profitable services, Most frequent clients, Vehicles most attended, Hours worked vs income, Projection of the next month.
- Special Dashboard for Observer: The observer now sees: Graphs but without buttons, Workshop history, Monthly averages, Real-time activity (reading), Ranking of mechanics (read only).
- Chat with AI (Simulated) to help the Workshop: Adds a chat called 'Technical Assistant' that responds: How to solve common failures, What spare part to use, Basic mechanical advice, Interpretation of OBD codes (mock).
- Customer Screen (Customer Portal): Simulated, but incredible: The client can: See their orders, See vehicle status, Receive messages, Upload photos, Confirm appointments, Consult history. In addition, the workshop can send you the link.

## Style Guidelines:

- Primary color: Deep blue (#1E3A8A), evoking trust and professionalism, reflecting the core services of a workshop application.
- Background color: Light gray (#F0F5F9), providing a clean, neutral backdrop to ensure readability and focus on content.
- Accent color: Teal (#38b2ac), used for interactive elements and highlights to guide user attention without overwhelming the interface.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text.
- Code font: 'Source Code Pro' for any displayed code snippets.
- Use a set of consistent, modern icons representing different sections and actions, in a filled style for primary actions and outlined style for secondary actions.
- Dashboard layout with a dark sidebar and light content area, using reusable cards and tables for a clean and organized presentation.