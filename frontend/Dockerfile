
FROM node:18 AS build
RUN npm install -g http-server
WORKDIR /app/frontend

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

