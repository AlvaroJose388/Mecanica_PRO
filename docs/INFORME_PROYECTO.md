# 🔧 MecanicaPro: Ecosistema Inteligente de Gestión Automotriz & CRM Predictivo

**Presentado por:**
- Luis Daniel Herrera Pérez
- Álvaro José Prasca Ramos
- Brayan Alfonso Contreras Ustate

**Docente:** Laudyt María Lambráño Pérez

> Corporación Universitaria del Caribe – CECAR  
> Facultad de Ciencias Básicas, Ingeniería y Arquitectura  
> Ingeniería de Sistemas · Sincelejo, Sucre · 2025

---

## 📋 Tabla de Contenido

1. [Introducción](#1-introducción)
2. [Descripción de la Problemática](#2-descripción-de-la-problemática)
3. [Alcance del Proyecto](#3-alcance-del-proyecto)
4. [Metodología de Desarrollo del Software](#4-metodología-de-desarrollo-del-software)
5. [Requisitos del Sistema](#5-requisitos-del-sistema)
6. [Historias de Usuario](#6-historias-de-usuario)
7. [Product Backlog](#7-product-backlog)
8. [Sprint Backlog](#8-sprint-backlog)
9. [Conclusión](#9-conclusión)
10. [Referencias](#10-referencias)

---

## Resumen

MecanicaPro es una plataforma SaaS (Software como Servicio) diseñada para modernizar y profesionalizar la gestión de talleres mecánicos mediante la integración de análisis de datos y gestión operativa de alta precisión. Este documento expone los fundamentos conceptuales del proyecto, la problemática del sector, el alcance del sistema, la metodología de desarrollo empleada, los requisitos funcionales y no funcionales, así como el Product Backlog.

La solución aborda cuatro desafíos críticos del sector: la informalidad operativa, la baja retención de clientes, el descontrol del inventario y la falta de agendamiento y comunicación con el cliente. Se concluye que la implementación de tecnologías como bases de datos serverless y un CRM predictivo basado en reglas de negocio representa una ventaja competitiva sostenible para los centros de servicio automotriz.

**Palabras clave:** gestión automotriz, SaaS, CRM predictivo, inventario, agendamiento de citas

**Abstract**

MecanicaPro is a SaaS platform designed to modernize and professionalize the management of automotive repair shops through the integration of data analytics and high-precision operational management. The solution addresses four critical challenges: operational informality, low customer retention, inventory mismanagement, and lack of appointment scheduling and customer communication.

**Keywords:** automotive management, SaaS, predictive CRM, inventory, appointment scheduling.

---

## 1. Introducción

El sector automotriz en Latinoamérica enfrenta una transformación digital sin precedentes, impulsada por la evolución tecnológica de los vehículos y las nuevas expectativas de los consumidores. Sin embargo, los talleres mecánicos independientes —que representan la mayor parte del mercado de mantenimiento y reparación— operan aún bajo metodologías predominantemente manuales o con herramientas ofimáticas básicas que limitan su rentabilidad, eficiencia y capacidad de crecimiento.

En este escenario nace **MecanicaPro**, un ecosistema SaaS diseñado específicamente para eliminar la brecha digital en pequeños y medianos centros de servicio automotriz. A diferencia de los softwares contables o administrativos genéricos disponibles en el mercado, MecanicaPro se enfoca en la optimización del flujo de trabajo y el seguimiento postventa, integrando módulos de gestión operativa (Kanban), control de inventario, CRM predictivo y facturación digital en una sola plataforma unificada.

---

## 2. Descripción de la Problemática

El mercado de mantenimiento automotriz independiente enfrenta una serie de desafíos estructurales que limitan su crecimiento y sostenibilidad a largo plazo.

### 2.1 Informalidad y Fragilidad Operativa

Una proporción significativa de los talleres mecánicos pequeños y medianos gestiona sus operaciones mediante registros manuales (cuadernos, facturas sueltas) o herramientas aisladas como hojas de cálculo no integradas. Esta práctica genera pérdida sistemática de información histórica, ausencia de trazabilidad en las órdenes de servicio y una alta vulnerabilidad operativa ante la rotación de personal.

### 2.2 Baja Retención de Clientes

La falta de un sistema de seguimiento postventa impide que el taller anticipe las necesidades del cliente. Como señalan Kotler y Armstrong (2018), el costo de adquirir un nuevo cliente es de cinco a siete veces mayor que el de retener a uno existente; por lo tanto, la fidelización se convierte en un factor crítico para la rentabilidad.

### 2.3 Descontrol de Inventario

La falta de sincronización entre las órdenes de trabajo y el stock de repuestos genera dos problemas simultáneos: detenciones operativas por desabastecimiento y pérdidas financieras por excedentes que no rotan. Según Chopra y Meindl (2016), una gestión deficiente del inventario puede representar entre el 25% y el 40% del costo operativo total en empresas de servicios.

### 2.4 Falta de Agendamiento y Comunicación con el Cliente

En la mayoría de los talleres independientes, los clientes deben llamar telefónicamente para consultar disponibilidad, sin garantía de que se registre formalmente su solicitud. No existe un mecanismo automatizado para confirmar ni recordar la cita, lo que deteriora la confianza del cliente y aumenta la carga operativa del personal administrativo.

---

## 3. Alcance del Proyecto

MecanicaPro comprende el desarrollo de una plataforma web integral con los siguientes módulos:

- **Gestión Operativa (Kanban):** Tablero digital con estados progresivos para órdenes de servicio: `Abierta → En Diagnóstico → En Reparación → Lista para Entregar → Cerrada`.
- **Logística e Inventario:** Control automatizado de stock con alertas configurables y sincronización en tiempo real con órdenes de trabajo.
- **CRM Predictivo:** Reglas de negocio basadas en umbrales de tiempo para anticipar mantenimientos recurrentes, con integración a la API de WhatsApp Business.
- **Módulo Financiero:** Gestión multisucursal, roles diferenciados (SuperAdmin, TallerAdmin, Mecánico, Recepcionista) y generación automática de facturas en PDF.
- **Agendamiento de Citas:** Registro de citas con notificación automática por WhatsApp para reducir inasistencias.

---

## 4. Metodología de Desarrollo del Software

El desarrollo de MecanicaPro sigue una metodología ágil basada en **Scrum**, adaptada a un entorno de integración y despliegue continuos (CI/CD).

### 4.1 Sprints de Desarrollo

Ciclos de trabajo de 1 a 2 semanas. Cada Sprint incluye Sprint Planning, Sprint Review y Sprint Retrospective (Rubin, 2013).

### 4.2 Arquitectura de Datos

- **Base de datos:** PostgreSQL serverless a través de Neon.
- **ORM:** Drizzle ORM con tipado TypeScript y migraciones declarativas.

### 4.3 Enfoque en UX Industrial

Diseño basado en los principios de usabilidad de Nielsen y Molich (1990), priorizando legibilidad en entornos de taller y reducción de la carga cognitiva del operario.

### 4.4 Validación de Protocolos de Negocio

Las reglas de negocio críticas se implementan en la capa de servidor mediante validaciones de estado (*server-side validation*), garantizando la integridad del proceso independientemente del dispositivo utilizado.

---

## 5. Requisitos del Sistema

### 5.1 Requisitos Funcionales

| ID | Descripción | Módulo |
|---|---|---|
| **RF-01** | Registro y acceso seguro mediante roles diferenciados: SuperAdmin, TallerAdmin y Mecánico, con control de permisos por nivel jerárquico. | Autenticación |
| **RF-02** | Crear, asignar y avanzar órdenes de servicio en un tablero visual con estados progresivos y bloqueos de integridad. | Gestión Operativa |
| **RF-03** | Identificar clientes con mantenimientos vencidos (más de 6 meses) y habilitar contacto directo vía WhatsApp. | CRM Predictivo |
| **RF-04** | Generar documentos PDF de venta con desglose de servicios, repuestos y totales listos para entregar al cliente. | Facturación |

*Tabla 1. Requisitos funcionales del sistema MecanicaPro.*

### 5.2 Requisitos No Funcionales

| ID | Descripción | Métrica de Validación |
|---|---|---|
| **RNF-01** | Toda comunicación entre cliente y servidor debe realizarse a través de túneles SSL/TLS encriptados. | Certificado SSL activo. Conexión cifrada con Neon DB. |
| **RNF-02** | La plataforma debe garantizar una disponibilidad del 99.9%, aprovechando la arquitectura serverless. | Monitoreo con uptime >= 99.9% mensual. |
| **RNF-03** | La base de datos debe gestionar múltiples sucursales sin degradación del rendimiento al escalar. | Pruebas de carga con 100+ usuarios concurrentes. |

*Tabla 2. Requisitos no funcionales del sistema MecanicaPro.*

---

## 6. Historias de Usuario

Cada historia sigue el formato Scrum: *"Como [rol], quiero [funcionalidad] para [beneficio]"*, con criterios de aceptación verificables y estimación en Story Points (escala Fibonacci).

**Equipo:** Luis Daniel Herrera · Álvaro José Prasca · Brayan Alfonso Contreras

---

<details>
<summary><strong>US-01 · Autenticación de usuarios por rol</strong> — Sprint 1 | 3 SP | ALTA</summary>

**Historia:** Como usuario registrado del sistema, quiero iniciar sesión con mis credenciales (correo y contraseña) para acceder únicamente a las funcionalidades correspondientes a mi rol asignado.

**Criterios de Aceptación:**
1. El sistema muestra una pantalla de inicio de sesión con campos de correo y contraseña.
2. Las credenciales se validan en la base de datos de forma segura.
3. El sistema redirige al usuario al módulo principal según su rol (SuperAdmin, TallerAdmin, Mecánico, Recepcionista).
4. Tras cinco intentos fallidos consecutivos, la cuenta se bloquea temporalmente por 15 minutos.
5. El sistema permite cerrar sesión de forma segura desde cualquier módulo.

</details>

---

<details>
<summary><strong>US-02 · Gestión de usuarios y asignación de roles</strong> — Sprint 1 | 5 SP | ALTA</summary>

**Historia:** Como SuperAdmin, quiero crear, editar, activar y desactivar cuentas de usuario asignándoles un rol específico para controlar el acceso al sistema según la jerarquía del personal.

**Criterios de Aceptación:**
1. El SuperAdmin puede crear un nuevo usuario con nombre, correo, contraseña y rol.
2. Se pueden asignar exactamente cuatro roles: SuperAdmin, TallerAdmin, Mecánico y Recepcionista.
3. Cada rol restringe el acceso a los módulos que no le corresponden.
4. El SuperAdmin puede desactivar una cuenta sin eliminarla.
5. Se muestra un listado paginable de todos los usuarios con su estado y rol.

</details>

---

<details>
<summary><strong>US-03 · Gestión de órdenes de servicio en tablero Kanban</strong> — Sprint 1 | 8 SP | ALTA</summary>

**Historia:** Como TallerAdmin o Mecánico, quiero crear, asignar y avanzar órdenes de servicio a través de un tablero Kanban con estados progresivos para garantizar la trazabilidad completa de cada intervención.

**Criterios de Aceptación:**
1. El sistema permite crear una orden con datos del cliente, vehículo (placa, marca, modelo), descripción del servicio y mecánico asignado.
2. Estados del Kanban: `Abierta → En Diagnóstico → En Reparación → Lista para Entregar → Cerrada`.
3. Solo se puede avanzar al siguiente estado; no se permiten saltos ni retrocesos sin autorización del TallerAdmin.
4. Cada cambio de estado queda registrado con fecha, hora y usuario responsable.
5. El tablero muestra visualmente las tarjetas agrupadas por estado con color diferenciado.

</details>

---

<details>
<summary><strong>US-04 · Generación automática de facturas en PDF</strong> — Sprint 1 | 5 SP | ALTA</summary>

**Historia:** Como TallerAdmin o Recepcionista, quiero generar una factura en formato PDF con un solo clic al momento de cerrar una orden de servicio para entregar un comprobante profesional al cliente.

**Criterios de Aceptación:**
1. La factura incluye: datos del taller, datos del cliente, servicios prestados, repuestos con precios unitarios, subtotal, IVA y total.
2. Se genera automáticamente al cerrar la orden de servicio.
3. El PDF puede descargarse o enviarse directamente al cliente.
4. Cada factura tiene un número de consecutivo único generado por el sistema.
5. Refleja exactamente los repuestos e insumos registrados en la orden.

</details>

---

<details>
<summary><strong>US-05 · Dashboard de indicadores financieros y operativos</strong> — Sprint 2 | 8 SP | ALTA</summary>

**Historia:** Como TallerAdmin, quiero visualizar en un tablero los ingresos del periodo, el número de órdenes activas, los mecánicos más productivos y el estado del inventario para tomar decisiones estratégicas basadas en datos.

**Criterios de Aceptación:**
1. El dashboard muestra KPIs en tiempo real: ingresos totales del mes, órdenes activas, órdenes cerradas y alertas de inventario.
2. Se pueden filtrar los datos por rango de fechas y por sucursal.
3. Los indicadores de ingresos se presentan en gráficos de barras comparativos por mes.
4. El panel muestra un ranking de mecánicos por número de órdenes completadas.
5. Los datos se actualizan automáticamente al cargar la página.

> **Nota:** Esta historia tiene prioridad ALTA pero se asigna al Sprint 2 porque depende de los datos generados por US-03 y US-04.

</details>

---

<details>
<summary><strong>US-06 · Registro y control de inventario de repuestos</strong> — Sprint 2 | 5 SP | MEDIA</summary>

**Historia:** Como Administrador, quiero registrar, editar y consultar el inventario de repuestos e insumos con sus cantidades disponibles y precios para mantener el stock actualizado en todo momento.

**Criterios de Aceptación:**
1. Registro de repuesto con: nombre, referencia, cantidad disponible, precio unitario y umbral de stock crítico.
2. Registro de entradas (compras) y salidas (uso en órdenes) con fecha y motivo.
3. El inventario muestra el saldo actual de cada repuesto tras cada movimiento.
4. Búsqueda de repuestos por nombre o referencia.
5. Historial completo de todos los movimientos de cada repuesto.

</details>

---

<details>
<summary><strong>US-07 · Alertas automáticas de stock crítico</strong> — Sprint 2 | 3 SP | MEDIA</summary>

**Historia:** Como Administrador, quiero que el sistema me notifique automáticamente cuando un repuesto alcance o supere el umbral de stock crítico configurado para gestionar las compras a tiempo.

**Criterios de Aceptación:**
1. Cada repuesto tiene un umbral de stock crítico configurable de forma individual.
2. Cuando el stock alcanza o baja del umbral, aparece una alerta visible en el panel principal.
3. Existe un listado de "Repuestos en alerta" accesible desde el módulo de inventario.
4. La alerta persiste hasta que se registre una entrada de stock que supere el umbral.

</details>

---

<details>
<summary><strong>US-08 · Sincronización automática de inventario con órdenes</strong> — Sprint 2 | 5 SP | MEDIA</summary>

**Historia:** Como Mecánico, quiero que al registrar los repuestos utilizados en una orden y cerrarla, el sistema descuente automáticamente dichas cantidades del inventario para evitar el registro manual duplicado.

**Criterios de Aceptación:**
1. Durante la creación o edición de una orden, el mecánico puede agregar repuestos utilizados con su cantidad.
2. Al cerrar la orden, el sistema descuenta automáticamente los repuestos del inventario.
3. Si un repuesto no tiene stock suficiente, el sistema alerta al usuario, pero no bloquea el cierre de la orden.
4. El descuento queda registrado en el historial de movimientos vinculado al número de orden.

</details>

---

<details>
<summary><strong>US-09 · Consulta de historial completo del vehículo</strong> — Sprint 2 | 5 SP | MEDIA</summary>

**Historia:** Como TallerAdmin o Mecánico, quiero consultar el historial completo de servicios, repuestos y fechas de intervención de un vehículo para asesorar mejor al cliente en futuras visitas.

**Criterios de Aceptación:**
1. El historial se puede buscar por número de placa o nombre del cliente.
2. Se muestra una lista cronológica de todas las órdenes de servicio del vehículo.
3. Cada entrada muestra: fecha, tipo de servicio, repuestos usados, mecánico responsable y costo total.
4. El historial es de solo lectura para los Mecánicos; el TallerAdmin puede agregar notas.

</details>

---

<details>
<summary><strong>US-10 · Registro y gestión de citas técnicas</strong> — Sprint 3 | 5 SP | MEDIA</summary>

**Historia:** Como Recepcionista, quiero registrar citas técnicas con datos del cliente, vehículo, fecha, hora y mecánico asignado para organizar la agenda del taller y evitar la doble reserva.

**Criterios de Aceptación:**
1. El formulario incluye: nombre del cliente, teléfono, placa del vehículo, tipo de servicio, fecha, hora y mecánico asignado.
2. El sistema verifica que no exista otra cita asignada al mismo mecánico en el mismo horario.
3. Las citas se visualizan en una vista de calendario semanal.
4. La Recepcionista puede editar o cancelar una cita existente.
5. Al registrar la cita, el estado inicial es "Confirmada".

</details>

---

<details>
<summary><strong>US-11 · Notificación de confirmación de cita por WhatsApp</strong> — Sprint 3 | 3 SP | MEDIA</summary>

**Historia:** Como Recepcionista, quiero que el sistema envíe automáticamente un mensaje de WhatsApp al cliente confirmando los datos de su cita para reducir inasistencias sin necesidad de llamadas manuales.

**Criterios de Aceptación:**
1. Al guardar una nueva cita, el sistema envía automáticamente un mensaje al número registrado del cliente.
2. El mensaje incluye: nombre del cliente, fecha y hora de la cita, nombre del taller y tipo de servicio.
3. El envío queda registrado en el sistema con marca de tiempo.
4. Si el envío falla, el sistema notifica a la Recepcionista para que contacte al cliente manualmente.

</details>

---

<details>
<summary><strong>US-12 · Identificación de clientes inactivos para CRM</strong> — Sprint 3 | 5 SP | MEDIA</summary>

**Historia:** Como TallerAdmin, quiero que el sistema identifique automáticamente los clientes que llevan más de un número configurable de meses sin visitar el taller para gestionarlos desde el módulo CRM.

**Criterios de Aceptación:**
1. El umbral de inactividad (en meses) es configurable; el valor predeterminado es 6 meses.
2. El sistema muestra un listado con: nombre, teléfono, última fecha de visita y días transcurridos.
3. El listado se puede filtrar por rango de inactividad y ordenar por fecha de última visita.
4. Desde el listado se puede acceder directamente al historial del cliente.

</details>

---

<details>
<summary><strong>US-13 · Envío de recordatorios de mantenimiento por WhatsApp</strong> — Sprint 3 | 3 SP | MEDIA</summary>

**Historia:** Como TallerAdmin, quiero enviar recordatorios de mantenimiento personalizados por WhatsApp a clientes inactivos para incrementar la retención y promover visitas recurrentes.

**Criterios de Aceptación:**
1. Desde el listado de clientes inactivos, se puede seleccionar uno o varios clientes y enviar un recordatorio.
2. El mensaje es personalizable con el nombre del cliente y el nombre del taller.
3. El sistema registra la fecha y hora de cada recordatorio enviado y lo asocia al perfil del cliente.
4. Se puede consultar el historial de recordatorios enviados por cliente.

</details>

---

<details>
<summary><strong>US-14 · Notificación automática de vehículo listo por WhatsApp</strong> — Sprint 3 | 3 SP | MEDIA</summary>

**Historia:** Como Mecánico o Recepcionista, quiero que al cambiar el estado de una orden a "Lista para Entregar" el sistema notifique automáticamente al cliente por WhatsApp para agilizar el retiro del vehículo.

**Criterios de Aceptación:**
1. Al avanzar una orden al estado "Lista para Entregar", se dispara automáticamente el envío de un mensaje de WhatsApp.
2. El mensaje incluye: nombre del cliente, placa del vehículo y nombre del taller.
3. El envío se registra en el historial de la orden con marca de tiempo.
4. Si el envío falla, se muestra una alerta en pantalla para que el personal contacte al cliente.

</details>

---

<details>
<summary><strong>US-15 · Gestión multisucursal desde panel unificado</strong> — Sprint 4 | 8 SP | BAJA</summary>

**Historia:** Como SuperAdmin, quiero crear y gestionar múltiples sucursales de taller desde un panel centralizado para supervisar las operaciones de toda la red desde un solo lugar.

**Criterios de Aceptación:**
1. El SuperAdmin puede crear una sucursal con: nombre, dirección y datos de contacto.
2. Los usuarios se asignan a una sucursal específica.
3. El panel muestra los KPIs de cada sucursal de forma comparativa (ingresos, órdenes, alertas).
4. Los datos de cada sucursal están aislados entre sí; un TallerAdmin solo ve los datos de su sucursal.

</details>

---

<details>
<summary><strong>US-16 · Generación y exportación de reportes de desempeño</strong> — Sprint 4 | 5 SP | BAJA</summary>

**Historia:** Como TallerAdmin o SuperAdmin, quiero generar reportes de ingresos, servicios más realizados y rendimiento de mecánicos por periodo de tiempo para análisis externo y toma de decisiones.

**Criterios de Aceptación:**
1. El sistema permite seleccionar el tipo de reporte: ingresos por periodo, servicios más frecuentes, rendimiento por mecánico.
2. Los reportes se pueden filtrar por rango de fechas y por sucursal.
3. Los reportes son exportables en formato PDF.
4. Los reportes incluyen gráficos de barras y tablas de resumen.

</details>

---

<details>
<summary><strong>US-17 · Pruebas de integración y despliegue a producción</strong> — Sprint 4 | 3 SP | BAJA</summary>

**Historia:** Como equipo de desarrollo, queremos ejecutar pruebas de integración completas y realizar el despliegue final del sistema para garantizar la entrega del producto en producción con calidad verificada.

**Criterios de Aceptación:**
1. Se ejecutan pruebas de integración cubriendo los flujos críticos de cada módulo.
2. Todos los errores críticos y de alta severidad son corregidos antes del despliegue.
3. El sistema queda desplegado en el entorno de producción y accesible para los usuarios.
4. Se entrega documentación técnica del entorno de producción.

</details>

---

## 7. Product Backlog

La priorización sigue un orden jerárquico: **ALTA** (valor crítico para el negocio) → **MEDIA** (alto impacto, extienden el valor) → **BAJA** (funcionalidades deseables para fases avanzadas). La estimación utiliza la escala de Fibonacci.

| ID | Título | Módulo | Prioridad | SP |
|---|---|---|:---:|:---:|
| US-01 | Autenticación de usuarios por rol | Autenticación | 🔴 ALTA | 3 |
| US-02 | Gestión de usuarios y asignación de roles | Control de Acceso | 🔴 ALTA | 5 |
| US-03 | Gestión de órdenes de servicio en tablero Kanban | Gestión Operativa | 🔴 ALTA | 8 |
| US-04 | Generación automática de facturas en PDF | Facturación | 🔴 ALTA | 5 |
| US-05 | Dashboard de indicadores financieros y operativos | Panel Administrativo | 🔴 ALTA | 8 |
| US-06 | Registro y control de inventario de repuestos | Inventario | 🟡 MEDIA | 5 |
| US-07 | Alertas automáticas de stock crítico | Inventario | 🟡 MEDIA | 3 |
| US-08 | Sincronización automática de inventario con órdenes | Inventario | 🟡 MEDIA | 5 |
| US-09 | Consulta de historial completo del vehículo | Historial del Vehículo | 🟡 MEDIA | 5 |
| US-10 | Registro y gestión de citas técnicas | Agendamiento | 🟡 MEDIA | 5 |
| US-11 | Notificación de confirmación de cita por WhatsApp | Agendamiento / CRM | 🟡 MEDIA | 3 |
| US-12 | Identificación de clientes inactivos para CRM | CRM Predictivo | 🟡 MEDIA | 5 |
| US-13 | Envío de recordatorios de mantenimiento por WhatsApp | CRM Predictivo | 🟡 MEDIA | 3 |
| US-14 | Notificación automática de vehículo listo por WhatsApp | CRM / Gestión Operativa | 🟡 MEDIA | 3 |
| US-15 | Gestión multisucursal desde panel unificado | Panel Administrativo | 🟢 BAJA | 8 |
| US-16 | Generación y exportación de reportes de desempeño | Panel Administrativo | 🟢 BAJA | 5 |
| US-17 | Pruebas de integración y despliegue a producción | Calidad y Despliegue | 🟢 BAJA | 3 |

> **Total Story Points del proyecto: 82 SP** distribuidos en 4 sprints de 2 semanas.

---

## 8. Sprint Backlog

El equipo trabaja en sprints de **2 semanas**. Duración total estimada: **8 semanas (4 sprints)**.

---

### Sprint 1 – Fundamentos: Autenticación, Kanban y Facturación

**Historias:** US-01 (3 SP) · US-02 (5 SP) · US-03 (8 SP) · US-04 (5 SP)

| # | US | Tarea | Responsable | Horas | Estado |
|---|---|---|---|:---:|:---:|
| 1 | US-01 | Diseño de pantalla de login y flujo de autenticación | Luis Daniel | 4 h | ⏳ Pendiente |
| 2 | US-01 | Implementación de validación de credenciales y JWT | Brayan | 6 h | ⏳ Pendiente |
| 3 | US-01 | Lógica de bloqueo por intentos fallidos | Brayan | 3 h | ⏳ Pendiente |
| 4 | US-02 | CRUD de usuarios en panel de administración | Luis Daniel | 6 h | ⏳ Pendiente |
| 5 | US-02 | Implementación del sistema de permisos por rol | Álvaro | 8 h | ⏳ Pendiente |
| 6 | US-03 | Diseño del tablero Kanban con columnas de estados | Luis Daniel | 8 h | ⏳ Pendiente |
| 7 | US-03 | Lógica de bloqueo de cambios de estado inválidos | Brayan | 6 h | ⏳ Pendiente |
| 8 | US-03 | Registro de auditoría de cambios de estado | Álvaro | 4 h | ⏳ Pendiente |
| 9 | US-04 | Generación de documento PDF con librería (jsPDF o similar) | Álvaro | 6 h | ⏳ Pendiente |
| 10 | US-04 | Plantilla de factura con desglose de ítems y totales | Luis Daniel | 4 h | ⏳ Pendiente |
| 11 | US-04 | Integración de descarga y envío de la factura | Brayan | 3 h | ⏳ Pendiente |

> **Total Sprint 1: 21 SP · 58 horas estimadas**

---

### Sprint 2 – Operaciones: Dashboard, Inventario e Historial

**Historias:** US-05 (8 SP) · US-06 (5 SP) · US-07 (3 SP) · US-08 (5 SP) · US-09 (5 SP)

| # | US | Tarea | Responsable | Horas | Estado |
|---|---|---|---|:---:|:---:|
| 1 | US-05 | Diseño del dashboard con componentes de gráficos (Chart.js) | Luis Daniel | 8 h | ⏳ Pendiente |
| 2 | US-05 | Endpoints de API para KPIs en tiempo real | Brayan | 6 h | ⏳ Pendiente |
| 3 | US-05 | Filtros de fecha y sucursal en el dashboard | Álvaro | 4 h | ⏳ Pendiente |
| 4 | US-06 | CRUD de repuestos con precio y umbral crítico | Álvaro | 5 h | ⏳ Pendiente |
| 5 | US-06 | Registro de movimientos de entrada y salida de inventario | Luis Daniel | 5 h | ⏳ Pendiente |
| 6 | US-07 | Lógica de evaluación de umbral crítico al registrar movimiento | Brayan | 4 h | ⏳ Pendiente |
| 7 | US-07 | Componente de alertas visible en el panel principal | Luis Daniel | 3 h | ⏳ Pendiente |
| 8 | US-08 | Formulario de repuestos dentro de la orden de servicio | Álvaro | 4 h | ⏳ Pendiente |
| 9 | US-08 | Trigger de descuento automático de inventario al cerrar orden | Brayan | 5 h | ⏳ Pendiente |
| 10 | US-09 | Endpoint y pantalla de búsqueda de historial por placa/cliente | Luis Daniel | 4 h | ⏳ Pendiente |
| 11 | US-09 | Vista detallada de cada entrada del historial del vehículo | Álvaro | 4 h | ⏳ Pendiente |
| 12 | US-09 | Diseño del esquema de BD para módulos de inventario e historial | Álvaro | 4 h | ⏳ Pendiente |
| 13 | US-05 | Testing unitario de los endpoints desarrollados en el Sprint 2 | Luis Daniel | 4 h | ⏳ Pendiente |

> **Total Sprint 2: 26 SP · 60 horas estimadas**

---

### Sprint 3 – Comunicación: Agendamiento, CRM y WhatsApp

**Historias:** US-10 (5 SP) · US-11 (3 SP) · US-12 (5 SP) · US-13 (3 SP) · US-14 (3 SP)

| # | US | Tarea | Responsable | Horas | Estado |
|---|---|---|---|:---:|:---:|
| 1 | US-10 | Diseño del formulario de registro de citas con validación de disponibilidad | Luis Daniel | 6 h | ⏳ Pendiente |
| 2 | US-10 | Vista de calendario semanal de citas | Álvaro | 6 h | ⏳ Pendiente |
| 3 | US-10 | Edición y cancelación de citas desde el sistema | Brayan | 4 h | ⏳ Pendiente |
| 4 | US-11 | Integración con API de WhatsApp Business para envío de mensajes | Brayan | 8 h | ⏳ Pendiente |
| 5 | US-11 | Plantilla de mensaje de confirmación de cita | Luis Daniel | 2 h | ⏳ Pendiente |
| 6 | US-11 | Registro de envíos y manejo de errores de la API | Álvaro | 3 h | ⏳ Pendiente |
| 7 | US-12 | Lógica de detección de clientes inactivos según umbral configurable | Brayan | 5 h | ⏳ Pendiente |
| 8 | US-12 | Listado y filtros de clientes inactivos | Luis Daniel | 4 h | ⏳ Pendiente |
| 9 | US-13 | Flujo de envío de recordatorio con plantilla personalizable | Álvaro | 4 h | ⏳ Pendiente |
| 10 | US-13 | Historial de recordatorios enviados por cliente | Luis Daniel | 3 h | ⏳ Pendiente |
| 11 | US-14 | Trigger automático de notificación al cambiar estado a "Lista para Entregar" | Brayan | 4 h | ⏳ Pendiente |
| 12 | US-14 | Registro del envío en el historial de la orden | Álvaro | 2 h | ⏳ Pendiente |

> **Total Sprint 3: 19 SP · 51 horas estimadas**

---

### Sprint 4 – Administración: Multisucursal, Reportes y Cierre

**Historias:** US-15 (8 SP) · US-16 (5 SP) · US-17 (3 SP)

| # | US | Tarea | Responsable | Horas | Estado |
|---|---|---|---|:---:|:---:|
| 1 | US-15 | CRUD de sucursales con datos de contacto y ubicación | Luis Daniel | 6 h | ⏳ Pendiente |
| 2 | US-15 | Asignación de usuarios a sucursales y aislamiento de datos | Brayan | 8 h | ⏳ Pendiente |
| 3 | US-15 | Panel comparativo de KPIs por sucursal | Álvaro | 6 h | ⏳ Pendiente |
| 4 | US-16 | Generación de reportes de ingresos y servicios en PDF | Álvaro | 6 h | ⏳ Pendiente |
| 5 | US-16 | Filtros de fecha y sucursal para reportes | Luis Daniel | 4 h | ⏳ Pendiente |
| 6 | US-16 | Gráficos de barras e indicadores en reportes | Brayan | 5 h | ⏳ Pendiente |
| 7 | US-17 | Pruebas de integración completas del sistema | Todo el equipo | 8 h | ⏳ Pendiente |
| 8 | US-17 | Correcciones finales y deploy a producción | Brayan | 4 h | ⏳ Pendiente |
| 9 | US-17 | Despliegue a producción y verificación del entorno | Brayan | 4 h | ⏳ Pendiente |

> **Total Sprint 4: 16 SP · 51 horas estimadas**

---

## 9. Conclusión

MecanicaPro representa una respuesta técnicamente fundamentada y estratégicamente orientada a los desafíos persistentes del sector de mantenimiento automotriz independiente. La integración de tecnologías como las bases de datos serverless y el CRM predictivo no solo resuelve los problemas operativos inmediatos del taller, sino que establece las bases para una cultura de prevención, excelencia técnica y fidelización de clientes sostenible en el tiempo.

La adopción de una metodología ágil basada en Scrum ha permitido estructurar el desarrollo de forma incremental, reduciendo los riesgos de implementación y facilitando la validación continua de los requisitos con los usuarios finales. Los módulos desarrollados en los primeros sprints priorizan el retorno de inversión (ROI) temprano para el operador del taller.

Desde la perspectiva de la ingeniería de software, el sistema demuestra que es posible construir soluciones empresariales robustas sobre arquitecturas serverless modernas, reduciendo los costos de operación y mantenimiento de la infraestructura.

---

## 10. Referencias

- Chopra, S., & Meindl, P. (2016). *Supply chain management: Strategy, planning, and operation* (6.ª ed.). Pearson.
- IEEE. (2011). *IEEE Std 830-1998: IEEE recommended practice for software requirements specifications*. Institute of Electrical and Electronics Engineers.
- Kotler, P., & Armstrong, G. (2018). *Principles of marketing* (17.ª ed.). Pearson.
- Laudon, K. C., & Laudon, J. P. (2020). *Management information systems: Managing the digital firm* (16.ª ed.). Pearson.
- Neon Technologies. (2024). *Neon documentation: Serverless PostgreSQL*. https://neon.tech/docs
- Nielsen, J., & Molich, R. (1990). Heuristic evaluation of user interfaces. En *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (pp. 249–256). ACM. https://doi.org/10.1145/97243.97281
- Pressman, R. S., & Maxim, B. R. (2021). *Software engineering: A practitioner's approach* (9.ª ed.). McGraw-Hill.
- Rubin, K. S. (2013). *Essential Scrum: A practical guide to the most popular agile process*. Addison-Wesley.
- Schwaber, K., & Sutherland, J. (2020). *The Scrum guide: The definitive guide to Scrum: The rules of the game*. Scrum.org. https://scrumguides.org
- Sommerville, I. (2016). *Software engineering* (10.ª ed.). Pearson.
