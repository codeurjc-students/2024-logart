# Etapa de build del frontend
FROM node:20 AS frontend-build

WORKDIR /app/frontend

COPY frontend/LogArt-frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/LogArt-frontend/ ./
RUN npm run build

# Etapa final (backend)
FROM node:20 AS production

WORKDIR /app/backend

# Primero copiamos solo package.json y package-lock.json del backend
COPY backend/package*.json ./

# Instalamos las dependencias de compilación y luego las dependencias del backend
# Aquí es donde bcrypt se compila correctamente para el entorno actual
RUN apt-get update && apt-get install -y make gcc g++ python3 && \
  npm install --legacy-peer-deps && \
  npm rebuild bcrypt --build-from-source && \
  apt-get remove -y make gcc g++ python3 && apt-get autoremove -y && \
  rm -rf /var/lib/apt/lists/*
RUN ls -la

# Ahora copiamos el resto del backend
COPY backend/ ./
RUN ls -la


RUN apt-get update && apt-get install -y make gcc g++ python3 && \
  npm rebuild bcrypt --build-from-source && \
  apt-get remove -y make gcc g++ python3 && apt-get autoremove -y && \
  rm -rf /var/lib/apt/lists/*

# Copiamos el build del frontend
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 443
ENV NODE_ENV=production
ENV PORT=443

CMD [ "node", "server.js" ]
