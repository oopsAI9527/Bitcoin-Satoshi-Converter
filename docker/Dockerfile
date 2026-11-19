# build
FROM --platform=$BUILDPLATFORM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY index.html vite.config.ts tsconfig.json vite-env.d.ts ./
COPY public ./public
COPY src ./src
COPY tests ./tests
RUN npm run build

# production
FROM nginx:1.31.9-alpine
USER root
RUN sed -i \
      -e 's/^worker_processes .*/worker_processes 1;/' \
      -e 's|^pid .*|pid /tmp/nginx.pid;|' \
      /etc/nginx/nginx.conf \
    && printf '%s\n' \
      'client_body_temp_path /tmp/client_temp;' \
      'proxy_temp_path       /tmp/proxy_temp;' \
      'fastcgi_temp_path     /tmp/fastcgi_temp;' \
      'uwsgi_temp_path       /tmp/uwsgi_temp;' \
      'scgi_temp_path        /tmp/scgi_temp;' \
      > /etc/nginx/conf.d/00-runtime.conf
USER 1000:1000
COPY --from=build /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
