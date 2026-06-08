# 🚀 Guía de Trabajo en Equipo - Mecanica PRO

## 🏗️ Estrategia de Branching (Git Flow)

### Estructura de Ramas

```
master (Producción - ESTABLE)
  ↓
develop (Staging/Integración)
  ↓
  ├── feature/alvaro (Diseño/Frontend)
  ├── feature/brayan (Base de Datos)
  ├── feature/daniel (Backend)
  └── feature/[tu-nombre]
```

---

## 👥 Asignación de Responsabilidades

### 1. **ALVARO - Frontend/Diseño** 
   - **Rama:** `feature/alvaro`
   - **Archivos:**
     - `src/components/` - Componentes React
     - `src/app/*/page.tsx` - Páginas
     - `src/hooks/` - Custom hooks
     - `tailwind.config.ts` - Estilos globales
   - **Tareas:** UI/UX, diseño, animaciones, responsive

### 2. **BRAYAN - Base de Datos**
   - **Rama:** `feature/brayan`
   - **Archivos:**
     - `src/lib/schema.ts` - Esquema de BD
     - `docs/schema.sql` - SQL queries
     - `src/lib/db.ts` - Configuración de DB
   - **Tareas:** Tablas, relaciones, migraciones, índices, backups

### 3. **DANIEL - Backend**
   - **Rama:** `feature/daniel`
   - **Archivos:**
     - `src/app/actions/` - Server actions
     - `src/ai/` - Lógica de IA
     - `src/lib/` - Utilidades lógica
   - **Tareas:** APIs, lógica de negocio, integraciones

---

## 🔄 Flujo de Trabajo Diario

### Paso 1️⃣: Crear tu rama (Primera vez)
```bash
git checkout develop
git pull origin develop
git checkout -b feature/tu-nombre
```

### Paso 2️⃣: Trabajar en tu rama
```bash
# Hacer cambios...
git add .
git commit -m "Descripción clara del cambio"
```

### Paso 3️⃣: Sincronizar con develop (Importante cada día)
```bash
git fetch origin
git rebase origin/develop
```

### Paso 4️⃣: Subir tu rama
```bash
git push origin feature/tu-nombre
```

### Paso 5️⃣: Crear Pull Request (PR)
1. Ir a GitHub
2. Click en "Compare & pull request"
3. Descripción clara de cambios
4. Esperar review de otros
5. Merge a `develop`

---

## ✅ Reglas Importantes

### ❌ NUNCA hacer commit directo a:
- `master` ← Producción (protegido)
- `develop` ← Solo via Pull Request

### ✅ SIEMPRE:
- Hacer commits pequeños y descriptivos
- Sincronizar con develop antes de pushear
- Hacer PR en lugar de merge directo
- Esperar aprobación del equipo
- Escribir descripción clara en PR

---

## 🔀 Flujo de Merges

```
feature/alvaro ──┐
                 ├──> develop (aquí se integra todo)
feature/brayan ──┤         ↓
                 ├──> master (cuando está listo para producción)
feature/daniel ──┘
```

### Cuando integrar a develop:
```bash
# En tu rama feature/tu-nombre
git add .
git commit -m "Feature completo"
git push origin feature/tu-nombre

# Luego en GitHub crear Pull Request a develop
```

### Cuando integrar a master (Producción):
```bash
# Solo el LÍDER del proyecto
git checkout master
git pull origin master
git merge develop
git tag v1.0.0
git push origin master --tags
```

---

## 📋 Ejemplos de Commits Bien Hechos

✅ **Bien:**
```
git commit -m "Agregar componente de Login mejorado con validación"
git commit -m "Crear tabla de usuarios con índices"
git commit -m "Implementar endpoint de autenticación"
```

❌ **Mal:**
```
git commit -m "fix"
git commit -m "cambios"
git commit -m "asdf"
```

---

## 🆘 Solucionar Conflictos

Si hay conflicto al hacer rebase:

```bash
# 1. Ver archivos en conflicto
git status

# 2. Editar manualmente los archivos (marca <<<<<<, =====, >>>>>>)

# 3. Resolver y continuar
git add .
git rebase --continue

# 4. Si algo sale mal
git rebase --abort
```

---

## 📊 Ver Estado del Proyecto

```bash
# Ver todas las ramas locales
git branch

# Ver todas las ramas en GitHub
git branch -r

# Ver cambios en tu rama vs develop
git diff develop...feature/tu-nombre

# Ver últimos commits
git log --oneline -10
```

---

## 🚨 Checklist Antes de Pushear

- [ ] Código sin errores: `npm run typecheck`
- [ ] Sin problemas de linting: `npm run lint`
- [ ] Tests pasando: `npm run test`
- [ ] Sincronizado con develop: `git fetch && git rebase origin/develop`
- [ ] Commits descriptivos y pequeños
- [ ] Sin secretos o variables sensibles en el código

---

## 📱 Comandos Útiles Rápidos

```bash
# Cambiar de rama
git checkout feature/alvaro

# Ver cambios antes de commitear
git diff

# Deshacer último commit (si no hizo push)
git reset --soft HEAD~1

# Ver commits que faltan en develop
git log origin/develop..HEAD

# Limpiar ramas locales antiguas
git branch -d feature/vieja
```

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si hago cambios en develop por accidente?**
R: No importa, solo no hagas push. Cambia a tu rama: `git checkout feature/tu-nombre`

**P: ¿Puedo trabajar en 2 ramas a la vez?**
R: Sí, pero debes switchear: `git checkout feature/otra-rama`

**P: ¿Cómo me mantengo actualizado con los cambios de otros?**
R: Cada mañana: `git fetch origin && git rebase origin/develop`

**P: ¿Se borra mi rama después de mergear a develop?**
R: En GitHub se puede marcar "delete branch after merge". Localmente: `git branch -d feature/tu-nombre`

---

## 🎯 Tu Próximo Paso

1. Asegúrate de estar en la rama correcta: `git branch`
2. Sincroniza: `git pull origin develop`
3. ¡Empieza a trabajar en tu feature!
4. Cuando termines → Pull Request

**¿Preguntas? Pregunta en el equipo antes de hacer cambios grandes.**
