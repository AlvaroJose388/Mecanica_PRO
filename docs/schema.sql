-- =================================================================
-- Script Completo para la Base de Datos de MecanicaPro en Neon
-- =================================================================
-- Este script crea la estructura de tablas, tipos de datos,
-- y también inserta los datos de ejemplo para que la aplicación
-- sea funcional desde el primer momento.

-- ========= Paso 1: Definición de Tipos de Datos (ENUMS) =========
-- Esto asegura la consistencia de los datos para campos con valores predefinidos.

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS subscription_plan CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS workshop_type CASCADE;

CREATE TYPE user_role AS ENUM ('SuperAdmin', 'TallerAdmin', 'Observer', 'Mechanic');
CREATE TYPE subscription_plan AS ENUM ('Basic', 'Premium');
CREATE TYPE order_status AS ENUM ('Pending', 'InProgress', 'Ready', 'Completed', 'Cancelled');
CREATE TYPE invoice_status AS ENUM ('Paid', 'Pending', 'Overdue');
CREATE TYPE workshop_type AS ENUM ('Automotriz', 'Motos', 'Camiones', 'Mixto');


-- ========= Paso 2: Creación de la Estructura de Tablas (Schema) =========

DROP TABLE IF EXISTS messages, conversation_participants, conversations, appointments, invoices, order_parts, inventory, order_services, orders, vehicles, clients, branches, workshops, users CASCADE;

-- Tabla de Usuarios
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Para esta prueba, guardamos la contraseña en texto plano. ¡NO HACER EN PRODUCCIÓN!
    role user_role NOT NULL,
    avatar_url TEXT,
    workshop_id VARCHAR(255)
);

-- Tabla de Talleres
CREATE TABLE workshops (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id VARCHAR(255) NOT NULL REFERENCES users(id),
    subscription subscription_plan NOT NULL DEFAULT 'Basic',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Se añade la clave foránea a la tabla de usuarios ahora que 'workshops' existe.
ALTER TABLE users ADD CONSTRAINT fk_workshop FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE SET NULL;

-- Tabla de Sucursales
CREATE TABLE branches (
    id VARCHAR(255) PRIMARY KEY,
    workshop_id VARCHAR(255) NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50)
);

-- Tabla de Clientes
CREATE TABLE clients (
    id VARCHAR(255) PRIMARY KEY,
    workshop_id VARCHAR(255) NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT
);

-- Tabla de Vehículos
CREATE TABLE vehicles (
    id VARCHAR(255) PRIMARY KEY,
    plate VARCHAR(20) UNIQUE NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    year INT,
    owner_id VARCHAR(255) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    workshop_id VARCHAR(255) NOT NULL REFERENCES workshops(id) ON DELETE CASCADE
);

-- Tabla de Órdenes de Servicio
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    vehicle_id VARCHAR(255) NOT NULL REFERENCES vehicles(id),
    client_id VARCHAR(255) NOT NULL REFERENCES clients(id),
    workshop_id VARCHAR(255) NOT NULL REFERENCES workshops(id),
    branch_id VARCHAR(255) NOT NULL REFERENCES branches(id),
    status order_status NOT NULL DEFAULT 'Pending',
    total NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_mechanic_id VARCHAR(255) REFERENCES users(id)
);

-- Tabla de Servicios por Orden
CREATE TABLE order_services (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

-- Tabla de Inventario
CREATE TABLE inventory (
    id VARCHAR(255) PRIMARY KEY,
    workshop_id VARCHAR(255) NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    branch_id VARCHAR(255) NOT NULL REFERENCES branches(id),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL,
    UNIQUE(workshop_id, sku)
);

-- Tabla de Partes usadas en una Orden
CREATE TABLE order_parts (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    inventory_item_id VARCHAR(255) NOT NULL REFERENCES inventory(id),
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

-- Tabla de Facturas
CREATE TABLE invoices (
    id VARCHAR(255) PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    order_id VARCHAR(255) NOT NULL REFERENCES orders(id),
    client_id VARCHAR(255) NOT NULL REFERENCES clients(id),
    workshop_id VARCHAR(255) NOT NULL REFERENCES workshops(id),
    amount NUMERIC(10, 2) NOT NULL,
    status invoice_status NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    due_date DATE
);

-- Tabla de Citas
CREATE TABLE appointments (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL REFERENCES clients(id),
    vehicle_id VARCHAR(255) NOT NULL REFERENCES vehicles(id),
    workshop_id VARCHAR(255) NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    service TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL
);

-- Tablas para el Chat
CREATE TABLE conversations (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    conversation_id VARCHAR(255) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id VARCHAR(255) PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(255) NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);


-- ========= Paso 3: Funcionalidad de Tiempo Real para el Chat =========

CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('new_message_channel', NEW.conversation_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_message_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();


-- ========= Paso 4: Inserción de Datos de Ejemplo =========

-- Insertar SuperAdmin (TU USUARIO)
INSERT INTO users (id, name, email, password, role, avatar_url) VALUES 
('user-superadmin-ldhp', 'Luis Daniel Herrera Perez', 'luisdanielherreraperez@gmail.com', '2122232425Ll', 'SuperAdmin', 'https://picsum.photos/seed/luisdaniel/100/100');

-- Insertar otros usuarios
INSERT INTO users (id, name, email, password, role, avatar_url, workshop_id) VALUES
('user-admin-premium', 'Miguel "Mike" Rueda', 'mike@turboruedas.com', 'password', 'TallerAdmin', 'https://picsum.photos/seed/mike/100/100', NULL),
('user-mechanic-1', 'Pedro Pascal', 'pedro@turboruedas.com', 'password', 'Mechanic', 'https://picsum.photos/seed/pedro/100/100', NULL),
('user-admin-basic', 'Sofia Vergara', 'sofia@motorelite.com', 'password', 'TallerAdmin', 'https://picsum.photos/seed/sofia/100/100', NULL);

-- Insertar Talleres
INSERT INTO workshops (id, name, owner_id, subscription) VALUES 
('workshop-1', 'TurboRuedas', 'user-admin-premium', 'Premium'),
('workshop-2', 'MotorElite', 'user-admin-basic', 'Basic');

-- Actualizar workshop_id para los usuarios que pertenecen a un taller
UPDATE users SET workshop_id = 'workshop-1' WHERE id IN ('user-admin-premium', 'user-mechanic-1');
UPDATE users SET workshop_id = 'workshop-2' WHERE id = 'user-admin-basic';

-- Insertar Sucursales
INSERT INTO branches (id, workshop_id, name, address, phone) VALUES
('branch-1-1', 'workshop-1', 'TurboRuedas Central', '123 Main St, Metropolis', '555-0101'),
('branch-1-2', 'workshop-1', 'TurboRuedas North', '456 North Ave, Metropolis', '555-0102'),
('branch-2-1', 'workshop-2', 'MotorElite', '789 South St, Gotham', '555-0201');

-- Insertar Clientes
INSERT INTO clients (id, workshop_id, name, phone, email, address) VALUES
('client-1', 'workshop-1', 'Ana Gómez', '555-1111', 'ana.gomez@email.com', '1 Real Street'),
('client-2', 'workshop-1', 'Carlos Diaz', '555-2222', 'carlos.diaz@email.com', '2 Fake Avenue'),
('client-3', 'workshop-2', 'Luisa Fernandez', '555-3333', 'luisa.fernandez@email.com', '3 Mock Boulevard');

-- Insertar Vehículos
INSERT INTO vehicles (id, plate, brand, model, year, owner_id, workshop_id) VALUES
('vehicle-1', 'ABC-123', 'Toyota', 'Corolla', 2020, 'client-1', 'workshop-1'),
('vehicle-2', 'DEF-456', 'Ford', 'Fiesta', 2018, 'client-2', 'workshop-1'),
('vehicle-3', 'GHI-789', 'Honda', 'Civic', 2022, 'client-3', 'workshop-2');

-- Insertar Órdenes
INSERT INTO orders (id, order_number, vehicle_id, client_id, workshop_id, branch_id, status, total, created_at, assigned_mechanic_id) VALUES
('order-1', 'TR_001', 'vehicle-1', 'client-1', 'workshop-1', 'branch-1-1', 'Completed', 65.00, '2023-10-01T10:00:00Z', 'user-mechanic-1'),
('order-2', 'TR_002', 'vehicle-2', 'client-2', 'workshop-1', 'branch-1-2', 'InProgress', 260.00, '2023-10-28T11:30:00Z', 'user-mechanic-1'),
('order-3', 'ME_001', 'vehicle-3', 'client-3', 'workshop-2', 'branch-2-1', 'Pending', 25.00, '2023-10-29T09:00:00Z', NULL);

-- Insertar Inventario
INSERT INTO inventory (id, workshop_id, branch_id, name, sku, quantity, price) VALUES
('inv-1', 'workshop-1', 'branch-1-1', 'Filtro de Aceite', 'OF-001', 20, 15.00),
('inv-2', 'workshop-1', 'branch-1-1', 'Pastillas de Freno Delanteras', 'BP-F-002', 5, 80.00),
('inv-3', 'workshop-2', 'branch-2-1', 'Filtro de Aire', 'AF-001', 30, 25.00);

-- Insertar Facturas
INSERT INTO invoices (id, invoice_number, order_id, client_id, workshop_id, amount, status, created_at, due_date) VALUES
('invoice-1', 'INV-001', 'order-1', 'client-1', 'workshop-1', 65.00, 'Paid', '2023-10-01T12:00:00Z', '2023-10-15'),
('invoice-2', 'INV-002', 'order-2', 'client-2', 'workshop-1', 260.00, 'Pending', '2023-10-28T14:00:00Z', '2023-11-12'),
('invoice-3', 'INV-003', 'order-3', 'client-3', 'workshop-2', 25.00, 'Paid', '2023-10-29T10:00:00Z', '2023-11-13');

-- Insertar Citas
INSERT INTO appointments (id, client_id, vehicle_id, workshop_id, service, date) VALUES
('appt-1', 'client-1', 'vehicle-1', 'workshop-1', 'Cambio de Aceite', NOW() + interval '1 day'),
('appt-2', 'client-2', 'vehicle-2', 'workshop-1', 'Revisión de Frenos', NOW() + interval '2 days');

-- Insertar Conversaciones y Mensajes de Chat
INSERT INTO conversations (id) VALUES ('conv-1'), ('conv-2');

INSERT INTO conversation_participants (conversation_id, user_id) VALUES
('conv-1', 'user-admin-premium'),
('conv-1', 'user-mechanic-1'),
('conv-2', 'user-superadmin-ldhp'),
('conv-2', 'user-admin-premium');

INSERT INTO messages (id, conversation_id, sender_id, text, timestamp) VALUES
('msg-1', 'conv-1', 'user-admin-premium', 'Hey Pedro, how is the brake job on the Fiesta going?', '2023-10-28T12:00:00Z'),
('msg-2', 'conv-1', 'user-mechanic-1', 'Almost done, just bleeding the brakes now. Should be ready in 30 minutes.', '2023-10-28T12:01:00Z'),
('msg-3', 'conv-2', 'user-superadmin-ldhp', 'Hi Mike, just checking in. How are you finding the new features?', '2023-10-27T15:00:00Z');


-- ========= Paso 5: Índices para Optimización =========
CREATE INDEX idx_orders_workshop ON orders(workshop_id);
CREATE INDEX idx_clients_workshop ON clients(workshop_id);
CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
