FROM mhart/alpine-node:12

WORKDIR /api
ADD ./src/* ./src
ADD ./package.json .
RUN npm install
EXPOSE 8080
CMD ["node", "src/app.js"]