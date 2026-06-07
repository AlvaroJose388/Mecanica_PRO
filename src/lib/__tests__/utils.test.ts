/**
 * Pruebas unitarias para las funciones utilitarias de MecanicaPro.
 * Módulo: src/lib/utils.ts
 * 
 * Se prueban las funciones:
 * - cn(): combinación de clases CSS con tailwind-merge
 * - hexToHsl(): conversión de colores hexadecimal a HSL
 */

import { cn, hexToHsl } from '../utils';

describe('cn() - Combinador de clases CSS', () => {
  it('debería combinar múltiples clases simples', () => {
    const result = cn('px-4', 'py-2', 'bg-blue-500');
    expect(result).toBe('px-4 py-2 bg-blue-500');
  });

  it('debería resolver conflictos de tailwind (la última gana)', () => {
    const result = cn('px-4', 'px-6');
    expect(result).toBe('px-6');
  });

  it('debería manejar clases condicionales', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled');
    expect(result).toBe('btn btn-active');
  });

  it('debería ignorar valores falsy (undefined, null, false)', () => {
    const result = cn('base', undefined, null, false, 'extra');
    expect(result).toBe('base extra');
  });

  it('debería manejar strings vacíos', () => {
    const result = cn('', 'valid-class', '');
    expect(result).toBe('valid-class');
  });

  it('debería retornar string vacío sin argumentos', () => {
    const result = cn();
    expect(result).toBe('');
  });
});

describe('hexToHsl() - Convertidor de color hexadecimal a HSL', () => {
  it('debería convertir negro (#000000) correctamente', () => {
    const result = hexToHsl('#000000');
    expect(result).toBe('0 0% 0%');
  });

  it('debería convertir blanco (#FFFFFF) correctamente', () => {
    const result = hexToHsl('#FFFFFF');
    expect(result).toBe('0 0% 100%');
  });

  it('debería convertir rojo puro (#FF0000) correctamente', () => {
    const result = hexToHsl('#FF0000');
    expect(result).toBe('0 100% 50%');
  });

  it('debería convertir verde puro (#00FF00) correctamente', () => {
    const result = hexToHsl('#00FF00');
    expect(result).toBe('120 100% 50%');
  });

  it('debería convertir azul puro (#0000FF) correctamente', () => {
    const result = hexToHsl('#0000FF');
    expect(result).toBe('240 100% 50%');
  });

  it('debería convertir el color primario de MecanicaPro (#1E3A8A)', () => {
    const result = hexToHsl('#1E3A8A');
    // Azul profundo: H ≈ 224, S ≈ 64%, L ≈ 33%
    expect(result).toMatch(/^\d+ \d+% \d+%$/);
    const [h, s, l] = result.split(' ').map(v => parseInt(v));
    expect(h).toBeGreaterThan(200);
    expect(h).toBeLessThan(240);
  });

  it('debería retornar "0 0% 0%" para hex inválido (longitud incorrecta)', () => {
    const result = hexToHsl('#FFF');
    expect(result).toBe('0 0% 0%');
  });

  it('debería retornar "0 0% 0%" para string vacío', () => {
    const result = hexToHsl('');
    expect(result).toBe('0 0% 0%');
  });

  it('debería manejar colores con letras minúsculas', () => {
    const result = hexToHsl('#ff6600');
    expect(result).toMatch(/^\d+ \d+% \d+%$/);
    const [h] = result.split(' ').map(v => parseInt(v));
    // Naranja: H ≈ 24
    expect(h).toBeGreaterThan(15);
    expect(h).toBeLessThan(35);
  });
});
