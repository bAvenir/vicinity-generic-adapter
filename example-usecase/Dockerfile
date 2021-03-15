FROM node:12-slim
ENV NODE_ENV=production
EXPOSE 5000
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package*.json mockserver.js ./
RUN npm ci && npm cache clean --force
CMD ["node", "mockserver.js"]