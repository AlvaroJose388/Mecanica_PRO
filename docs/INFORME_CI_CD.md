# INFORME DE INTEGRACIÓN CONTINUA Y PRUEBAS DE SOFTWARE

## MecanicaPro - Ecosistema Inteligente de Gestión Automotriz

**Materia:** Electiva Profesional en Ingeniería de Software  
**Institución:** CECAR - Corporación Universitaria del Caribe  
**Fecha:** Junio 2026

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Marco Teórico](#2-marco-teórico)
3. [Herramientas Utilizadas](#3-herramientas-utilizadas)
4. [Configuración del Control de Versiones (Git y GitHub)](#4-configuración-del-control-de-versiones-git-y-github)
5. [Estrategia de Ramas con Gitflow](#5-estrategia-de-ramas-con-gitflow)
6. [Configuración de Integración Continua (GitHub Actions)](#6-configuración-de-integración-continua-github-actions)
7. [Configuración del Framework de Pruebas](#7-configuración-del-framework-de-pruebas)
8. [Pruebas Unitarias Implementadas](#8-pruebas-unitarias-implementadas)
9. [Ejecución del Pipeline CI](#9-ejecución-del-pipeline-ci)
10. [Product Backlog y Historias de Usuario](#10-product-backlog-y-historias-de-usuario)
11. [Sprint Backlog](#11-sprint-backlog)
12. [Resultados y Evidencias](#12-resultados-y-evidencias)
13. [Conclusiones](#13-conclusiones)
14. [Bibliografía](#14-bibliografía)

---

## 1. Introducción

El presente informe documenta la implementación de un sistema de **Integración Continua (CI)** para el proyecto MecanicaPro, una plataforma SaaS de gestión para talleres mecánicos. La integración continua es una práctica de desarrollo de software donde los miembros de un equipo integran su trabajo frecuentemente, verificando cada integración mediante compilación automatizada y pruebas para detectar errores lo antes posible.

El objetivo principal es demostrar cómo la automatización del ciclo Build → Lint → TypeCheck → Test mejora la calidad del software y reduce los tiempos de detección de errores en el desarrollo colaborativo.

---

## 2. Marco Teórico

### 2.1 ¿Qué es la Integración Continua?

La Integración Continua (CI) es una práctica de desarrollo de software en la que los desarrolladores fusionan frecuentemente sus cambios de código en un repositorio compartido, desencadenando automáticamente procesos de construcción y prueba. El ciclo típico es:

```
Build → Unit Tests → Deploy to Stage → Acceptance Tests
(auto)      (auto)         (auto)            (auto)
```

### 2.2 Beneficios de la Integración Continua

- **Detección temprana de errores:** Los problemas se identifican minutos después de introducirse.
- **Reducción del riesgo:** Integraciones más pequeñas y frecuentes son más fáciles de depurar.
- **Confianza en el código:** Cada commit ha sido verificado automáticamente.
- **Documentación viva:** El pipeline CI sirve como documentación del proceso de calidad.

### 2.3 Metodología Ágil (Scrum)

El proyecto se desarrolla bajo el marco de trabajo Scrum, que incluye:
- **Product Backlog:** Lista priorizada de funcionalidades.
- **Sprint Backlog:** Subconjunto del backlog para un sprint específico.
- **Historias de Usuario:** Requisitos escritos desde la perspectiva del usuario.
- **Sprints:** Iteraciones de desarrollo de 2 semanas.

### 2.4 Pruebas de Software

Las pruebas implementadas incluyen:
- **Pruebas Unitarias:** Verifican funciones individuales aisladas.
- **Pruebas de Integración:** Verifican la interacción entre módulos.
- **Análisis Estático:** ESLint y TypeScript verifican el código sin ejecutarlo.

---

## 3. Herramientas Utilizadas

| Herramienta | Versión | Propósito |
|---|---|---|
| **Git** | 2.x | Sistema de control de versiones distribuido |
| **GitHub** | - | Gestor de repositorio y plataforma CI/CD |
| **GitHub Actions** | v4 | Motor de integración continua |
| **Node.js** | 20.x | Entorno de ejecución JavaScript |
| **Next.js** | 15.3.8 | Framework de React para la aplicación |
| **TypeScript** | 5.x | Superset de JavaScript con tipado estático |
| **Jest** | 29.x | Framework de pruebas unitarias |
| **ESLint** | - | Linter para análisis de código estático |
| **npm** | 10.x | Gestor de paquetes y scripts |

### 3.1 ¿Por qué Git?

Git es un sistema de control de versiones distribuido que permite:
- **Guardar trabajo avanzado** mediante commits incrementales.
- **Coordinar trabajo** entre múltiples desarrolladores.
- **Manejar versiones** de la aplicación con tags y ramas.
- **Conciliar conflictos** en cambios simultáneos sobre un mismo archivo.

### 3.2 ¿Por qué GitHub?

GitHub es un servicio web basado en Git que ofrece:
- Repositorios remotos con acceso controlado.
- Pull Requests para revisión de código.
- GitHub Actions para CI/CD integrado.
- Issues y Projects para gestión de tareas.

### 3.3 ¿Por qué GitHub Actions?

GitHub Actions es la plataforma de CI/CD nativa de GitHub que permite:
- Definir pipelines como código (YAML).
- Ejecución automática en push/pull request.
- Paralelización de jobs.
- Cacheo de dependencias para velocidad.

---

## 4. Configuración del Control de Versiones (Git y GitHub)

### 4.1 Inicialización del Repositorio

```bash
# Inicializar repositorio Git local
git init

# Descripción: Crea un nuevo repositorio Git en el directorio actual.
# Genera la carpeta .git con la configuración del repositorio.
```

### 4.2 Configuración Inicial

```bash
# Configurar identidad del desarrollador
git config user.name "NombreDesarrollador"
git config user.email "correo@ejemplo.com"

# Descripción: Establece la identidad que aparecerá en cada commit.
```

### 4.3 Agregar Archivos al Staging

```bash
# Agregar todos los archivos al área de staging
git add .

# Descripción: Prepara TODOS los archivos modificados para el próximo commit.
# El punto (.) indica que se agregan todos los archivos del directorio.
```

### 4.4 Realizar Commit

```bash
# Crear un commit con mensaje descriptivo
git commit -m "feat: configuración inicial del proyecto MecanicaPro"

# Descripción: Guarda una instantánea del estado actual del código.
# El flag -m permite escribir el mensaje directamente en el comando.
```

### 4.5 Conectar con GitHub

```bash
# Agregar repositorio remoto
git remote add origin https://github.com/usuario/mecanicapro.git

# Descripción: Vincula el repositorio local con el repositorio en GitHub.
# 'origin' es el nombre convencional para el repositorio remoto principal.
```

### 4.6 Push al Repositorio Remoto

```bash
# Enviar cambios al repositorio remoto
git push -u origin main

# Descripción: Sube los commits locales a GitHub.
# El flag -u configura 'origin/main' como upstream para futuros push.
```

---

## 5. Estrategia de Ramas con Gitflow

### 5.1 Estructura de Ramas

Se implementa el modelo **Gitflow** para simular un entorno de desarrollo real y profesional:

```
main (producción)
│
├── develop (desarrollo)
│   │
│   ├── feature/gestion-ordenes
│   ├── feature/modulo-inventario
│   ├── feature/sistema-autenticacion
│   └── feature/ci-pipeline
│
├── release/v1.0.0
│
└── hotfix/fix-login-bug
```

### 5.2 Descripción de las Ramas

| Rama | Propósito | Protección |
|---|---|---|
| `main` | Código en producción estable | Requiere PR + CI verde |
| `develop` | Integración de features | Requiere CI verde |
| `feature/*` | Desarrollo de funcionalidades | Libre para push |
| `release/*` | Preparación de versiones | Requiere aprobación |
| `hotfix/*` | Correcciones urgentes en producción | Requiere CI verde |

### 5.3 Comandos de Gitflow

```bash
# Crear rama de desarrollo desde main
git checkout -b develop
git push -u origin develop
# Descripción: Crea la rama principal de desarrollo.

# Crear rama de feature
git checkout -b feature/ci-pipeline develop
# Descripción: Crea una rama para desarrollar la funcionalidad de CI.
# Se parte desde develop para tener el código más reciente.

# Trabajar en la feature y hacer commits
git add .
git commit -m "feat(ci): configurar Jest para pruebas unitarias"
git commit -m "feat(ci): agregar workflow de GitHub Actions"
git commit -m "test: agregar pruebas unitarias de validadores"

# Terminar feature: merge a develop
git checkout develop
git merge --no-ff feature/ci-pipeline
# Descripción: Integra la feature en develop.
# --no-ff crea un commit de merge para preservar el historial.

git push origin develop

# Crear release
git checkout -b release/v1.0.0 develop
# Descripción: Prepara una nueva versión para producción.

# Finalizar release: merge a main y develop
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release versión 1.0.0"
git push origin main --tags
# Descripción: Marca la versión en producción con un tag.
```

---

## 6. Configuración de Integración Continua (GitHub Actions)

### 6.1 Archivo de Workflow (`.github/workflows/ci.yml`)

El pipeline de CI se define como código YAML y se ejecuta automáticamente en cada push a las ramas principales y en cada Pull Request:

```yaml
name: MecanicaPro CI Pipeline

on:
  push:
    branches: [main, develop, 'feature/**', 'hotfix/**', 'release/**']
  pull_request:
    branches: [main, develop]
```

### 6.2 Jobs del Pipeline

El pipeline consta de **5 jobs** ejecutados en orden:

| # | Job | Descripción | Dependencia |
|---|---|---|---|
| 1 | `install` | Instala y cachea dependencias npm | Ninguna |
| 2 | `lint` | Ejecuta ESLint para análisis estático | install |
| 3 | `typecheck` | Verifica tipos con TypeScript | install |
| 4 | `test` | Ejecuta pruebas unitarias con Jest | install |
| 5 | `build` | Compila la aplicación para producción | lint, typecheck, test |

### 6.3 Flujo de Ejecución

```
┌─────────────┐
│   install    │  ← npm ci (instala dependencias)
└──────┬──────┘
       │
       ├───────────────┬────────────────┐
       ▼               ▼                ▼
┌──────────┐   ┌────────────┐   ┌──────────┐
│   lint   │   │ typecheck  │   │   test   │  ← Jobs paralelos
└─────┬────┘   └──────┬─────┘   └────┬─────┘
      │               │              │
      └───────────────┼──────────────┘
                      ▼
              ┌──────────────┐
              │    build     │  ← Solo si todo pasa ✅
              └──────────────┘
```

### 6.4 Cacheo de Dependencias

Se utiliza `actions/cache@v4` para acelerar las ejecuciones:

```yaml
- name: Cachear node_modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
```

Esto reduce el tiempo de instalación de ~3 minutos a ~10 segundos en ejecuciones posteriores.

---

## 7. Configuración del Framework de Pruebas

### 7.1 Instalación de Dependencias de Testing

```bash
npm install --save-dev jest @types/jest ts-jest \
  @testing-library/react @testing-library/jest-dom \
  jest-environment-jsdom @testing-library/user-event

# Descripción: Instala Jest como framework de pruebas junto con
# las librerías necesarias para probar componentes React y
# simular un entorno de navegador (jsdom).
```

### 7.2 Configuración de Jest (`jest.config.js`)

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const config = {
  displayName: 'MecanicaPro',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/layout.tsx',
    '!src/**/page.tsx',
    '!src/ai/**',
  ],
};

module.exports = createJestConfig(config);
```

### 7.3 Scripts de npm para Testing

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --reporters=default"
  }
}
```

| Comando | Uso |
|---|---|
| `npm test` | Ejecutar todas las pruebas una vez |
| `npm run test:watch` | Modo observador (re-ejecuta al cambiar) |
| `npm run test:coverage` | Genera reporte de cobertura |
| `npm run test:ci` | Modo CI (sin interactividad) |

---

## 8. Pruebas Unitarias Implementadas

### 8.1 Estructura de Archivos de Pruebas

```
src/
└── lib/
    └── __tests__/
        ├── utils.test.ts          → Funciones utilitarias
        ├── validators.test.ts     → Reglas de negocio
        ├── auth-logic.test.ts     → Autenticación y RBAC
        └── inventory-logic.test.ts → Lógica de inventario
```

### 8.2 Suite: Funciones Utilitarias (`utils.test.ts`)

**Función probada:** `cn()` - Combinador de clases CSS con Tailwind Merge  
**Función probada:** `hexToHsl()` - Conversor de color hexadecimal a HSL

| Test | Resultado |
|---|---|
| Combinar múltiples clases simples | ✅ PASS |
| Resolver conflictos de tailwind | ✅ PASS |
| Manejar clases condicionales | ✅ PASS |
| Ignorar valores falsy | ✅ PASS |
| Convertir #000000 (negro) | ✅ PASS |
| Convertir #FF0000 (rojo) | ✅ PASS |
| Manejar hex inválido | ✅ PASS |

**Total: 15 tests**

### 8.3 Suite: Validadores de Negocio (`validators.test.ts`)

**Reglas probadas:**
- Transición de estados de órdenes (Kanban)
- Validación de datos de clientes
- Validación de artículos de inventario
- Cálculo de totales de órdenes
- Verificación de stock disponible

| Categoría | Tests | Resultado |
|---|---|---|
| Transiciones válidas de estado | 6 | ✅ PASS |
| Transiciones inválidas (retroceso) | 5 | ✅ PASS |
| Validación de cliente | 6 | ✅ PASS |
| Validación de inventario | 4 | ✅ PASS |
| Cálculo de total de orden | 5 | ✅ PASS |
| Validación de stock | 5 | ✅ PASS |

**Total: 31 tests**

### 8.4 Suite: Autenticación y RBAC (`auth-logic.test.ts`)

**Reglas probadas:**
- Sanitización de emails
- Validación de formato de email
- Fortaleza de contraseñas
- Hashing con bcrypt
- Control de Acceso Basado en Roles (RBAC)

| Categoría | Tests | Resultado |
|---|---|---|
| Sanitización de email | 3 | ✅ PASS |
| Formato de email | 6 | ✅ PASS |
| Fortaleza de contraseña | 4 | ✅ PASS |
| Bcrypt (hash/verify) | 4 | ✅ PASS |
| Detección de tipo de password | 2 | ✅ PASS |
| RBAC - Gestión de taller | 4 | ✅ PASS |
| RBAC - Creación de órdenes | 4 | ✅ PASS |
| RBAC - Eliminación de clientes | 4 | ✅ PASS |
| RBAC - Acceso al CRM | 1 | ✅ PASS |

**Total: 32 tests**

### 8.5 Suite: Lógica de Inventario (`inventory-logic.test.ts`)

**Reglas probadas:**
- Alertas de stock bajo
- Conversión de precios (DB ↔ App)
- Generación de SKU
- Deducción de stock
- Cálculo de valor total del inventario
- Identificación de items para restock
- Formato de moneda (COP)

| Categoría | Tests | Resultado |
|---|---|---|
| Niveles de alerta de stock | 5 | ✅ PASS |
| Conversión de precios | 5 | ✅ PASS |
| Generación de SKU | 3 | ✅ PASS |
| Deducción de stock | 4 | ✅ PASS |
| Valor total inventario | 3 | ✅ PASS |
| Items para restock | 3 | ✅ PASS |
| Formato de moneda | 3 | ✅ PASS |

**Total: 26 tests**

---

## 9. Ejecución del Pipeline CI

### 9.1 Ejecución Local

```bash
# 1. Ejecutar linting
npm run lint
# Verifica reglas de estilo y errores de código.

# 2. Ejecutar verificación de tipos
npm run typecheck
# TypeScript verifica que no haya errores de tipos.

# 3. Ejecutar pruebas unitarias
npm test
# Jest ejecuta las 104 pruebas unitarias.

# 4. Build de producción
npm run build
# Compila la aplicación Next.js para producción.
```

### 9.2 Ejecución Automática (GitHub Actions)

Al hacer `git push`, el pipeline se activa automáticamente:

```bash
# Flujo completo para subir cambios
git add .
git commit -m "feat: implementar módulo de inventario"
git push origin feature/modulo-inventario
# → Esto activa automáticamente el pipeline CI en GitHub Actions
```

### 9.3 Resultado de la Ejecución

```
Test Suites: 4 passed, 4 total
Tests:       104 passed, 104 total
Snapshots:   0 total
Time:        7.763 s
```

---

## 10. Product Backlog y Historias de Usuario

### 10.1 Product Backlog

| ID | Historia de Usuario | Prioridad | Sprint | Estado |
|---|---|---|---|---|
| US-01 | Autenticación segura por roles | Alta | 1 | ✅ Completada |
| US-02 | Gestión de talleres (SuperAdmin) | Alta | 1 | ✅ Completada |
| US-03 | Gestión de órdenes en Kanban | Alta | 1 | ✅ Completada |
| US-04 | Control de inventario con alertas | Alta | 2 | ✅ Completada |
| US-05 | Gestión de clientes y vehículos | Media | 2 | ✅ Completada |
| US-06 | Sistema de facturación PDF | Media | 2 | ✅ Completada |
| US-07 | Agendamiento de citas | Media | 3 | ✅ Completada |
| US-08 | Chat interno entre talleres | Media | 3 | ✅ Completada |
| US-09 | CRM predictivo | Baja | 3 | ✅ Completada |
| US-10 | Pipeline de Integración Continua | Alta | 4 | ✅ Completada |
| US-11 | Pruebas unitarias del sistema | Alta | 4 | ✅ Completada |
| US-12 | Configuración de Gitflow | Media | 4 | ✅ Completada |

### 10.2 Historias de Usuario Detalladas (Sprint 4 - CI/CD)

#### US-10: Pipeline de Integración Continua

**Como** líder técnico del equipo  
**Quiero** que cada push al repositorio active un pipeline automático de verificación  
**Para** detectar errores de compilación, estilo y lógica antes de integrar el código a la rama principal.

**Criterios de Aceptación:**
- ✅ El pipeline se activa automáticamente en cada push a main, develop y feature/*
- ✅ Se ejecuta linting con ESLint
- ✅ Se ejecuta verificación de tipos con TypeScript
- ✅ Se ejecutan pruebas unitarias con Jest
- ✅ Solo se compila el build si todos los pasos anteriores pasan
- ✅ Se genera reporte de cobertura como artefacto

**Tareas:**
1. Crear archivo `.github/workflows/ci.yml`
2. Configurar jobs paralelos (lint, typecheck, test)
3. Configurar cacheo de node_modules
4. Configurar upload de artefactos de cobertura

---

#### US-11: Pruebas Unitarias del Sistema

**Como** desarrollador  
**Quiero** contar con pruebas unitarias automatizadas para las reglas de negocio  
**Para** asegurar que los cambios futuros no rompan la funcionalidad existente.

**Criterios de Aceptación:**
- ✅ Se configuró Jest como framework de pruebas
- ✅ Se implementaron pruebas para el módulo de utilidades
- ✅ Se implementaron pruebas para las reglas de transición de estados
- ✅ Se implementaron pruebas para la lógica de autenticación y RBAC
- ✅ Se implementaron pruebas para la lógica de inventario
- ✅ Todas las pruebas pasan exitosamente (104/104)

**Tareas:**
1. Instalar Jest, @testing-library, ts-jest
2. Crear `jest.config.js` con configuración de Next.js
3. Implementar pruebas de funciones utilitarias (15 tests)
4. Implementar pruebas de validadores de negocio (31 tests)
5. Implementar pruebas de autenticación y RBAC (32 tests)
6. Implementar pruebas de lógica de inventario (26 tests)

---

#### US-12: Configuración de Gitflow

**Como** equipo de desarrollo  
**Queremos** seguir una estrategia de ramas profesional (Gitflow)  
**Para** mantener el código organizado, facilitar el trabajo en paralelo y controlar las versiones.

**Criterios de Aceptación:**
- ✅ Se definieron las ramas: main, develop, feature/*, release/*, hotfix/*
- ✅ Se documentaron los comandos para cada flujo
- ✅ El pipeline CI se activa en todas las ramas relevantes

**Tareas:**
1. Crear rama `develop` desde `main`
2. Documentar flujo de trabajo con Gitflow
3. Configurar pipeline CI para todas las ramas del modelo

---

## 11. Sprint Backlog

### Sprint 4: Integración Continua y Pruebas

| Tarea | Responsable | Estimación | Estado |
|---|---|---|---|
| Instalar dependencias de testing (Jest) | Dev 1 | 1h | ✅ |
| Configurar `jest.config.js` | Dev 1 | 1h | ✅ |
| Escribir pruebas de `utils.ts` | Dev 1 | 2h | ✅ |
| Escribir pruebas de validadores | Dev 2 | 3h | ✅ |
| Escribir pruebas de autenticación | Dev 2 | 3h | ✅ |
| Escribir pruebas de inventario | Dev 3 | 3h | ✅ |
| Crear workflow de GitHub Actions | Dev 1 | 2h | ✅ |
| Configurar Gitflow y documentar | Dev 3 | 2h | ✅ |
| Redactar informe del proceso | Todos | 4h | ✅ |

**Velocidad del Sprint:** 21 puntos de historia completados.

---

## 12. Resultados y Evidencias

### 12.1 Resultado de las Pruebas

```
 PASS  src/lib/__tests__/utils.test.ts           (15 tests)
 PASS  src/lib/__tests__/validators.test.ts      (31 tests)
 PASS  src/lib/__tests__/auth-logic.test.ts      (32 tests)
 PASS  src/lib/__tests__/inventory-logic.test.ts (26 tests)

Test Suites: 4 passed, 4 total
Tests:       104 passed, 104 total
Time:        7.763 s
```

### 12.2 Cobertura de Código

Las pruebas cubren las siguientes áreas críticas:
- **Funciones utilitarias:** 100% de `cn()` y `hexToHsl()`
- **Reglas de transición de estados:** 100% de las combinaciones válidas e inválidas
- **Autenticación:** Validación de email, hashing bcrypt, RBAC completo
- **Inventario:** Alertas de stock, cálculos financieros, SKU

### 12.3 Estructura Final del Proyecto

```
MecanicaPro/
├── .github/
│   └── workflows/
│       └── ci.yml              ← Pipeline de CI
├── src/
│   ├── lib/
│   │   ├── __tests__/          ← Pruebas unitarias
│   │   │   ├── utils.test.ts
│   │   │   ├── validators.test.ts
│   │   │   ├── auth-logic.test.ts
│   │   │   └── inventory-logic.test.ts
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   └── db.ts
│   └── app/
│       └── ...                 ← Módulos de la aplicación
├── jest.config.js              ← Configuración de Jest
├── jest.setup.ts               ← Setup de testing
├── package.json                ← Scripts actualizados
└── docs/
    └── INFORME_CI_CD.md        ← Este documento
```

---

## 13. Conclusiones

1. **La Integración Continua mejora la calidad del software:** Al automatizar las verificaciones en cada push, se detectan errores de tipado, estilo y lógica en minutos en lugar de días.

2. **Las pruebas unitarias son la primera línea de defensa:** Con 104 pruebas cubriendo las reglas de negocio críticas (transición de estados, RBAC, inventario), se garantiza que cambios futuros no rompan funcionalidad existente.

3. **Gitflow organiza el trabajo en equipo:** La estrategia de ramas permite que múltiples desarrolladores trabajen simultáneamente sin conflictos, con un flujo claro hacia producción.

4. **La automatización reduce el factor humano:** El pipeline CI elimina la posibilidad de olvidar ejecutar pruebas o linting antes de integrar código.

5. **GitHub Actions es una herramienta accesible:** Su integración nativa con GitHub y la definición de pipelines como código (YAML) facilita la implementación de CI/CD sin infraestructura adicional.

---

## 14. Bibliografía

- Fowler, M. (2006). *Continuous Integration*. https://martinfowler.com/articles/continuousIntegration.html
- GitHub. (2024). *GitHub Actions Documentation*. https://docs.github.com/en/actions
- Jest. (2024). *Jest Documentation*. https://jestjs.io/docs/getting-started
- Driessen, V. (2010). *A successful Git branching model*. https://nvie.com/posts/a-successful-git-branching-model/
- Schwaber, K., & Sutherland, J. (2020). *The Scrum Guide*. https://scrumguides.org/
- Next.js. (2024). *Testing with Jest*. https://nextjs.org/docs/app/testing/jest
- TypeScript. (2024). *TypeScript Documentation*. https://www.typescriptlang.org/docs/
