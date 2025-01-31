from node:20-alpine3.21

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm run build-only
EXPOSE 5080

CMD ["pnpm","run","preview"]