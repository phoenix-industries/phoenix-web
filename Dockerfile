FROM node:24-alpine AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY . ./

ENV NODE_ENV="production"

RUN pnpm run build

FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/.output ./

ARG PORT=3000
EXPOSE $PORT

CMD ["node", "/app/server/index.mjs"]
