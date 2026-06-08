
# MecanicaPro: Ecosistema Inteligente de Gestión Automotriz & CRM Postventa

## 1. Título del Proyecto
**MecanicaPro: Plataforma SaaS de Excelencia Operativa y CRM Predictivo.**

## 2. Guía de Configuración para Visual Studio Code (Desarrollo Local)
Para trabajar en este proyecto desde tu entorno local, sigue estos pasos de ingeniería:

### 2.1. Requisitos Previos
*   **Node.js (v18 o superior):** El motor que corre el bólido.
*   **Git:** Para el control de versiones.
*   **Neon.tech:** Una cuenta activa para tu base de datos PostgreSQL.

### 2.2. Instalación en 3 Pasos
1.  **Clonar e Instalar:** Abre la terminal en VS Code y ejecuta:
    ```bash
    npm install
    ```
2.  **Configurar Variables de Entorno:** Crea un archivo llamado `.env` en la raíz del proyecto y pega tu cadena de conexión de Neon:
    ```env
    DATABASE_URL="postgresql://usuario:password@ep-host-name.aws.neon.tech/neondb?sslmode=require"
    ```
3.  **Encender el Motor:** Lanza el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    El sistema estará disponible en `http://localhost:3000`.

### 2.3. Extensiones Recomendadas en VS Code
*   **Tailwind CSS IntelliSense:** Para autocompletado de estilos.
*   **ESLint:** Para mantener la limpieza del código.
*   **Prettier:** Para formateo automático de documentos.
*   **Drizzle Studio:** (Opcional) Ejecuta `npx drizzle-kit studio` para ver tus datos de Neon de forma visual.

---

## 3. Documentación Maestra (Memoria Técnica)
Si necesitas acceder al informe completo del proyecto para el primer corte (Introducción, Metodología, Requisitos, etc.), consulta el siguiente archivo:
👉 **[INFORME_PROYECTO.md](./docs/INFORME_PROYECTO.md)**

---

## 4. Arquitectura de Datos Global (Neon + Drizzle)
MecanicaPro utiliza un motor de datos de última generación diseñado para la alta disponibilidad en talleres:

*   **Motor de Base de Datos:** PostgreSQL alojado en **Neon.tech**.
*   **Capa de Acceso (ORM):** **Drizzle ORM**.
*   **Conectividad:** Túnel seguro configurado en `src/lib/db.ts`.

---

## 5. Módulos del Sistema
*   **Gestión Operativa:** Tablero Kanban (Abierta -> Diagnóstico -> Reparación -> Lista -> Cerrada).
*   **CRM Postventa:** Detección automática de clientes inactivos (> 6 meses).
*   **Almacenes de Precisión:** Alertas de stock crítico y sincronización con órdenes.
*   **Agenda Técnica:** Validación de colisión de horarios para citas.
*   **Facturación Digital:** Generación automática de comprobantes PDF certificados.

---
**MecanicaPro** - Ingeniería aplicada a la excelencia operativa automotriz.

