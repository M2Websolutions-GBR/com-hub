FROM node:lts-alpine AS buildstage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:latest AS productionstage
COPY --from=buildstage /app/dist/ /usr/share/nginx/html
# COPY /app/max-body-size.conf /etc/nginx/conf.d/max-body-size.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]