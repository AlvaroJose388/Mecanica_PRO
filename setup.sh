#!/bin/bash
# Script de Setup Automático para Mecanica PRO
# Uso: bash setup.sh [tu-nombre]
# Ejemplo: bash setup.sh alvaro

set -e

NOMBRE=${1:-}

if [ -z "$NOMBRE" ]; then
  echo "❌ Falta tu nombre"
  echo "Uso: bash setup.sh [alvaro|brayan|daniel]"
  exit 1
fi

# Validar nombre
if [[ ! "$NOMBRE" =~ ^(alvaro|brayan|daniel)$ ]]; then
  echo "❌ Nombre no válido. Usa: alvaro, brayan o daniel"
  exit 1
fi

echo "🚀 Configurando Mecanica PRO para: $NOMBRE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Verificar Node.js
echo "✅ Verificando Node.js..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no está instalado"
  echo "Descargalo desde: https://nodejs.org"
  exit 1
fi
NODE_VERSION=$(node -v)
echo "   Versión: $NODE_VERSION"

# 2. Verificar Git
echo "✅ Verificando Git..."
if ! command -v git &> /dev/null; then
  echo "❌ Git no está instalado"
  exit 1
fi

# 3. Clonar repo (si no existe)
if [ ! -d "Mecanica_PRO" ]; then
  echo "📥 Clonando repositorio..."
  git clone https://github.com/AlvaroJose388/Mecanica_PRO.git
  cd Mecanica_PRO
else
  echo "📁 Repositorio ya existe, usando directorio existente"
  cd Mecanica_PRO
fi

# 4. Cambiar a rama
echo "🔄 Cambiando a rama: feature/$NOMBRE"
git fetch origin
git checkout feature/$NOMBRE

# 5. Instalar dependencias
echo "📦 Instalando dependencias (esto toma 1-2 minutos)..."
npm install

# 6. Crear archivo .env.local
if [ ! -f ".env.local" ]; then
  echo "🔐 Creando .env.local..."
  cp .env.example .env.local
  echo "   ⚠️  Abre .env.local y completa DATABASE_URL"
fi

# 7. Mensaje final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ ¡Configuración completada!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1️⃣  Abre .env.local y agrega tu DATABASE_URL"
echo ""
echo "2️⃣  Inicia el servidor:"
echo "   npm run dev"
echo ""
echo "3️⃣  Abre en navegador:"
echo "   http://localhost:9002"
echo ""
echo "📚 Documentación:"
echo "   - docs/GUIA_TRABAJO_EQUIPO.md"
echo "   - docs/SETUP_DESARROLLO.md"
echo ""
echo "💡 Rama actual: feature/$NOMBRE"
echo "🌳 Estado: $(git status -s | wc -l) cambios"
echo ""
