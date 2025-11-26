FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de manifiesto de dependencias para aprovechar el caché de Docker
COPY ./cafeteria-back/package*.json ./

# Instala todas las dependencias del proyecto
RUN npm install

# Copia el resto del código fuente del backend al contenedor
COPY ./cafeteria-back .

# Expón el puerto que usa tu backend (Asumo el puerto 3000 por defecto)
EXPOSE 3000

# Comando para ejecutar la aplicación
# Asegúrate de que tu script 'start' en package.json sea el correcto
CMD [ "npm", "start" ]