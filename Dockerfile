# --- Build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# URL du comparateur de prix (optionnelle, modifiable ensuite dans Paramètres)
ARG VITE_PRICE_API_URL=""
ENV VITE_PRICE_API_URL=$VITE_PRICE_API_URL
RUN npm run build

# --- Runtime ---
FROM nginx:1.27-alpine
COPY deploy/nginx.docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
