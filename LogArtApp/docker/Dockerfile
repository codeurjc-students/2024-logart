FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/LogArt-frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/LogArt-frontend/ ./
RUN npm run build

FROM node:20-alpine AS backend-build
WORKDIR /app/backend
RUN apk add --no-cache make gcc g++ python3
COPY backend/package*.json ./
RUN npm install --legacy-peer-deps
COPY backend/ ./
RUN npm rebuild bcrypt --build-from-source
RUN npm prune --production
RUN npm cache clean --force
RUN apk del make gcc g++ python3

FROM node:20-alpine AS production
WORKDIR /app/backend
COPY --from=backend-build /app/backend ./
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 443
ENV NODE_ENV=production
ENV PORT=443

CMD [ "node", "server.js" ]
