FROM mhart/alpine-node:12

WORKDIR /api
ADD ../src/** .
RUN npm install
EXPOSE 8080
CMD ["node", "app.js"]