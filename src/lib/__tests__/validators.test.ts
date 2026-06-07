/**
 * Pruebas unitarias para la lógica de validación de negocio.
 * Módulo: Validadores de datos del sistema MecanicaPro
 * 
 * Se prueban las reglas de negocio que aplican a:
 * - Validación de datos de clientes
 * - Validación de inventario
 * - Validación de órdenes
 * - Jerarquía de estados de órdenes (no retrocesos)
 */

import type { OrderStatus, Client, InventoryItem } from '../types';

// ============================================================
// LÓGICA DE NEGOCIO EXTRAÍDA PARA PRUEBAS
// ============================================================

/**
 * Jerarquía de estados para evitar retrocesos en órdenes.
 * Regla de negocio crítica: una orden solo puede avanzar, nunca retroceder.
 */
const STATUS_RANK: Record<OrderStatus, number> = {
  'Pending': 0,
  'InProgress': 1,
  'Ready': 2,
  'Completed': 3,
  'Cancelled': 4,
};

function isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  const currentRank = STATUS_RANK[currentStatus];
  const newRank = STATUS_RANK[newStatus];
  return newRank >= currentRank;
}

function validateClientData(data: Partial<Client>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('El nombre del cliente es obligatorio.');
  }

  if (!data.workshopId || data.workshopId.trim().length === 0) {
    errors.push('El ID del taller es obligatorio.');
  }

  if (data.email && !data.email.includes('@')) {
    errors.push('El email no tiene un formato válido.');
  }

  return { valid: errors.length === 0, errors };
}

function validateInventoryItem(data: Partial<InventoryItem>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.workshopId) errors.push('El ID del taller es obligatorio.');
  if (!data.name || data.name.trim().length === 0) errors.push('El nombre del artículo es obligatorio.');
  if (data.price === undefined || data.price < 0) errors.push('El precio debe ser un número positivo.');
  if (data.quantity === undefined || data.quantity < 0) errors.push('La cantidad debe ser un número positivo.');

  return { valid: errors.length === 0, errors };
}

function calculateOrderTotal(
  services: { price: number }[],
  parts: { price: number; quantity: number }[]
): number {
  const servicesTotal = services.reduce((sum, s) => sum + s.price, 0);
  const partsTotal = parts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  return servicesTotal + partsTotal;
}

function hasStockAvailable(currentQuantity: number, requestedQuantity: number): boolean {
  return currentQuantity >= requestedQuantity;
}

// ============================================================
// PRUEBAS
// ============================================================

describe('Transición de Estados de Órdenes', () => {
  describe('Transiciones válidas (avance)', () => {
    it('Pending → InProgress (iniciar trabajo)', () => {
      expect(isValidStatusTransition('Pending', 'InProgress')).toBe(true);
    });

    it('InProgress → Ready (trabajo listo)', () => {
      expect(isValidStatusTransition('InProgress', 'Ready')).toBe(true);
    });

    it('Ready → Completed (entregar al cliente)', () => {
      expect(isValidStatusTransition('Ready', 'Completed')).toBe(true);
    });

    it('Pending → Cancelled (cancelar desde inicio)', () => {
      expect(isValidStatusTransition('Pending', 'Cancelled')).toBe(true);
    });

    it('Pending → Completed (saltar estados, permitido por jerarquía)', () => {
      expect(isValidStatusTransition('Pending', 'Completed')).toBe(true);
    });

    it('Pending → Pending (mismo estado es válido)', () => {
      expect(isValidStatusTransition('Pending', 'Pending')).toBe(true);
    });
  });

  describe('Transiciones inválidas (retroceso)', () => {
    it('InProgress → Pending (retroceso denegado)', () => {
      expect(isValidStatusTransition('InProgress', 'Pending')).toBe(false);
    });

    it('Ready → InProgress (retroceso denegado)', () => {
      expect(isValidStatusTransition('Ready', 'InProgress')).toBe(false);
    });

    it('Completed → Ready (retroceso denegado)', () => {
      expect(isValidStatusTransition('Completed', 'Ready')).toBe(false);
    });

    it('Completed → Pending (retroceso denegado)', () => {
      expect(isValidStatusTransition('Completed', 'Pending')).toBe(false);
    });

    it('Cancelled → Pending (retroceso desde cancelado)', () => {
      expect(isValidStatusTransition('Cancelled', 'Pending')).toBe(false);
    });
  });
});

describe('Validación de datos de Cliente', () => {
  it('debería ser válido con todos los campos requeridos', () => {
    const result = validateClientData({
      name: 'Juan Pérez',
      workshopId: 'ws-123',
      email: 'juan@email.com',
      phone: '3001234567',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('debería fallar sin nombre', () => {
    const result = validateClientData({
      name: '',
      workshopId: 'ws-123',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El nombre del cliente es obligatorio.');
  });

  it('debería fallar sin workshopId', () => {
    const result = validateClientData({
      name: 'Juan',
      workshopId: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El ID del taller es obligatorio.');
  });

  it('debería fallar con email inválido', () => {
    const result = validateClientData({
      name: 'Juan',
      workshopId: 'ws-123',
      email: 'correo-sin-arroba',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El email no tiene un formato válido.');
  });

  it('debería ser válido sin email (campo opcional)', () => {
    const result = validateClientData({
      name: 'Juan',
      workshopId: 'ws-123',
    });
    expect(result.valid).toBe(true);
  });

  it('debería fallar con múltiples errores', () => {
    const result = validateClientData({
      name: '',
      workshopId: '',
      email: 'invalido',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Validación de Artículo de Inventario', () => {
  it('debería ser válido con datos completos', () => {
    const result = validateInventoryItem({
      workshopId: 'ws-123',
      name: 'Filtro de aceite',
      price: 15000,
      quantity: 50,
    });
    expect(result.valid).toBe(true);
  });

  it('debería fallar con precio negativo', () => {
    const result = validateInventoryItem({
      workshopId: 'ws-123',
      name: 'Filtro',
      price: -100,
      quantity: 10,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El precio debe ser un número positivo.');
  });

  it('debería fallar con cantidad negativa', () => {
    const result = validateInventoryItem({
      workshopId: 'ws-123',
      name: 'Filtro',
      price: 100,
      quantity: -5,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('La cantidad debe ser un número positivo.');
  });

  it('debería fallar sin nombre del artículo', () => {
    const result = validateInventoryItem({
      workshopId: 'ws-123',
      name: '',
      price: 100,
      quantity: 10,
    });
    expect(result.valid).toBe(false);
  });
});

describe('Cálculo de Total de Orden', () => {
  it('debería calcular correctamente solo con servicios', () => {
    const services = [{ price: 50000 }, { price: 30000 }];
    const parts: { price: number; quantity: number }[] = [];
    expect(calculateOrderTotal(services, parts)).toBe(80000);
  });

  it('debería calcular correctamente solo con partes', () => {
    const services: { price: number }[] = [];
    const parts = [
      { price: 15000, quantity: 2 },
      { price: 5000, quantity: 4 },
    ];
    expect(calculateOrderTotal(services, parts)).toBe(50000);
  });

  it('debería calcular correctamente con servicios y partes', () => {
    const services = [{ price: 100000 }];
    const parts = [{ price: 20000, quantity: 3 }];
    expect(calculateOrderTotal(services, parts)).toBe(160000);
  });

  it('debería retornar 0 sin servicios ni partes', () => {
    expect(calculateOrderTotal([], [])).toBe(0);
  });

  it('debería manejar precios decimales', () => {
    const services = [{ price: 99.99 }];
    const parts = [{ price: 49.99, quantity: 2 }];
    const total = calculateOrderTotal(services, parts);
    expect(total).toBeCloseTo(199.97, 2);
  });
});

describe('Validación de Stock Disponible', () => {
  it('debería confirmar disponibilidad con stock suficiente', () => {
    expect(hasStockAvailable(10, 5)).toBe(true);
  });

  it('debería confirmar disponibilidad con stock exacto', () => {
    expect(hasStockAvailable(3, 3)).toBe(true);
  });

  it('debería denegar con stock insuficiente', () => {
    expect(hasStockAvailable(2, 5)).toBe(false);
  });

  it('debería denegar con stock en cero', () => {
    expect(hasStockAvailable(0, 1)).toBe(false);
  });

  it('debería confirmar cuando se pide 0 unidades', () => {
    expect(hasStockAvailable(5, 0)).toBe(true);
  });
});
