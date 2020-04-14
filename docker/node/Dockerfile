FROM mhart/alpine-node:12

WORKDIR /api
ADD ./src/* ./src/
ADD ./package.json ./
RUN npm install
CMD ["node", "src/app.js"]