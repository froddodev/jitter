FROM node:20-slim

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

USER node
COPY --chown=node:node package*.json ./
RUN npm install --omit=dev

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "start"]