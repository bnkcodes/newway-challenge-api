FROM node:20-alpine AS build

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 100000

COPY . .

RUN yarn prisma generate
RUN yarn build

FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile --network-timeout 100000

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

RUN yarn prisma generate

RUN chown -R nestjs:nodejs /usr/src/app

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["yarn", "start:prod"]
