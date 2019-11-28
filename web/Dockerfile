FROM node:lts

ADD package.json .
ADD package-lock.json .
RUN npm install
ADD . .

CMD ["npm", "start"]
