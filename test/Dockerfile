FROM node:18.12.1

WORKDIR /server

COPY . .

RUN apt update && apt install -y g++ cmake
RUN npm install -g cmake-js
RUN npm install
RUN cmake-js rebuild

CMD [ "node", "server.js" ]

