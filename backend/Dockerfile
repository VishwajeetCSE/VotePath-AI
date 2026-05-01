FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

# Expose the port Cloud Run expects
EXPOSE 8080

# Command to run the application
CMD [ "npm", "start" ]
