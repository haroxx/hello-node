FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --omit=dev || true
EXPOSE 3000
CMD ["npm", "start"]
