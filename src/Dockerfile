FROM node

WORKDIR /usr/src/app

RUN npm install -g nodemon

# Copy package.json and install dependencies
COPY ../package*.json ./  
RUN npm install

# Copy everything inside /src (since Dockerfile is inside src)
COPY . .

# Copy index.js from the root of your project
COPY ../index.js ./ 

EXPOSE 5000

CMD ["npx", "nodemon", "--legacy-watch", "index.js"]
