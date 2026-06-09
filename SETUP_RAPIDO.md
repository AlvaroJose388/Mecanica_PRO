# 🚀 Setup Automático - Mecanica PRO

Para que **cada integrante del equipo se configure en 30 segundos**, usamos estos scripts.

---

## 🖥️ Para Windows (Recomendado)

### Paso 1: Abre PowerShell

Presiona `Win + X` → Selecciona "PowerShell" o "Windows Terminal"

### Paso 2: Copia y pega este comando

```powershell
powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/AlvaroJose388/Mecanica_PRO/develop/setup.ps1' -OutFile 'setup.ps1'; & '.\setup.ps1' alvaro"
```

**Reemplaza `alvaro` con:**
- `alvaro` → Si eres Alvaro
- `brayan` → Si eres Brayan  
- `daniel` → Si eres Daniel

### Paso 3: Presiona Enter y espera

El script automáticamente:
- ✅ Clona el repositorio
- ✅ Cambio a tu rama (feature/tu-nombre)
- ✅ Instala todas las dependencias
- ✅ Crea el archivo .env.local

---

## 🐧 Para Mac/Linux

### Paso 1: Abre Terminal

### Paso 2: Copia y pega este comando

```bash
curl -O https://raw.githubusercontent.com/AlvaroJose388/Mecanica_PRO/develop/setup.sh
chmod +x setup.sh
./setup.sh alvaro
```

**Reemplaza `alvaro` con tu nombre:** `brayan` o `daniel`

### Paso 3: Presiona Enter

---

## ⚠️ Importante: Configurar DATABASE_URL

Después del setup, abre el archivo `.env.local` y completa:

```
DATABASE_URL="postgresql://usuario:contraseña@host/database"
```

Si no tienes, pide a Brayan o usa Neon (gratis): https://neon.tech

---

## ✅ Verificar que Funcionó

Después del setup, ejecuta:

```bash
npm run dev
```

Deberías ver:
```
▲ Next.js 15.x
- Local:        http://localhost:9002
```

Abre en navegador y ¡listo!

---

## 🆘 Si Algo Sale Mal

### Error: "comando no encontrado"

Significa que Node.js o Git no están instalados:
- [Instalar Node.js](https://nodejs.org)
- [Instalar Git](https://git-scm.com)

### Error: "Access Denied"

Abre PowerShell como Administrador (Click derecho → "Run as administrator")

### Error: "DATABASE_URL no encontrada"

Abre `.env.local` y completa la URL de tu base de datos

---

## 📝 Después del Setup

1. **Lee**: `docs/GUIA_TRABAJO_EQUIPO.md`
2. **Lee**: `docs/SETUP_DESARROLLO.md`
3. **Trabaja** en tu rama: `feature/tu-nombre`
4. **Haz commits** pequeños y descriptivos
5. **Haz PR** (Pull Request) a `develop` cuando termines

---

## 💡 Comandos Útiles Después

```bash
# Ver cambios en tiempo real
npm run dev

# Verificar errores TypeScript
npm run typecheck

# Ejecutar linter
npm run lint

# Ver estatus de Git
git status

# Hacer commit
git add .
git commit -m "Descripción de cambios"

# Subir cambios
git push origin feature/tu-nombre
```

---

**¿Preguntas? Pregunta a tu equipo o en el grupo.** 🎉
