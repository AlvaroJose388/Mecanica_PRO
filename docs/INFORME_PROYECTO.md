
# MECANICAPRO: Ecosistema Inteligente de Gestión Automotriz & CRM Predictivo

## Resumen
**MecanicaPro** es una plataforma SaaS (Software como servicio) diseñada para modernizar y profesionalizar la gestión de talleres mecánicos mediante la integración de análisis de datos y gestión operativa de alta precisión. Este documento expone los fundamentos conceptuales del proyecto, la problemática del sector, el alcance del sistema, la metodología de desarrollo empleada, los requisitos funcionales y no funcionales, así como el Product Backlog. La solución aborda cuatro desafíos críticos del sector: la informalidad operativa, la baja retención de clientes, el descontrol del inventario y la falta de agendamiento y comunicación proactiva. Se concluye que la implementación de tecnologías como bases de datos *serverless* y un CRM predictivo basado en reglas de negocio representa una ventaja competitiva sostenible para los centros de servicio automotriz.

**Palabras clave:** gestión automotriz, SaaS, CRM predictivo, inventario, agendamiento de citas.

---

## 1. Introducción
El sector automotriz en Latinoamérica enfrenta una transformación digital sin precedentes. Sin embargo, los talleres independientes operan aún bajo metodologías manuales que limitan su rentabilidad. En este escenario nace **MecanicaPro**, un ecosistema SaaS diseñado para eliminar la brecha digital en pequeños y medianos centros de servicio. A diferencia de softwares genéricos, MecanicaPro se enfoca en la optimización del flujo de trabajo y el seguimiento postventa para transformar la gestión operativa en una ventaja competitiva real.

## 2. Descripción de la Problemática
El mercado de mantenimiento automotriz independiente enfrenta desafíos estructurales identificados en cuatro ejes:

### 2.1 Informalidad y Fragilidad Operativa
Pérdida sistemática de información histórica y ausencia de trazabilidad en las órdenes de servicio debido a registros manuales.

### 2.2 Baja Retención de Clientes
La falta de un sistema de seguimiento impide que el taller anticipe las necesidades del cliente, perdiendo visitas recurrentes.

### 2.3 Descontrol de Inventario
La falta de sincronización entre las órdenes de trabajo y el stock genera pérdidas financieras por desabastecimiento o exceso de inventario.

### 2.4 Falta de Agendamiento y Comunicación
La gestión de citas en papel genera dobles reservas y la ausencia de confirmaciones proactivas deteriora la confianza del cliente.

## 3. Alcance del Proyecto
MecanicaPro comprende el desarrollo de una plataforma web integral con las siguientes capacidades:
*   **Gestión de Operaciones:** Tablero Kanban para el control de órdenes con estados progresivos (Abierta, En Diagnóstico, En Reparación, Lista para Entregar, Cerrada).
*   **Logística e Inventario:** Control automatizado con alertas de stock crítico y sincronización en tiempo real con las órdenes.
*   **CRM Predictivo:** Identificación automática de clientes inactivos (> 6 meses) y habilitación de contacto manual vía WhatsApp.
*   **Agendamiento Técnico:** Registro de citas con validación de disponibilidad de mecánicos y envío manual de confirmaciones.
*   **Módulo Administrativo:** Gestión de sucursales, roles de usuario (SuperAdmin, TallerAdmin, Mecánico, Recepcionista) y facturación PDF.

## 4. Metodología de Desarrollo
El desarrollo sigue una metodología ágil basada en **Scrum**.
*   **Arquitectura:** PostgreSQL serverless (Neon) y Drizzle ORM.
*   **UX Industrial:** Diseño centrado en la rapidez y legibilidad en entornos de taller.
*   **Validación:** Reglas de estado estrictas en el servidor para evitar retrocesos en el flujo de trabajo.

## 5. Requisitos del Sistema

### 5.1 Requisitos Funcionales
| ID | Descripción | Módulo |
| :--- | :--- | :--- |
| RF-01 | Acceso seguro por roles (SuperAdmin, TallerAdmin, Mecánico, Recepcionista). | Autenticación |
| RF-02 | Gestión de órdenes en Kanban con estados: Abierta -> Diagnóstico -> Reparación -> Lista -> Cerrada. | Operaciones |
| RF-03 | Identificación de clientes con > 6 meses de inactividad para CRM. | CRM |
| RF-04 | Generación automática de facturas PDF al cerrar la orden. | Facturación |
| RF-05 | Agendamiento de citas con validación de colisión de horarios. | Agenda |

### 5.2 Requisitos No Funcionales
| ID | Descripción | Métrica |
| :--- | :--- | :--- |
| RNF-01 | Comunicación encriptada vía SSL/TLS. | Certificado Activo |
| RNF-02 | Disponibilidad del 99.9%. | Arquitectura Serverless |
| RNF-03 | Gestión multisucursal sin degradación de rendimiento. | Escalabilidad Neon |

## 6. Historias de Usuario (Resumen)
*   **US-03:** Gestión de órdenes en Kanban para asegurar trazabilidad.
*   **US-10:** Registro de citas técnicas para organizar la carga de trabajo.
*   **US-12:** CRM para detectar clientes olvidados y promover el retorno.
*   **US-15:** Consola SuperAdmin para gestionar toda la red de talleres.

## 7. Conclusión
MecanicaPro profesionaliza el sector automotriz integrando rigor operativo con algoritmos de retención, permitiendo que los talleres operen con estándares de ingeniería de software modernos.
