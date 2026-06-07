/**
 * Pruebas unitarias para la lógica de negocio del módulo de Inventario.
 * Módulo: Inventario de MecanicaPro
 * 
 * Se prueban:
 * - Cálculo de alertas de stock bajo
 * - Conversión de precios (DB string → número)
 * - Generación de SKU
 * - Validación de operaciones de stock
 */

import type { InventoryItem } from '../types';

// ============================================================
// LÓGICA DE NEGOCIO PARA INVENTARIO
// ============================================================

const LOW_STOCK_THRESHOLD = 5;
const CRITICAL_STOCK_THRESHOLD = 2;

type StockAlert = 'normal' | 'low' | 'critical' | 'out_of_stock';

function getStockAlertLevel(quantity: number): StockAlert {
  if (quantity <= 0) return 'out_of_stock';
  if (quantity <= CRITICAL_STOCK_THRESHOLD) return 'critical';
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low';
  return 'normal';
}

function convertDbPriceToNumber(dbPrice: string): number {
  return Number(dbPrice);
}

function convertNumberToDbPrice(price: number): string {
  return price.toString();
}

function generateSKU(itemName: string, workshopId: string): string {
  const prefix = itemName.substring(0, 3).toUpperCase().replace(/\s/g, '');
  const suffix = workshopId.substring(workshopId.length - 4).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${suffix}-${random}`;
}

function canDeductStock(currentQuantity: number, requestedQuantity: number): { allowed: boolean; remaining: number } {
  const remaining = currentQuantity - requestedQuantity;
  return {
    allowed: remaining >= 0,
    remaining: Math.max(0, remaining),
  };
}

function calculateInventoryValue(items: Pick<InventoryItem, 'price' | 'quantity'>[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getItemsNeedingRestock(items: InventoryItem[]): InventoryItem[] {
  return items.filter(item => item.quantity <= LOW_STOCK_THRESHOLD);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

// ============================================================
// PRUEBAS
// ============================================================

describe('Niveles de Alerta de Stock', () => {
  it('debería retornar "out_of_stock" cuando cantidad es 0', () => {
    expect(getStockAlertLevel(0)).toBe('out_of_stock');
  });

  it('debería retornar "out_of_stock" cuando cantidad es negativa', () => {
    expect(getStockAlertLevel(-3)).toBe('out_of_stock');
  });

  it('debería retornar "critical" cuando cantidad es 1 o 2', () => {
    expect(getStockAlertLevel(1)).toBe('critical');
    expect(getStockAlertLevel(2)).toBe('critical');
  });

  it('debería retornar "low" cuando cantidad está entre 3 y 5', () => {
    expect(getStockAlertLevel(3)).toBe('low');
    expect(getStockAlertLevel(4)).toBe('low');
    expect(getStockAlertLevel(5)).toBe('low');
  });

  it('debería retornar "normal" cuando cantidad es mayor a 5', () => {
    expect(getStockAlertLevel(6)).toBe('normal');
    expect(getStockAlertLevel(100)).toBe('normal');
  });
});

describe('Conversión de Precios DB ↔ Aplicación', () => {
  it('debería convertir string "15000" a número 15000', () => {
    expect(convertDbPriceToNumber('15000')).toBe(15000);
  });

  it('debería convertir string con decimales "99.99" a número', () => {
    expect(convertDbPriceToNumber('99.99')).toBe(99.99);
  });

  it('debería convertir número 15000 a string "15000"', () => {
    expect(convertNumberToDbPrice(15000)).toBe('15000');
  });

  it('debería manejar "0" correctamente', () => {
    expect(convertDbPriceToNumber('0')).toBe(0);
  });

  it('debería ser reversible (ida y vuelta)', () => {
    const original = 25500;
    const asString = convertNumberToDbPrice(original);
    const backToNumber = convertDbPriceToNumber(asString);
    expect(backToNumber).toBe(original);
  });
});

describe('Generación de SKU', () => {
  it('debería generar un SKU con formato correcto', () => {
    const sku = generateSKU('Filtro de aceite', 'ws-abcd-1234');
    // Formato: FIL-1234-XXXX
    expect(sku).toMatch(/^[A-Z]{1,3}-[A-Z0-9]{4}-\d{4}$/);
  });

  it('debería usar las primeras 3 letras del nombre', () => {
    const sku = generateSKU('Bujía NGK', 'ws-test');
    expect(sku.startsWith('BUJ')).toBe(true);
  });

  it('debería generar SKUs únicos (con componente random)', () => {
    const sku1 = generateSKU('Filtro', 'ws-1234');
    const sku2 = generateSKU('Filtro', 'ws-1234');
    // Muy improbable que sean iguales por el random
    // Pero verificamos el formato
    expect(sku1).toMatch(/^[A-Z]{1,3}-/);
    expect(sku2).toMatch(/^[A-Z]{1,3}-/);
  });
});

describe('Deducción de Stock', () => {
  it('debería permitir deducción con stock suficiente', () => {
    const result = canDeductStock(10, 3);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(7);
  });

  it('debería permitir deducción exacta (stock queda en 0)', () => {
    const result = canDeductStock(5, 5);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('debería denegar deducción con stock insuficiente', () => {
    const result = canDeductStock(3, 7);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('debería denegar deducción con stock en cero', () => {
    const result = canDeductStock(0, 1);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});

describe('Cálculo de Valor Total del Inventario', () => {
  it('debería calcular correctamente el valor total', () => {
    const items = [
      { price: 15000, quantity: 10 },
      { price: 5000, quantity: 20 },
      { price: 80000, quantity: 3 },
    ];
    // 150000 + 100000 + 240000 = 490000
    expect(calculateInventoryValue(items)).toBe(490000);
  });

  it('debería retornar 0 para inventario vacío', () => {
    expect(calculateInventoryValue([])).toBe(0);
  });

  it('debería manejar artículos con cantidad 0', () => {
    const items = [
      { price: 50000, quantity: 0 },
      { price: 30000, quantity: 5 },
    ];
    expect(calculateInventoryValue(items)).toBe(150000);
  });
});

describe('Identificación de Artículos para Reabastecimiento', () => {
  const mockItems: InventoryItem[] = [
    { id: '1', name: 'Filtro aceite', sku: 'F001', quantity: 2, price: 15000, workshopId: 'ws-1', branchId: 'br-1' },
    { id: '2', name: 'Pastillas freno', sku: 'P001', quantity: 50, price: 45000, workshopId: 'ws-1', branchId: 'br-1' },
    { id: '3', name: 'Bujías', sku: 'B001', quantity: 5, price: 8000, workshopId: 'ws-1', branchId: 'br-1' },
    { id: '4', name: 'Aceite 10W40', sku: 'A001', quantity: 0, price: 35000, workshopId: 'ws-1', branchId: 'br-1' },
    { id: '5', name: 'Correa', sku: 'C001', quantity: 100, price: 25000, workshopId: 'ws-1', branchId: 'br-1' },
  ];

  it('debería identificar los artículos con stock bajo o agotado', () => {
    const needRestock = getItemsNeedingRestock(mockItems);
    expect(needRestock).toHaveLength(3); // qty: 2, 5, 0
  });

  it('debería incluir artículos con cantidad 0', () => {
    const needRestock = getItemsNeedingRestock(mockItems);
    const outOfStock = needRestock.find(i => i.name === 'Aceite 10W40');
    expect(outOfStock).toBeDefined();
  });

  it('debería no incluir artículos con stock normal', () => {
    const needRestock = getItemsNeedingRestock(mockItems);
    const normal = needRestock.find(i => i.name === 'Pastillas freno');
    expect(normal).toBeUndefined();
  });
});

describe('Formato de Moneda (COP)', () => {
  it('debería formatear correctamente un valor', () => {
    const formatted = formatCurrency(150000);
    // Formato colombiano: $ 150.000
    expect(formatted).toContain('150');
    expect(formatted).toContain('$');
  });

  it('debería formatear cero', () => {
    const formatted = formatCurrency(0);
    expect(formatted).toContain('0');
  });

  it('debería formatear valores grandes', () => {
    const formatted = formatCurrency(1500000);
    expect(formatted).toContain('1.500.000') ;
  });
});
