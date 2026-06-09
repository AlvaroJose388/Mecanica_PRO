# ⚙️ Guía de Configuración del Ambiente de Desarrollo

## 🖥️ Requisitos Previos

- **Node.js 20+** - Descarga desde [nodejs.org](https://nodejs.org)
- **Git** - Para control de versiones
- **VSCode** - Editor recomendado
- **PostgreSQL** - Para base de datos (Neon en la nube)

---

## 🚀 Instalación Inicial (Primera Vez)

### 1. Clonar el repositorio
```bash
git clone https://github.com/AlvaroJose388/Mecanica_PRO.git
cd Mecanica_PRO
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con tus datos
# DATABASE_URL=postgresql://user:password@host/database
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

Accede a: **http://localhost:9002**

---

## 👤 Configuración por Rol

### 👨‍🎨 ALVARO - Frontend/Diseño

**Extensiones recomendadas para VSCode:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- Thunder Client (para probar APIs)

**Comandos útiles:**
```bash
# Ver cambios en tiempo real
npm run dev

# Verificar que no hay errores TypeScript
npm run typecheck

# Ejecutar linter
npm run lint

# Arreglar problemas automáticamente
npx next lint --fix
```

**Carpetas principales:**
- `src/components/` - Componentes reutilizables
- `src/app/` - Páginas y layouts
- `src/hooks/` - Custom React hooks

---

### 🗄️ BRAYAN - Base de Datos

**Herramientas recomendadas:**
- **DBeaver** - GUI para PostgreSQL
- **Neon Dashboard** - Manage tu base de datos en la nube
- **SQL formatter** - Extension VSCode

**Comandos útiles:**
```bash
# Conectar a la base de datos
psql "tu-database-url"

# Ver esquema actual
SELECT * FROM information_schema.tables;

# Ver migraciones (si usas Drizzle)
npm run db:generate
npm run db:push
```

**Carpetas principales:**
- `src/lib/schema.ts` - Definición de tablas (Drizzle ORM)
- `docs/schema.sql` - SQL queries útiles

---

### 🔧 DANIEL - Backend

**Herramientas recomendadas:**
- **REST Client** - Extension VSCode
- **Thunder Client** - Probar APIs
- **Postman** - Cliente HTTP avanzado

**Comandos útiles:**
```bash
# Verificar que no hay errores TypeScript
npm run typecheck

# Ejecutar tests
npm run test

# Tests en tiempo real
npm run test:watch

# Cobertura de tests
npm run test:coverage
```

**Carpetas principales:**
- `src/app/actions/` - Server actions (API)
- `src/ai/` - Integración de IA
- `src/lib/` - Funciones de negocio

---

## 🔄 Flujo de Trabajo Diario

### Mañana
```bash
# 1. Traer cambios más recientes
git fetch origin

# 2. Actualizar tu rama con develop
git rebase origin/develop

# 3. Instalar dependencias si cambiaron
npm install
```

### Durante el Día
```bash
# Hacer cambios y commits regulares
git add .
git commit -m "Descripción del cambio"
git push origin feature/tu-nombre
```

### Final del Día
```bash
# Crear Pull Request en GitHub
# O actualizar el existente si ya lo creaste
```

---

## ✅ Checklist Antes de Pushear

- [ ] Sin errores TypeScript: `npm run typecheck`
- [ ] Pasa linting: `npm run lint`
- [ ] Tests pasan: `npm run test`
- [ ] Cambios sincronizados: `git fetch && git rebase origin/develop`
- [ ] Commits descriptivos

---

## 🐛 Solucionar Problemas Comunes

### Error: "Cannot find module '@/lib/db'"
```bash
# Solución: Reinstalar dependencias
rm -rf node_modules
npm install
```

### Error: "DATABASE_URL no encontrada"
```bash
# Solución: Verificar que .env.local existe
cat .env.local  # Debe mostrar DATABASE_URL

# Si no existe:
cp .env.example .env.local
# Y llenar los datos reales
```

### Error: "Port 9002 already in use"
```bash
# Cambiar puerto
npm run dev -- -p 3000

# O matar proceso en puerto 9002
lsof -ti:9002 | xargs kill -9
```

### Conflicto de merge
```bash
# Ver el archivo con conflicto
git status

# Resolver manualmente (editar archivo)

# Continuar merge
git add .
git rebase --continue
```

---

## 📊 Monitorear el Proyecto

### CI/CD Pipeline
```
Cada push → GitHub Actions
├── npm ci (instalar)
├── npm run lint (ESLint)
├── npm run typecheck (TypeScript)
└── npm run test (Jest)
```

**Ver resultados:**
1. Ir a GitHub → Actions
2. Ver status de tu rama

### Localmente
```bash
# Simular el CI/CD antes de pushear
npm run typecheck && npm run lint && npm run test
```

---

## 🆘 Contactar para Ayuda

- 🐛 **Bug encontrado:** Crear issue en GitHub
- ❓ **Pregunta técnica:** Preguntar en el grupo
- 🚀 **Feature nueva:** Discutir en el PR

---

## 📚 Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Git Docs](https://git-scm.com/docs)

---

**¡Bienvenido al equipo! Si tienes dudas, pregunta ahora mismo. Estamos para ayudarte.** 🎉
