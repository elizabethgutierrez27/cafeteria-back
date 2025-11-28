FROM node:18-alpine

# Directorio dentro del contenedor
WORKDIR /usr/src/app

# Copiar solo archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias en modo producción
RUN npm ci --only=production

# Copiar el resto de tu proyecto
COPY . .

# El puerto REAL de tu backend (cámbialo si usas otro)
EXPOSE 3000

# Comando de inicio
CMD ["node", "server.js"]
