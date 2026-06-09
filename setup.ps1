# Script de Setup Automático para Mecanica PRO (Windows)
# Uso: powershell -ExecutionPolicy Bypass -File setup.ps1 alvaro
# Ejemplo: powershell -ExecutionPolicy Bypass -File setup.ps1 alvaro

param(
    [string]$Nombre = ""
)

if ([string]::IsNullOrEmpty($Nombre)) {
    Write-Host "❌ Falta tu nombre" -ForegroundColor Red
    Write-Host "Uso: powershell -ExecutionPolicy Bypass -File setup.ps1 [alvaro|brayan|daniel]"
    exit 1
}

# Validar nombre
if ($Nombre -notmatch '^(alvaro|brayan|daniel)$') {
    Write-Host "❌ Nombre no válido. Usa: alvaro, brayan o daniel" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Configurando Mecanica PRO para: $Nombre" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Verificar Node.js
Write-Host "✅ Verificando Node.js..."
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "Descargalo desde: https://nodejs.org"
    exit 1
}
$nodeVersion = (node -v)
Write-Host "   Versión: $nodeVersion"

# 2. Verificar Git
Write-Host "✅ Verificando Git..."
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git no está instalado" -ForegroundColor Red
    exit 1
}

# 3. Clonar repo (si no existe)
if (-not (Test-Path "Mecanica_PRO")) {
    Write-Host "📥 Clonando repositorio..."
    git clone https://github.com/AlvaroJose388/Mecanica_PRO.git
    Set-Location "Mecanica_PRO"
} else {
    Write-Host "📁 Repositorio ya existe, usando directorio existente"
    Set-Location "Mecanica_PRO"
}

# 4. Cambiar a rama
Write-Host "🔄 Cambiando a rama: feature/$Nombre"
git fetch origin
git checkout "feature/$Nombre"

# 5. Instalar dependencias
Write-Host "📦 Instalando dependencias (esto toma 1-2 minutos)..."
npm install

# 6. Crear archivo .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "🔐 Creando .env.local..."
    Copy-Item ".env.example" ".env.local"
    Write-Host "   ⚠️  Abre .env.local y completa DATABASE_URL"
}

# 7. Mensaje final
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "✨ ¡Configuración completada!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Host "📋 Próximos pasos:"
Write-Host ""
Write-Host "1️⃣  Abre .env.local y agrega tu DATABASE_URL"
Write-Host ""
Write-Host "2️⃣  Inicia el servidor:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3️⃣  Abre en navegador:"
Write-Host "   http://localhost:9002"
Write-Host ""
Write-Host "📚 Documentación:"
Write-Host "   - docs/GUIA_TRABAJO_EQUIPO.md"
Write-Host "   - docs/SETUP_DESARROLLO.md"
Write-Host ""
$branch = (git branch --show-current)
Write-Host "💡 Rama actual: $branch"
Write-Host ""
