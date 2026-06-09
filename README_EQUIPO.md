# 🏎️ MecanicaPro - Plataforma SaaS de Gestión Automotriz

> **Sistema inteligente de gestión de talleres automotrices con CRM, inventario, órdenes de servicio y asistente IA.**

---

## 🚀 Setup Rápido (30 segundos)

### Para Windows
```powershell
powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/AlvaroJose388/Mecanica_PRO/develop/setup.ps1' -OutFile 'setup.ps1'; & '.\setup.ps1' alvaro"
```
*Reemplaza `alvaro` con tu nombre: `brayan` o `daniel`*

### Para Mac/Linux
```bash
curl -O https://raw.githubusercontent.com/AlvaroJose388/Mecanica_PRO/develop/setup.sh
chmod +x setup.sh
./setup.sh alvaro
```

---

## 📋 Requisitos Previos

- ✅ **Node.js 20+** - [Descargar](https://nodejs.org)
- ✅ **Git** - [Descargar](https://git-scm.com)
- ✅ **PostgreSQL** (Neon) - [Crear cuenta gratis](https://neon.tech)
- ✅ **VS Code** - [Descargar](https://code.visualstudio.com)

---

## 👥 Estructura del Equipo

| Rol | Rama | Responsabilidad |
|-----|------|-----------------|
| 🎨 **Alvaro** | `feature/alvaro` | Frontend, Diseño, Componentes |
| 🗄️ **Brayan** | `feature/brayan` | Base de datos, Schema, SQL |
| 🔧 **Daniel** | `feature/daniel` | Backend, APIs, Lógica |

---

## 📚 Documentación Importante

1. **[SETUP_RAPIDO.md](SETUP_RAPIDO.md)** ← Lee esto primero
2. **[docs/GUIA_TRABAJO_EQUIPO.md](docs/GUIA_TRABAJO_EQUIPO.md)** - Cómo trabajar en equipo
3. **[docs/SETUP_DESARROLLO.md](docs/SETUP_DESARROLLO.md)** - Configuración detallada
4. **[docs/COMPONENTES_FEEDBACK.md](docs/COMPONENTES_FEEDBACK.md)** - Componentes UI

---

## ⚙️ Comandos Principales

```bash
# Desarrollo
npm run dev          # Inicia servidor en http://localhost:9002

# Validación
npm run typecheck    # Verificar tipos TypeScript
npm run lint         # Análisis de código (ESLint)
npm run test         # Ejecutar tests

# Producción
npm run build        # Compilar para producción
npm start            # Iniciar servidor de producción
```

---

## 🔄 Flujo de Trabajo

```
1. git checkout feature/tu-nombre
2. Haz cambios y commits
3. git push origin feature/tu-nombre
4. Crea Pull Request en GitHub
5. Espera aprobación
6. Merge a develop
```

**Nunca hagas commit directamente a `master` o `develop`**

---

## 🏗️ Arquitectura

```
Mecanica_PRO/
├── src/
│   ├── components/        ← Componentes React (Alvaro)
│   ├── app/              ← Páginas y layouts (Alvaro)
│   ├── app/actions/      ← Server actions/APIs (Daniel)
│   ├── ai/               ← Lógica de IA (Daniel)
│   ├── lib/
│   │   ├── schema.ts     ← Tablas BD (Brayan)
│   │   ├── db.ts         ← Conexión BD (Brayan)
│   │   └── types.ts      ← Tipos TypeScript
│   └── hooks/            ← Custom React hooks
├── docs/                 ← Documentación
├── .github/workflows/    ← CI/CD (GitHub Actions)
├── jest.config.js        ← Configuración de tests
└── tsconfig.json         ← Configuración TypeScript
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS, Radix UI
- **BD**: PostgreSQL (Neon), Drizzle ORM
- **Backend**: Next.js Server Actions
- **IA**: Google Genkit
- **Testing**: Jest
- **CI/CD**: GitHub Actions

---

## 🚨 Problemas Comunes

### Error: "DATABASE_URL no encontrada"
```bash
# 1. Copia el archivo de ejemplo
cp .env.example .env.local

# 2. Edita .env.local con tu URL de Neon
# DATABASE_URL="postgresql://..."
```

### Error: "Port 9002 already in use"
```bash
npm run dev -- -p 3000  # Cambiar puerto
```

### Error: "Cannot find module @/..."
```bash
npm install  # Reinstalar dependencias
```

---

## 📞 Contacto & Soporte

- 🐛 **Bugs**: Crear issue en GitHub
- ❓ **Preguntas**: Preguntar en el grupo/Discord
- 📚 **Docs**: Ver carpeta `docs/`

---

## 📊 Status

- ✅ Repositorio configurado
- ✅ CI/CD configurado (GitHub Actions)
- ✅ Componentes de feedback visual
- ✅ Documentación de equipo
- ✅ Setup automático

---

## 📝 Licencia

Proyecto privado © 2026 AlvaroJose388

---

**¡Bienvenido al equipo! Empieza leyendo [SETUP_RAPIDO.md](SETUP_RAPIDO.md)** 🚀
