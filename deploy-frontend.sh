#!/bin/bash

# Colores para los mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración SSH
SSH_USER="sumaradmin"
SSH_HOST="10.5.5.228"
SSH_KEY="~/.ssh/id_rsa"
SSH_OPTIONS="-o StrictHostKeyChecking=no -o ConnectTimeout=60 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -i $SSH_KEY"

# Función para ejecutar comandos SSH
ssh_cmd() {
    ssh $SSH_OPTIONS "$SSH_USER@$SSH_HOST" "$1"
}

# Función para copiar archivos
scp_cmd() {
    local source="$1"
    local target="$2"
    print_message "Copiando $source a $target..."
    if ! scp -r $SSH_OPTIONS "$source" "$SSH_USER@$SSH_HOST:$target"; then
        print_error "Error al copiar $source al servidor"
        return 1
    fi
    return 0
}

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar que el archivo .env.production existe
if [ ! -f ".env.production" ]; then
    print_error "No se encontró .env.production. Asegúrate de tener el archivo de configuración de producción."
    exit 1
fi

# Verificar que NEXT_PUBLIC_API_URL está definido en .env.production
if ! grep -q "NEXT_PUBLIC_API_URL=" .env.production; then
    print_error "NEXT_PUBLIC_API_URL no está definido en .env.production"
    exit 1
fi

# Limpiar la carpeta de construcción anterior si existe
print_message "Cleaning previous build..."
if [ -d ".next" ]; then
    rm -rf .next
fi

# Construir la aplicación
print_message "Building application..."
if ! npm run build; then
    print_error "Error al construir la aplicación"
    exit 1
fi

# Crear archivo ecosystem.config.js para PM2 si no existe
if [ ! -f "ecosystem.config.js" ]; then
    print_message "Creating PM2 ecosystem config..."
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'sigep',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 80
      }
    }
  ]
};
EOF
fi

print_message "Preparando archivos para copia..."
FILES_TO_COPY=()
if [ -d ".next" ]; then
    FILES_TO_COPY+=(".next")
else
    print_error "No se encontró el directorio .next"
    exit 1
fi

if [ -f "package.json" ]; then
    FILES_TO_COPY+=("package.json")
else
    print_error "No se encontró package.json"
    exit 1
fi

if [ -f "package-lock.json" ]; then
    FILES_TO_COPY+=("package-lock.json")
    print_message "Se encontró package-lock.json, se usará para la instalación"
fi

if [ -f "ecosystem.config.js" ]; then
    FILES_TO_COPY+=("ecosystem.config.js")
else
    print_warning "No se encontró ecosystem.config.js, se creará uno nuevo"
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'sigep',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 80
      }
    }
  ]
};
EOF
    FILES_TO_COPY+=("ecosystem.config.js")
fi

if [ -d "public" ]; then
    FILES_TO_COPY+=("public")
else
    print_warning "No se encontró el directorio public"
fi

# Copiar archivos al servidor
print_message "Copiando archivos al servidor..."
for file in "${FILES_TO_COPY[@]}"; do
    if ! scp_cmd "$file" "/var/www/sigep/"; then
        exit 1
    fi
done

# Copiar y renombrar el archivo de entorno
print_message "Copying environment file..."
if ! ssh_cmd "cd /var/www/sigep && rm -f .env"; then
    print_warning "No se pudo eliminar el archivo .env anterior (puede no existir)"
fi

if ! scp_cmd .env.production "/var/www/sigep/.env"; then
    print_error "Error al copiar el archivo de entorno"
    exit 1
fi

# Verificar que el archivo .env se copió correctamente
print_message "Verifying .env file on server..."
if ! ssh_cmd "cd /var/www/sigep && \
    echo '=== Content of .env file ===' && \
    cat .env && \
    echo '=== End of .env file ===' && \
    echo '=== Checking NEXT_PUBLIC_API_URL ===' && \
    grep NEXT_PUBLIC_API_URL .env"; then
    print_error "Error al verificar el archivo .env en el servidor"
    exit 1
fi

# Instalar dependencias y reiniciar en el servidor
print_message "Instalando dependencias y reiniciando en el servidor..."
if ! ssh_cmd "cd /var/www/sigep && \
    echo 'Instalando dependencias...' && \
    npm install --omit=dev --legacy-peer-deps && \
    echo 'Verificando instalación...' && \
    ls -la node_modules/next/dist/bin/next && \
    echo 'Deteniendo servicio anterior...' && \
    pm2 delete sigep || true && \
    echo 'Iniciando nuevo servicio...' && \
    pm2 start ecosystem.config.js && \
    echo 'Guardando configuración de PM2...' && \
    pm2 save"; then
    print_error "Error al instalar dependencias o reiniciar el servicio"
    print_warning "Verificando logs de PM2..."
    ssh_cmd "pm2 logs sigep --lines 20"
    exit 1
fi

# Verificar el estado del servicio
print_message "Verificando estado del servicio..."
if ! ssh_cmd "pm2 status sigep"; then
    print_error "Error al verificar el estado del servicio"
    exit 1
fi

# Mostrar logs
print_message "Mostrando logs del servicio..."
ssh_cmd "pm2 logs sigep --lines 20"

print_message "Despliegue completado exitosamente!"