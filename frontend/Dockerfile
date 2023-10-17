FROM node:18
WORKDIR /frontend
COPY package.json yarn.lock /frontend/
RUN CI=true
COPY . /frontend/
RUN yarn 
RUN yarn build
CMD ["yarn", "dev", "-H", "0.0.0.0"]