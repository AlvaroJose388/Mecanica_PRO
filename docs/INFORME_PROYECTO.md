
MecanicaPro: Ecosistema Inteligente de Gestion
Automotriz & CRM Predictivo



Presentado por:
Luis Daniel Herrera Perez
Alvaro Jose Prasca Ramos
Brayan Alfonso Contreras Ustate



Docente:
Laudyt Maria Lambraño Perez




Corporación Universitaria del Caribe – CECAR
Facultad de Ciencias Básicas, Ingeniería y Arquitectura 
Ingeniería de Sistemas
Sincelejo - Sucre
2025

Tabla de Contenido
1. Introduccion	6
2. Descripción de la Problemática	7
2.1 Informalidad y Fragilidad Operativa	7
2.2 Baja Retencion de Clientes	7
2.3 Descontrol de Inventario	8
3. Alcance del Proyecto	8
4. Metodologia de Desarrollo del Software	10
4.1 Sprints de Desarrollo	10
4.2 Arquitectura de Datos	10
4.3 Enfoque en UX Industrial	11
4.4 Validacion de Protocolos de Negocio	11
5. Requisitos del Sistema	12
5.1 Requisitos Funcionales	12
5.2 Requisitos No Funcionales	13
6. Historias de usuario	14
US-01 · Autenticacion de usuarios por rol	14
US-02 · Gestion de usuarios y asignacion de roles	14
US-03 · Gestion de ordenes de servicio en tablero Kanban	15
US-04 · Generación automática de facturas en PDF	15
US-05 · Dashboard de indicadores financieros y operativos	15
US-06 · Registro y control de inventario de repuestos	16
US-07 · Alertas automáticas de stock critico	16
US-08 · Sincronización automática de inventario con ordenes	17
US-09 · Consulta de historial completo del vehículo	17
US-10 · Registro y gestión de citas técnicas	17
US-11 · Notificación de confirmación de cita por WhatsApp	18
US-12 · Identificación de clientes inactivos para CRM	18
US-13 · Envío de recordatorios de mantenimiento por WhatsApp	18
US-14 · Notificación automática de vehículo listo por WhatsApp	19
US-15 · Gestión multisucursal desde panel unificado	19
US-16 · Generación y exportación de reportes de desempeño	20
7. Product Backlog	20
8.	Sprint backlog	22
Sprint 1 – Fundamentos: Autenticación, Kanban y Facturación	22
Sprint 2 – Operaciones: Dashboard, Inventario e Historial	22
Sprint 3 – Comunicación: Agendamiento, CRM y WhatsApp	23
Sprint 4 – Administración: Multisucursal, Reportes y Cierre	24
9.	Conclusion	25
10.	Referencias	27





























Resumen

MecanicaPro es una plataforma SaaS (Software como servicio) diseñada para modernizar y profesionalizar la gestión de talleres mecánicos mediante la integración de análisis de datos y gestión operativa de alta precisión. Este documento expone los fundamentos conceptuales del proyecto, la problemática del sector, el alcance del sistema, la metodología de desarrollo empleada, los requisitos funcionales y no funcionales, así como el Product Backlog. La solución aborda cuatro desafíos críticos del sector: la informalidad operativa, la baja retención de clientes, el descontrol del inventario y la falta de agendamiento y comunicación con el cliente. Se concluye que la implementación de tecnologías como bases de datos serverless y un CRM predictivo basado en reglas de negocio representa una ventaja competitiva sostenible para los centros de servicio automotriz.

Palabras clave: gestión automotriz, SaaS, CRM predictivo, inventario, agendamiento de citas








Abstract
MecanicaPro is a SaaS platform designed to modernize and professionalize the management of automotive repair shops through the integration of data analytics and high-precision operational management. This document presents the conceptual foundations of the project, the industry's problems, the system scope, the development methodology used, the functional and non-functional requirements, as well as the Product Backlog. The solution addresses four critical challenges in the sector: operational informality, low customer retention, inventory mismanagement, and lack of appointment scheduling and customer communication. It is concluded that the implementation of technologies such as serverless databases and a predictive CRM based on business rules represents a sustainable competitive advantage for automotive service centers.

Keywords: automotive management, SaaS, predictive CRM, inventory, appointment scheduling.


1.Introduccion

El sector automotriz en Latinoamérica enfrenta una transformación digital sin precedentes, impulsada por la evolución tecnológica de los vehículos y las nuevas expectativas de los consumidores. Sin embargo, los talleres mecánicos independientes —que representan la mayor parte del mercado de mantenimiento y reparación— operan aún bajo metodologías predominantemente manuales o con herramientas ofimáticas básicas que limitan su rentabilidad, eficiencia y capacidad de crecimiento. Esta brecha digital se traduce en pérdida de información crítica, dificultades para fidelizar clientes y una alta vulnerabilidad operativa.

En este escenario nace MecanicaPro, un ecosistema SaaS (Software como Servicio) diseñado específicamente para eliminar la brecha digital en pequeños y medianos centros de servicio automotriz. A diferencia de los softwares contables o administrativos genéricos disponibles en el mercado, MecanicaPro se enfoca en la optimización del flujo de trabajo y el seguimiento postventa, integrando módulos de gestión operativa (Kanban), control de inventario, CRM predictivo y facturación digital en una sola plataforma unificada.

El propósito del presente documento es exponer los fundamentos conceptuales, la metodología de desarrollo y los requisitos del sistema que guiarán la construcción de MecanicaPro. Se detalla la problemática del sector, el alcance funcional de la solución, así como el Product Backlog priorizado bajo el marco de trabajo Scrum. El documento sigue las recomendaciones de la norma IEEE 830 para la especificación de requisitos y adopta principios de usabilidad industrial para garantizar su adopción efectiva en entornos de talleres
2.Descripción de la Problemática

 El mercado de mantenimiento automotriz independiente enfrenta una serie de desafíos estructurales que limitan su crecimiento y sostenibilidad a largo plazo. A continuación, se describen los cuatro problemas centrales identificados mediante análisis de campo y revisión de literatura especializada.
2.1Informalidad y Fragilidad Operativa

Una proporción significativa de los talleres mecánicos pequeños y medianos gestiona sus operaciones mediante registros manuales (cuadernos, facturas sueltas) o herramientas aisladas como hojas de cálculo no integradas. Esta práctica genera pérdida sistemática de información histórica, ausencia de trazabilidad en las órdenes de servicio y una alta vulnerabilidad operativa ante la rotación de personal. La falta de un sistema centralizado impide la toma de decisiones basada en datos, lo que mantiene al taller en un estado de reacción constante en lugar de planificación estratégica.
2.2Baja Retencion de Clientes

La falta de un sistema de seguimiento postventa impide que el taller anticipe las necesidades del cliente, lo que hace perder la oportunidad de ofrecer mantenimientos preventivos recurrentes. Como señalan Kotler y Armstrong (2018), el costo de adquirir un nuevo cliente es de cinco a siete veces mayor que el de retener a uno existente; por lo tanto, la fidelización se convierte en un factor crítico para la rentabilidad de cualquier negocio de servicios.


2.3Descontrol de Inventario

.La falta de sincronización entre las órdenes de trabajo y el stock de repuestos genera dos problemas simultáneos: detenciones operativas por desabastecimiento (el mecánico no encuentra la pieza necesaria) y pérdidas financieras por excedentes que no rotan (capital inmovilizado en repuestos de baja rotación). Según Chopra y Meindl (2016), una gestión deficiente del inventario puede representar entre el 25 % y el 40 % del costo operativo total en empresas de servicios basadas en el consumo de piezas. En un taller mecánico, esto se traduce directamente en menores márgenes de ganancia y en una incapacidad para competir con talleres más grandes o formalizados.

2.4 Falta de Agendamiento y Comunicación con el Cliente
En la mayoría de los talleres independientes, los clientes deben llamar telefónicamente para consultar disponibilidad, sin garantía de que se registre formalmente su solicitud. La secretaria anota la cita en una agenda física o mentalmente, lo que genera olvidos, dobles reservas o desorganización. Además, no existe un mecanismo automatizado para confirmar la cita ni para recordarla al cliente. Como resultado, el cliente llega al taller sin la certeza de que su vehículo será atendido de inmediato, encontrándose con demoras imprevistas o, en el peor de los casos, con la ausencia de su registro. Esta falta de comunicación proactiva deteriora la confianza del cliente y aumenta la carga operativa sobre el personal administrativo, que debe dedicar tiempo a resolver confusiones en lugar de enfocarse en la atención al cliente.
3.Alcance del Proyecto

	MecanicaPro comprende el desarrollo de una plataforma web integral diseñada específicamente para optimizar la gestión operativa y administrativa de talleres mecánicos independientes. El sistema incluirá un módulo de gestión de operaciones y flujo de trabajo, implementado mediante un tablero Kanban digital que permita crear, asignar y avanzar órdenes de servicio a través de estados progresivos (abierta, en taller, en diagnóstico, en reparación, lista para entregar, cerrada), garantizando trazabilidad completa de cada intervención y bloqueos de integridad para evitar cambios de estado inválidos. En cuanto a la logística e inventario, la plataforma automatizará el control de stock de repuestos e insumos, con alertas configurables de stock crítico, registro de entradas y salidas, y sincronización en tiempo real con las órdenes de trabajo, de modo que al cerrar una orden se descuenten automáticamente los repuestos utilizados. El módulo de fidelización inteligente (CRM) operará con reglas de negocio basadas en umbrales de tiempo (por ejemplo, clientes con más de 6 meses sin servicio) para anticipar mantenimientos recurrentes, y se integrará con la API de WhatsApp Business para enviar recordatorios de cita, confirmaciones y notificaciones de vehículo listo. Finalmente, el módulo financiero y administrativo permitirá gestionar múltiples sucursales desde un panel unificado, administrar perfiles de usuario con roles diferenciados (SuperAdmin, TallerAdmin, Mecánico, Recepcionista) y generar automáticamente facturas en formato PDF al cierre de cada orden de servicio, incluyendo desglose de servicios, repuestos, impuestos y totales. El alcance contempla también la funcionalidad de agendamiento de citas técnicas, con registro de cliente, asignación de fecha y hora, y notificación automática por WhatsApp para reducir inasistencias y mejorar la experiencia del cliente.

4.Metodologia de Desarrollo del Software

El desarrollo de MecanicaPro sigue una metodología ágil basada en el marco de trabajo Scrum, adaptada a un entorno de integración y despliegue continuos (CI/CD). Esta decisión metodológica responde a la necesidad de entregar valor de forma incremental, gestionar con rapidez los cambios en los requisitos y mantener una comunicación constante entre los miembros del equipo (Schwaber y Sutherland, 2020).
4.1Sprints de Desarrollo

Se definieron ciclos de trabajo de entre una y dos semanas de duración, denominados Sprints. Al inicio de cada Sprint se realiza una reunión de planificación (Sprint Planning) para seleccionar, del Product Backlog, las historias de usuario que se abordarán durante el ciclo. Al finalizar, se llevan a cabo una revisión (Sprint Review) y una retrospectiva (Sprint Retrospective) con el fin de validar los entregables e identificar mejoras en el proceso (Rubin, 2013).
4.2Arquitectura de Datos

La capa de persistencia se implementó con PostgreSQL en modalidad serverless a través de la plataforma Neon, lo que garantiza escalabilidad global y alta disponibilidad sin necesidad de gestionar infraestructura. Para la capa de acceso a datos, se adoptó Drizzle ORM, una herramienta de mapeo objeto-relacional que asegura la integridad de tipos en el código TypeScript y facilita las migraciones de esquema de forma declarativa (Neon Technologies, 2024).
4.3Enfoque en UX Industrial

El diseño de la interfaz de usuario sigue los principios de usabilidad industrial propuestos por Nielsen y Molich (1990), priorizando la legibilidad en entornos de taller, la reducción de la carga cognitiva del operario y la velocidad de carga de los componentes críticos.
4.4Validacion de Protocolos de Negocio

Las reglas de negocio criticas se implementaron en la capa de servidor mediante validaciones de estado, eliminando la posibilidad de manipulacion desde el cliente. Este enfoque de server-side validation garantiza la integridad del proceso independientemente del dispositivo utilizado por el operador.












5. Requisitos del Sistema
5.1 Requisitos Funcionales

Los requisitos funcionales describen el comportamiento observable del sistema desde la perspectiva del usuario. Han sido identificados y priorizados mediante sesiones de levantamiento de requisitos con representantes de los usuarios objetivo (IEEE, 2011).

ID	Descripcion del Requisito	Modulo
RF-01	El sistema debe permitir el registro y acceso seguro mediante roles diferenciados: SuperAdmin, TallerAdmin y Mecanico, con control de permisos por nivel jerarquico.	Autenticacion
RF-02	El usuario debe poder crear, asignar y avanzar ordenes de servicio en un tablero visual con estados progresivos y bloqueos de integridad.	Gestion Operativa
RF-03	El sistema debe identificar clientes con mantenimientos vencidos (mas de 6 meses) y habilitar el contacto directo via WhatsApp.	CRM Predictivo
RF-04	El sistema debe generar documentos PDF de venta con desglose de servicios, repuestos y totales listos para entregar al cliente.	Facturacion

Tabla 1. Requisitos funcionales del sistema MecanicaPro.










5.2 Requisitos No Funcionales

Los requisitos no funcionales establecen las restricciones de calidad bajo las cuales el sistema debe operar. Estos requisitos son tan criticos como los funcionales, ya que determinan la viabilidad del sistema en entornos de produccion real (Pressman & Maxim, 2021).
ID	Descripcion	Metrica de Validacion
RNF-01	Toda comunicacion entre cliente y servidor debe realizarse a traves de tuneles SSL/TLS encriptados.	Certificado SSL activo. Conexion cifrada con Neon DB.
RNF-02	La plataforma debe garantizar una disponibilidad del 99.9%, aprovechando la arquitectura serverless.	Monitoreo con uptime >= 99.9% mensual.
RNF-03	La base de datos debe gestionar multiples sucursales sin degradacion del rendimiento al escalar.	Pruebas de carga con 100+ usuarios concurrentes.

Tabla 2. Requisitos no funcionales del sistema MecanicaPro.









6. Historias de usuario

Cada historia de usuario ha sido redactada siguiendo el formato estándar de Scrum: 'Como [rol], quiero [funcionalidad] para [beneficio]', con criterios de aceptación verificables, estimación en Story Points (escala Fibonacci) y asignación al sprint correspondiente. El equipo cuenta con tres integrantes: Luis Daniel Herrera, Alvaro Jose Prasca y Brayan Alfonso Contreras.
US-01 · Autenticacion de usuarios por rol
US-01  Autenticación de usuarios por rol
Historia:	Como usuario registrado del sistema, quiero iniciar sesión con mis credenciales (correo y contraseña) para acceder únicamente a las funcionalidades correspondientes a mi rol asignado.
Criterios de Aceptación:	1. El sistema muestra una pantalla de inicio de sesión con campos de correo y contraseña.
2. Las credenciales se validan en la base de datos de forma segura.
3. El sistema redirige al usuario al módulo principal según su rol (SuperAdmin, TallerAdmin, Mecánico, Recepcionista).
4. Tras cinco intentos fallidos consecutivos, la cuenta se bloquea temporalmente por 15 minutos.
5. El sistema permite cerrar sesión de forma segura desde cualquier modulo.
Modulo: Autenticación      Prioridad: ALTA      Story Points: 3 SP      Sprint: Sprint 1

US-02 · Gestion de usuarios y asignacion de roles
US-02  Gestion de usuarios y asignacion de roles
Historia:	Como SuperAdmin, quiero crear, editar, activar y desactivar cuentas de usuario asignándoles un rol específico para controlar el acceso al sistema según la jerarquía del personal.
Criterios de Aceptación:	1. El SuperAdmin puede crear un nuevo usuario con nombre, correo, contraseña y rol.
2. Se pueden asignar exactamente cuatro roles: SuperAdmin, TallerAdmin, Mecánico y Recepcionista.
3. Cada rol restringe el acceso a los módulos que no le corresponden.
4. El SuperAdmin puede desactivar una cuenta sin eliminarla; el usuario desactivado no puede iniciar sesión.
5. Se muestra un listado paginable de todos los usuarios con su estado (Activo/Inactivo) y rol.
Modulo: Control de Acceso      Prioridad: ALTA      Story Points: 5 SP      Sprint: Sprint 1
 
US-03 · Gestion de ordenes de servicio en tablero Kanban
US-03  Gestion de ordenes de servicio en tablero Kanban
Historia:	Como TallerAdmin o Mecánico, quiero crear, asignar y avanzar ordenes de servicio a través de un tablero Kanban con estados progresivos para garantizar la trazabilidad completa de cada intervención.
Criterios de Aceptación:	1. El sistema permite crear una orden con datos del cliente, vehículo (placa, marca, modelo), descripción del servicio y mecánico asignado.
2. Los estados del Kanban son en orden: Abierta, En Diagnostico, En Reparación, Lista para Entregar, Cerrada.
3. Solo se puede avanzar al siguiente estado; no se permiten saltos de estado ni retrocesos sin autorización del TallerAdmin.
4. Cada cambio de estado queda registrado con fecha, hora y usuario responsable.
5. El tablero muestra visualmente las tarjetas agrupadas por estado con color diferenciado.
Modulo: Gestion Operativa      Prioridad: ALTA      Story Points: 8 SP      Sprint: Sprint 1
 
US-04 · Generación automática de facturas en PDF
US-04  Generación automática de facturas en PDF
Historia:	Como TallerAdmin o Recepcionista, quiero generar una factura en formato PDF con un solo clic al momento de cerrar una orden de servicio para entregar un comprobante profesional al cliente.
Criterios de Aceptación:	1. La factura incluye: datos del taller, datos del cliente, listado de servicios prestados, repuestos utilizados con sus precios unitarios, subtotal, impuestos (IVA) y total.
2. La factura se genera automáticamente al cerrar la orden de servicio.
3. El documento PDF puede descargarse o enviarse directamente al cliente.
4. Cada factura tiene un numero de consecutivo único generado por el sistema.
5. La factura refleja exactamente los repuestos e insumos registrados en la orden.
Modulo: Facturación      Prioridad: ALTA      Story Points: 5 SP      Sprint: Sprint 1
 
US-05 · Dashboard de indicadores financieros y operativos
US-05  Dashboard de indicadores financieros y operativos
Historia:	Como TallerAdmin, quiero visualizar en un tablero de indicadores los ingresos del periodo, el numero de ordenes activas, los mecanicos mas productivos y el estado del inventario para tomar decisiones estrategicas basadas en datos.
Criterios de Aceptacion:	1. El dashboard muestra KPIs en tiempo real: ingresos totales del mes, ordenes activas, ordenes cerradas y alertas de inventario.
2. Se pueden filtrar los datos por rango de fechas y por sucursal.
3. Los indicadores de ingresos se presentan en graficos de barras comparativos por mes.
4. El panel muestra un ranking de mecanicos por numero de ordenes completadas.
5. Los datos se actualizan automaticamente al cargar la pagina sin necesidad de refresco manual.
Modulo: Panel Administrativo      Prioridad: ALTA      Story Points: 8 SP      Sprint: Sprint 2
Nota: Esta historia tiene prioridad ALTA pero se asigna al Sprint 2 porque depende directamente de los datos generados por las ordenes de servicio (US-03) y el modulo de facturacion (US-04) desarrollados en el Sprint 1. Sin esos datos, el dashboard no tendria informacion que mostrar.

US-06 · Registro y control de inventario de repuestos
US-06  Registro y control de inventario de repuestos
Historia:	Como Administrador, quiero registrar, editar y consultar el inventario de repuestos e insumos con sus cantidades disponibles y precios para mantener el stock actualizado en todo momento.
Criterios de Aceptación:	1. El sistema permite registrar un repuesto con: nombre, referencia, cantidad disponible, precio unitario y umbral de stock crítico.
2. Se pueden registrar entradas (compras) y salidas (uso en ordenes) con fecha y motivo.
3. El inventario muestra el saldo actual de cada repuesto tras cada movimiento.
4. Es posible buscar repuestos por nombre o referencia.
5. Se lleva un historial de todos los movimientos de cada repuesto.
Modulo: Inventario      Prioridad: MEDIA      Story Points: 5 SP      Sprint: Sprint 2
 
US-07 · Alertas automáticas de stock critico
US-07  Alertas automáticas de stock critico
Historia:	Como Administrador, quiero que el sistema me notifique automáticamente cuando un repuesto alcance o supere el umbral de stock critico configurado para gestionar las compras a tiempo y evitar paradas operativas.
Criterios de Aceptación:	1. Cada repuesto tiene un umbral de stock critico configurable de forma individual.
2. Cuando el stock de un repuesto alcanza o baja del umbral, aparece una alerta visible en el panel principal.
3. Existe un listado de 'Repuestos en alerta' accesible desde el módulo de inventario.
4. La alerta persiste hasta que se registre una entrada de stock que supere el umbral crítico.
Modulo: Inventario      Prioridad: MEDIA      Story Points: 3 SP      Sprint: Sprint 2
 
US-08 · Sincronización automática de inventario con ordenes
US-08  Sincronización automática de inventario con ordenes
Historia:	Como Mecánico, quiero que al registrar los repuestos utilizados en una orden y cerrarla, el sistema descuente automáticamente dichas cantidades del inventario para evitar el registro manual duplicado.
Criterios de Aceptación:	1. Durante la creación o edición de una orden, el mecánico puede agregar los repuestos utilizados con su cantidad.
2. Al cerrar la orden, el sistema descuenta automáticamente los repuestos registrados del inventario.
3. Si un repuesto no tiene stock suficiente, el sistema alerta al usuario, pero no bloquea el cierre de la orden.
4. El descuento de inventario se registra en el historial de movimientos vinculado al número de orden.
Modulo: Inventario      Prioridad: MEDIA      Story Points: 5 SP      Sprint: Sprint 2
 
US-09 · Consulta de historial completo del vehículo
US-09  Consulta de historial completo del vehículo
Historia:	Como TallerAdmin o Mecánico, quiero consultar el historial completo de servicios, repuestos y fechas de intervención de un vehículo para asesorar mejor al cliente en futuras visitas.
Criterios de Aceptación:	1. El historial se puede buscar por número de placa o nombre del cliente.
2. Se muestra una lista cronológica de todas las ordenes de servicio del vehículo.
3. Cada entrada del historial muestra: fecha, tipo de servicio, repuestos usados, mecánico responsable y costo total.
4. El historial es de solo lectura para los Mecánicos; el TallerAdmin puede agregar notas.
Modulo: Historial del Vehiculo      Prioridad: MEDIA      Story Points: 5 SP      Sprint: Sprint 2
 
US-10 · Registro y gestión de citas técnicas
US-10  Registro y gestión de citas técnicas
Historia:	Como Recepcionista, quiero registrar citas técnicas con datos del cliente, vehículo, fecha, hora y mecánico asignado para organizar la agenda del taller y evitar la doble reserva.
Criterios de Aceptación:	1. El formulario de cita incluye: nombre del cliente, teléfono, placa del vehículo, tipo de servicio solicitado, fecha, hora y mecánico asignado.
2. El sistema verifica que no exista otra cita asignada al mismo mecánico en el mismo horario.
3. Las citas se visualizan en una vista de calendario semanal.
4. La Recepcionista puede editar o cancelar una cita existente.
5. Al registrar la cita, el estado inicial es 'Confirmada'.
Modulo: Agendamiento      Prioridad: MEDIA      Story Points: 5 SP      Sprint: Sprint 3
 
US-11 · Notificación de confirmación de cita por WhatsApp
US-11  Notificación de confirmación de cita por WhatsApp
Historia:	Como Recepcionista, quiero que el sistema envié automáticamente un mensaje de WhatsApp al cliente confirmando los datos de su cita para reducir inasistencias sin necesidad de llamadas manuales.
Criterios de Aceptación:	1. Al guardar una nueva cita, el sistema envía automáticamente un mensaje por WhatsApp al número registrado del cliente.
2. El mensaje incluye: nombre del cliente, fecha y hora de la cita, nombre del taller y tipo de servicio.
3. Él envío queda registrado en el sistema con marca de tiempo.
4. Si el envío falla, el sistema notifica a la Recepcionista para que contacte al cliente manualmente.
Modulo: Agendamiento / CRM      Prioridad: MEDIA      Story Points: 3 SP      Sprint: Sprint 3
 
US-12 · Identificación de clientes inactivos para CRM
US-12  Identificacion de clientes inactivos para CRM
Historia:	Como TallerAdmin, quiero que el sistema identifique automáticamente los clientes que llevan más de un numero configurable de meses sin visitar el taller para gestionarlos desde el módulo CRM.
Criterios de Aceptación:	1. El umbral de inactividad (en meses) es configurable por el TallerAdmin; el valor predeterminado es 6 meses.
2. El sistema muestra un listado de clientes inactivos con: nombre, teléfono, última fecha de visita y días transcurridos.
3. El listado se puede filtrar por rango de inactividad y ordenar por fecha de última visita.
4. Desde el listado se puede acceder directamente al historial del cliente.
Modulo: CRM Predictivo      Prioridad: MEDIA      Story Points: 5 SP      Sprint: Sprint 3
 
US-13 · Envío de recordatorios de mantenimiento por WhatsApp
US-13  Envío de recordatorios de mantenimiento por WhatsApp
Historia:	Como TallerAdmin, quiero enviar recordatorios de mantenimiento personalizados por WhatsApp a clientes inactivos para incrementar la retención y promover visitas recurrentes.
Criterios de Aceptación:	1. Desde el listado de clientes inactivos, el TallerAdmin puede seleccionar uno o varios clientes y enviar un recordatorio.
2. El mensaje es personalizable con el nombre del cliente y el nombre del taller.
3. El sistema registra la fecha y hora de cada recordatorio enviado y lo asocia al perfil del cliente.
4. Se puede consultar el historial de recordatorios enviados por cliente.
Modulo: CRM Predictivo      Prioridad: MEDIA      Story Points: 3 SP      Sprint: Sprint 3
 
US-14 · Notificación automática de vehículo listo por WhatsApp
US-14  Notificación automática de vehículo listo por WhatsApp
Historia:	Como Mecánico o Recepcionista, quiero que al cambiar el estado de una orden a 'Lista para Entregar' el sistema notifique automáticamente al cliente por WhatsApp para agilizar el retiro del vehículo.
Criterios de Aceptación:	1. Al avanzar una orden al estado 'Lista para Entregar', se dispara automáticamente el envío de un mensaje de WhatsApp.
2. El mensaje incluye: nombre del cliente, placa del vehículo y nombre del taller.
3. El envío se registra en el historial de la orden con marca de tiempo.
4. Si el envío falla, se muestra una alerta en la pantalla para que el personal contacte al cliente.
Modulo: CRM / Gestion Operativa      Prioridad: MEDIA      Story Points: 3 SP      Sprint: Sprint 3
 
US-15 · Gestión multisucursal desde panel unificado
US-15  Gestion multisucursal desde panel unificado
Historia:	Como SuperAdmin, quiero crear y gestionar múltiples sucursales de taller desde un panel centralizado para supervisar las operaciones de toda la red desde un solo lugar.
Criterios de Aceptación:	1. El SuperAdmin puede crear una sucursal con: nombre, dirección y datos de contacto.
2. Los usuarios (TallerAdmin, Mecánicos, Recepcionistas) se asignan a una sucursal especifica.
3. El panel muestra los KPIs de cada sucursal de forma comparativa (ingresos, ordenes, alertas).
4. Los datos de cada sucursal están aislados entre sí; un TallerAdmin solo ve los datos de su sucursal.
Modulo: Panel Administrativo      Prioridad: BAJA      Story Points: 8 SP      Sprint: Sprint 4
 
US-16 · Generación y exportación de reportes de desempeño
US-16  Generación y exportación de reportes de desempeño
Historia:	Como TallerAdmin o SuperAdmin, quiero generar reportes de ingresos, servicios más realizados y rendimiento de mecánicos por periodo de tiempo para análisis externo y toma de decisiones.
Criterios de Aceptación:	1. El sistema permite seleccionar el tipo de reporte: ingresos por periodo, servicios más frecuentes, rendimiento por mecánico.
2. Los reportes se pueden filtrar por rango de fechas y por sucursal.
3. Los reportes son exportables en formato PDF.
4. Los reportes incluyen gráficos de barras y tablas de resumen.
Modulo: Panel Administrativo      Prioridad: BAJA      Story Points: 5 SP      Sprint: Sprint 4


US-17 · Pruebas de integracion y despliegue a produccion

US-17  Pruebas de integracion y despliegue a produccion
Historia:	Como equipo de desarrollo, queremos ejecutar pruebas de integracion completas y realizar el despliegue final del sistema para garantizar la entrega del producto en produccion con calidad verificada.
Criterios de Aceptacion:	1. Se ejecutan pruebas de integracion cubriendo los flujos criticos de cada modulo (autenticacion, Kanban, inventario, facturacion, agendamiento).
2. Todos los errores criticos y de alta severidad detectados son corregidos antes del despliegue.
3. El sistema queda desplegado en el entorno de produccion configurado y accesible para los usuarios.
4. Se entrega documentacion tecnica del entorno de produccion (URLs, variables de entorno, instrucciones de acceso).
Modulo: Calidad y Despliegue      Prioridad: BAJA      Story Points: 3 SP      Sprint: Sprint 4


7. Product Backlog
El Product Backlog es la lista ordenada y priorizada de todas las funcionalidades del sistema. La priorización sigue un orden jerárquico estricto: ALTA (valor crítico para el negocio y funcionalidad básica del sistema), MEDIA (funcionalidades de alto impacto que extienden el valor), BAJA (funcionalidades deseables para fases avanzadas). La estimación en Story Points utiliza la escala de Fibonacci para reflejar incertidumbre y complejidad relativa.
 
ID	Titulo	Historia de Usuario (resumen)	Modulo	Prioridad	SP
US-01	Autenticación de usuarios por rol	Como usuario registrado del sistema, quiero iniciar sesión con mis credenciales (correo y contraseña).	Autenticación	ALTA	3
US-02	Gestión de usuarios y asignación de roles	Como SuperAdmin, quiero crear, editar, activar y desactivar cuentas de usuario asignándoles un rol.	Control de Acceso	ALTA	5
US-03	Gestión de órdenes de servicio en tablero Kanban 	Como TallerAdmin o Mecánico, quiero crear, asignar y avanzar ordenes de servicio a través de un tablero Kanban.	Gestión Operativa	ALTA	8
US-04	Generación automática de facturas en PDF	Como TallerAdmin o Recepcionista, quiero generar una factura en formato PDF con un solo clic al momento,	Facturación	ALTA	5
US-05	Dashboard de indicadores financieros y operativos	Como TallerAdmin, quiero visualizar en un tablero de indicadores los ingresos del periodo, el número de órdenes.	Panel Administrativo	ALTA	8
US-06	Registro y control de inventario de repuestos	Como Administrador, quiero registrar, editar y consultar el inventario de repuestos e insumos con sus cantidades.	Inventario	MEDIA	5
US-07	Alertas automáticas de stock critico	Como Administrador, quiero que el sistema me notifique automáticamente cuando un repuesto alcance o supere ...	Inventario	MEDIA	3
US-08	Sincronización automática de inventario con ordenes	Como Mecánico, quiero que al registrar los repuestos utilizados en una orden y cerrarla.	Inventario	MEDIA	5
US-09	Consulta de historial completo del vehículo	Como TallerAdmin o Mecánico, quiero consultar el historial completo de servicios, repuestos y fechas.	Historial del Vehículo	MEDIA	5
US-10	Registro y gestión de citas técnicas	Como Recepcionista, quiero registrar citas técnicas con datos del cliente, vehículo, fecha, hora y mecánico.	Agendamiento	MEDIA	5
US-11	Notificación de confirmación de cita por WhatsApp	Como Recepcionista, quiero que el sistema envié automáticamente un mensaje de WhatsApp al cliente.	Agendamiento / CRM	MEDIA	3
US-12	Identificación de clientes inactivos para CRM	Como TallerAdmin, quiero que el sistema identifique automáticamente los clientes que llevan más de un número.	CRM Predictivo	MEDIA	5
US-13	Envió de recordatorios de mantenimiento por WhatsApp	Como TallerAdmin, quiero enviar recordatorios de mantenimiento personalizados por WhatsApp a clientes inactivos.	CRM Predictivo	MEDIA	3
US-14	Notificación automática de vehículo listo por WhatsApp	Como Mecánico o Recepcionista, quiero que al cambiar el estado de una orden a 'Lista para Entregar'.	CRM / Gestión Operativa	MEDIA	3
US-15	Gestión multisucursal desde panel unificado	Como SuperAdmin, quiero crear y gestionar múltiples sucursales de taller desde un panel centralizado.	Panel Administrativo	BAJA	8
US-16	Generación y exportación de reportes de desempeño	Como TallerAdmin o SuperAdmin, quiero generar reportes de ingresos, servicios más realizados y rendimiento.	Panel Administrativo	BAJA	5
US-17	Pruebas de integracion y despliegue a produccion	Como equipo de desarrollo, queremos ejecutar pruebas de integracion completas y realizar el despliegue.	Calidad y Despliegue	BAJA	3
 
Total Story Points del proyecto: 82 SP. Distribuidos en 4 sprints de 2 semanas






8. Sprint backlog
El Sprint Backlog desglosa cada historia de usuario en tareas concretas de desarrollo con responsable asignado y estimación de horas. El equipo trabaja en sprints de dos (2) semanas. La duración total estimada del proyecto es de ocho (8) semanas (4 sprints).
 
Sprint 1 – Fundamentos: Autenticación, Kanban y Facturación
Historias incluidas: US-01: Autenticación de usuarios por rol (3 SP)   |   US-02: Gestión de usuarios y asignación de roles (5 SP)   |   US-03: Gestión de ordenes de servicio en tablero Kanban (8 SP)   |   US-04: Generación automática de facturas en PDF (5 SP)
 
#	US-ID	Tarea	Responsable	Horas	Estado
1	US-01	Diseño de pantalla de login y flujo de autenticación	Luis Daniel	4 h	Pendiente
2	US-01	Implementación de validación de credenciales y JWT	Brayan	6 h	Pendiente
3	US-01	Lógica de bloqueo por intentos fallidos	Brayan	3 h	Pendiente
4	US-02	CRUD de usuarios en panel de administración	Luis Daniel	6 h	Pendiente
5	US-02	Implementación del sistema de permisos por rol	Alvaro	8 h	Pendiente
6	US-03	Diseño del tablero Kanban con columnas de estados	Luis Daniel	8 h	Pendiente
7	US-03	Lógica de bloqueo de cambios de estado inválidos	Brayan	6 h	Pendiente
8	US-03	Registro de auditoría de cambios de estado	Alvaro	4 h	Pendiente
9	US-04	Generación de documento PDF con librería (jsPDF o similar)	Alvaro	6 h	Pendiente
10	US-04	Plantilla de factura con desglose de items y totales	Luis Daniel	4 h	Pendiente
11	US-04	Integración de descarga y envío de la factura	Brayan	3 h	Pendiente
Total Sprint 1:   Story Points: 21 SP   |   Horas estimadas: 58 h	
 

Sprint 2 – Operaciones: Dashboard, Inventario e Historial
Historias incluidas: US-05: Dashboard de indicadores financieros y operativos (8 SP)   |   US-06: Registro y control de inventario de repuestos (5 SP)   |   US-07: Alertas automáticas de stock critico (3 SP)   |   US-08: Sincronización automática de inventario con ordenes (5 SP)   |   US-09: Consulta de historial completo del vehículo (5 SP)
 
#	US-ID	Tarea	Responsable	Horas	Estado
1	US-05	Diseño del dashboard con componentes de gráficos (Chart.js)	Luis Daniel	8 h	Pendiente
2	US-05	Endpoints de API para KPIs en tiempo real	Brayan	6 h	Pendiente
3	US-05	Filtros de fecha y sucursal en el dashboard	Alvaro	4 h	Pendiente
4	US-06	CRUD de repuestos con precio y umbral critico	Alvaro	5 h	Pendiente
5	US-06	Registro de movimientos de entrada y salida de inventario	Luis Daniel	5 h	Pendiente
6	US-07	Lógica de evaluación de umbral critico al registrar movimiento	Brayan	4 h	Pendiente
7	US-07	Componente de alertas visible en el panel principal	Luis Daniel	3 h	Pendiente
8	US-08	Formulario de repuestos dentro de la orden de servicio	Alvaro	4 h	Pendiente
9	US-08	Trigger de descuento automático de inventario al cerrar orden	Brayan	5 h	Pendiente
10	US-09	Endpoint y pantalla de búsqueda de historial por placa/cliente	Luis Daniel	4 h	Pendiente
11	US-09	Vista detallada de cada entrada del historial del vehículo	Alvaro	4 h	Pendiente
11	US-09	Diseño del esquema de base de datos para modulos de inventario e historial	Alvaro	4 h	Pendiente
11	US-05	Testing unitario de los endpoints desarrollados en el sprint 2	Luis Daniel	4 h	Pendiente
Total Sprint 2:   Story Points: 26 SP   |   Horas estimadas: 60 h	
 







Sprint 3 – Comunicación: Agendamiento, CRM y WhatsApp
Historias incluidas: US-10: Registro y gestion de citas tecnicas (5 SP)   |   US-11: Notificacion de confirmacion de cita por WhatsApp (3 SP)   |   US-12: Identificacion de clientes inactivos para CRM (5 SP)   |   US-13: Envio de recordatorios de mantenimiento por WhatsApp (3 SP)   |   US-14: Notificacion automatica de vehiculo listo por WhatsApp (3 SP)
 
#	US-ID	Tarea	Responsable	Horas	Estado
1	US-10	Diseño del formulario de registro de citas con validación de disponibilidad	Luis Daniel	6 h	Pendiente
2	US-10	Vista de calendario semanal de citas	Alvaro	6 h	Pendiente
3	US-10	Edición y cancelación de citas desde el sistema	Brayan	4 h	Pendiente
4	US-11	Integración con API de WhatsApp Business para envío de mensajes	Brayan	8 h	Pendiente
5	US-11	Plantilla de mensaje de confirmación de cita	Luis Daniel	2 h	Pendiente
6	US-11	Registro de envíos y manejo de errores de la API	Alvaro	3 h	Pendiente
7	US-12	Lógica de detección de clientes inactivos según umbral configurable	Brayan	5 h	Pendiente
8	US-12	Listado y filtros de clientes inactivos	Luis Daniel	4 h	Pendiente
9	US-13	Flujo de envío de recordatorio con plantilla personalizable	Alvaro	4 h	Pendiente
10	US-13	Historial de recordatorios enviados por cliente	Luis Daniel	3 h	Pendiente
11	US-14	Trigger automático de notificación al cambiar estado a 'Lista para Entregar'	Brayan	4 h	Pendiente
12	US-14	Registro del envío en el historial de la orden	Alvaro	2 h	Pendiente
Total Sprint 3:   Story Points: 19 SP   |   Horas estimadas: 51 h	
 



Sprint 4 – Administración: Multisucursal, Reportes y Cierre
Historias incluidas: US-15: Gestión multisucursal desde panel unificado (8 SP)   |   US-16: Generación y exportación de reportes de desempeño (5 SP)
 
#	US-ID	Tarea	Responsable	Horas	Estado
1	US-15	CRUD de sucursales con datos de contacto y ubicación	Luis Daniel	6 h	Pendiente
2	US-15	Asignación de usuarios a sucursales y aislamiento de datos	Brayan	8 h	Pendiente
3	US-15	Panel comparativo de KPIs por sucursal	Alvaro	6 h	Pendiente
4	US-16	Generación de reportes de ingresos y servicios en PDF	Alvaro	6 h	Pendiente
5	US-16	Filtros de fecha y sucursal para reportes	Luis Daniel	4 h	Pendiente
6	US-16	Gráficos de barras e indicadores en reportes	Brayan	5 h	Pendiente
7	US-17	Pruebas de integración completas del sistema	Todo el equipo	8 h	Pendiente
8	US-17	Correcciones finales y deploy a producción	Brayan	4 h	Pendiente
9	US-17	Despliegue a produccion y verificacion del entorno	Brayan	4 h	Pendiente
Total Sprint 4:   Story Points: 16 SP   |   Horas estimadas: 51 h	








9.Conclusion

MecanicaPro representa una respuesta técnicamente fundamentada y estratégicamente orientada a los desafíos persistentes del sector de mantenimiento automotriz independiente. La integración de tecnologías como las bases de datos serverless y el CRM predictivo no solo resuelve los problemas operativos inmediatos del taller, sino que establece las bases para una cultura de prevención, excelencia técnica y fidelización de clientes sostenible en el tiempo. 
La adopción de una metodología ágil basada en SCRUM ha permitido estructurar el desarrollo de forma incremental, reduciendo los riesgos de implementación y facilitando la validación continua de los requisitos con los usuarios finales. Los módulos desarrollados en los primeros sprints priorizan el retorno de inversión (ROI) temprano para el operador del taller.
Desde la perspectiva de la ingeniería de software, el sistema demuestra que es posible construir soluciones empresariales robustas sobre arquitecturas serverless modernas, reduciendo los costos de operación y mantenimiento de la infraestructura. Los requisitos no funcionales definidos garantizan que la plataforma sea viable en entornos de producción con alta concurrencia.



10.Referencias

Chopra, S., & Meindl, P. (2016). Supply chain management: Strategy, planning, and operation (6.a ed.). Pearson.

IEEE. (2011). IEEE Std 830-1998: IEEE recommended practice for software requirements specifications. Institute of Electrical and Electronics Engineers.

Kotler, P., & Armstrong, G. (2018). Principles of marketing (17.a ed.). Pearson.

Laudon, K. C., & Laudon, J. P. (2020). Management information systems: Managing the digital firm (16.a ed.). Pearson.

Neon Technologies. (2024). Neon documentation: Serverless PostgreSQL. https://neon.tech/docs

Nielsen, J., & Molich, R. (1990). Heuristic evaluation of user interfaces. En Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (pp. 249-256). ACM. https://doi.org/10.1145/97243.97281

Pressman, R. S., & Maxim, B. R. (2021). Software engineering: A practitioner's approach (9.a ed.). McGraw-Hill.

Rubin, K. S. (2013). Essential Scrum: A practical guide to the most popular agile process. Addison-Wesley.

Schwaber, K., & Sutherland, J. (2020). The Scrum guide: The definitive guide to Scrum: The rules of the game. Scrum.org. https://scrumguides.org

Sommerville, I. (2016). Software engineering (10.a ed.). Pearson.