FROM node:lts-alpine3.14
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && rm -rf node_modules && npm install
#RUN npm install
# RUN npm install pm2 -g
# ENV PM2_PUBLIC_KEY hor2yr068bibz88
# ENV PM2_SECRET_KEY 81823uwur3yq7e6
EXPOSE 12000
EXPOSE 12001
COPY . .
RUN npm run build
#CMD ["sh","-c","pm2-runtime dest/app.js"]
CMD ["sh","-c", "npm run dev"]