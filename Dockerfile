# DevLaunch frontend — Vite build served by nginx
FROM node:22-alpine AS build

WORKDIR /app

# VITE_ vars are baked into the bundle at build time — passed as a
# --build-arg from GitHub Actions, not as a runtime env var.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- serve ---
FROM nginx:1.27-alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
