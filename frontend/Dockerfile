# -------- Build aşaması --------
FROM node:20-alpine AS build
WORKDIR /app

# 1) package.json + lock dosyasını kopyala
COPY package*.json ./
RUN npm ci

# 2) Kalan kaynakları kopyala
COPY . .
RUN npm run build          # Vite → dist/

# prod aşaması
FROM nginx:1.27-alpine

# custom conf ekle
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

