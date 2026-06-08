/**
 * Pruebas unitarias para la lógica de autenticación.
 * Módulo: Autenticación y seguridad de MecanicaPro
 * 
 * Se prueban:
 * - Validación de formato de email
 * - Lógica de hash de contraseñas (bcrypt)
 * - Reglas de roles y permisos
 * - Sanitización de inputs
 */

import * as bcrypt from 'bcryptjs';
import type { Role } from '../types';

// ============================================================
// LÓGICA EXTRAÍDA PARA PRUEBAS
// ============================================================

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isPasswordStrong(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una mayúscula.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un número.' };
  }
  return { valid: true, message: 'Contraseña segura.' };
}

/** Roles con acceso total al sistema */
const ADMIN_ROLES: Role[] = ['SuperAdmin', 'TallerAdmin'];

/** Roles con acceso limitado */
const EMPLOYEE_ROLES: Role[] = ['Mechanic', 'Recepcionista'];

function canManageWorkshop(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}

function canCreateOrders(role: Role): boolean {
  return role !== 'Mechanic'; // Mecánicos solo ejecutan, no crean
}

function canDeleteClients(role: Role): boolean {
  return role === 'SuperAdmin' || role === 'TallerAdmin';
}

function canAccessCRM(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}

function isHashedPassword(stored: string): boolean {
  return stored.startsWith('$2');
}

// ============================================================
// PRUEBAS
// ============================================================

describe('Sanitización de Email', () => {
  it('debería convertir a minúsculas', () => {
    expect(sanitizeEmail('ADMIN@MECANICAPRO.COM')).toBe('admin@mecanicapro.com');
  });

  it('debería eliminar espacios al inicio y final', () => {
    expect(sanitizeEmail('  user@test.com  ')).toBe('user@test.com');
  });

  it('debería manejar emails mixtos', () => {
    expect(sanitizeEmail(' Admin.User@Company.CO ')).toBe('admin.user@company.co');
  });
});

describe('Validación de Formato de Email', () => {
  it('debería aceptar un email válido', () => {
    expect(isValidEmail('usuario@mecanicapro.com')).toBe(true);
  });

  it('debería aceptar email con subdominio', () => {
    expect(isValidEmail('admin@taller.mecanicapro.com')).toBe(true);
  });

  it('debería rechazar email sin @', () => {
    expect(isValidEmail('usuariomecanicapro.com')).toBe(false);
  });

  it('debería rechazar email sin dominio', () => {
    expect(isValidEmail('usuario@')).toBe(false);
  });

  it('debería rechazar email con espacios', () => {
    expect(isValidEmail('usuario @test.com')).toBe(false);
  });

  it('debería rechazar string vacío', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('Fortaleza de Contraseña', () => {
  it('debería aceptar una contraseña fuerte', () => {
    const result = isPasswordStrong('Segura123');
    expect(result.valid).toBe(true);
  });

  it('debería rechazar contraseña corta', () => {
    const result = isPasswordStrong('Ab1');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('6 caracteres');
  });

  it('debería rechazar contraseña sin mayúscula', () => {
    const result = isPasswordStrong('segura123');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('mayúscula');
  });

  it('debería rechazar contraseña sin número', () => {
    const result = isPasswordStrong('SeguraSinNumero');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('número');
  });
});

describe('Bcrypt - Hashing de Contraseñas', () => {
  it('debería generar un hash válido', async () => {
    const password = 'MiContraseña123';
    const hash = await bcrypt.hash(password, 10);
    expect(hash).toBeDefined();
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('debería verificar correctamente una contraseña válida', async () => {
    const password = 'TestPassword1';
    const hash = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it('debería rechazar una contraseña incorrecta', async () => {
    const hash = await bcrypt.hash('CorrectPassword1', 10);
    const isValid = await bcrypt.compare('WrongPassword2', hash);
    expect(isValid).toBe(false);
  });

  it('debería generar hashes diferentes para la misma contraseña (salt)', async () => {
    const password = 'SamePassword1';
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);
    expect(hash1).not.toBe(hash2);
  });
});

describe('Detección de Tipo de Contraseña Almacenada', () => {
  it('debería detectar hash bcrypt', () => {
    expect(isHashedPassword('$2a$10$abcdefghijklmnopqrstuuA')).toBe(true);
    expect(isHashedPassword('$2b$10$xyz')).toBe(true);
  });

  it('debería detectar contraseña en texto plano', () => {
    expect(isHashedPassword('admin123')).toBe(false);
    expect(isHashedPassword('MiPassword')).toBe(false);
  });
});

describe('Control de Acceso Basado en Roles (RBAC)', () => {
  describe('Gestión de Taller', () => {
    it('SuperAdmin puede gestionar talleres', () => {
      expect(canManageWorkshop('SuperAdmin')).toBe(true);
    });

    it('TallerAdmin puede gestionar su taller', () => {
      expect(canManageWorkshop('TallerAdmin')).toBe(true);
    });

    it('Mechanic NO puede gestionar talleres', () => {
      expect(canManageWorkshop('Mechanic')).toBe(false);
    });

    it('Recepcionista NO puede gestionar talleres', () => {
      expect(canManageWorkshop('Recepcionista')).toBe(false);
    });
  });

  describe('Creación de Órdenes', () => {
    it('SuperAdmin puede crear órdenes', () => {
      expect(canCreateOrders('SuperAdmin')).toBe(true);
    });

    it('TallerAdmin puede crear órdenes', () => {
      expect(canCreateOrders('TallerAdmin')).toBe(true);
    });

    it('Recepcionista puede crear órdenes', () => {
      expect(canCreateOrders('Recepcionista')).toBe(true);
    });

    it('Mechanic NO puede crear órdenes', () => {
      expect(canCreateOrders('Mechanic')).toBe(false);
    });
  });

  describe('Eliminación de Clientes', () => {
    it('SuperAdmin puede eliminar clientes', () => {
      expect(canDeleteClients('SuperAdmin')).toBe(true);
    });

    it('TallerAdmin puede eliminar clientes', () => {
      expect(canDeleteClients('TallerAdmin')).toBe(true);
    });

    it('Mechanic NO puede eliminar clientes', () => {
      expect(canDeleteClients('Mechanic')).toBe(false);
    });

    it('Recepcionista NO puede eliminar clientes', () => {
      expect(canDeleteClients('Recepcionista')).toBe(false);
    });
  });

  describe('Acceso al CRM', () => {
    it('Solo administradores pueden acceder al CRM', () => {
      expect(canAccessCRM('SuperAdmin')).toBe(true);
      expect(canAccessCRM('TallerAdmin')).toBe(true);
      expect(canAccessCRM('Mechanic')).toBe(false);
      expect(canAccessCRM('Recepcionista')).toBe(false);
    });
  });
});
