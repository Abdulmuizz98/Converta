FROM node:20 AS base
WORKDIR /usr/src/app
COPY package.json yarn.lock /
RUN yarn install


FROM base AS development
COPY . .
EXPOSE 8000
EXPOSE 3000
CMD [ "yarn", "run", "dev" ]


FROM base AS production 
COPY . .
EXPOSE 8000
EXPOSE 3000
CMD ["yarn", "run", "build", "&&", "yarn", "run", "start"]


