FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

ENV TZ=America/Sao_Paulo

COPY ./src                  ./src
COPY tsconfig.json          .
COPY tsconfig.build.json    .
COPY package.json           .
COPY yarn.lock              .
COPY nest-cli.json          .
COPY .swcrc                 .

RUN yarn

RUN yarn run build

RUN yarn install --production

FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

COPY --from=0 /app/dist             .
COPY --from=0 /app/node_modules     ./node_modules

CMD ["node", "--enable-source-maps", "main.js"]
