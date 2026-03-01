FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ── Install all dependencies ──
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY apps/server/package.json apps/server/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile

# ── Build everything ──
FROM deps AS build
COPY packages/shared/ packages/shared/
RUN pnpm --filter @zophiel/shared build
COPY apps/server/ apps/server/
RUN cd apps/server && pnpm exec prisma generate
RUN pnpm --filter @zophiel/server build

# Use pnpm deploy to create a standalone package with all deps resolved
RUN pnpm --filter @zophiel/server deploy --legacy --prod /deployed

# Copy built artifacts into deployed directory
RUN cp -r /app/apps/server/dist /deployed/dist
RUN cp -r /app/apps/server/prisma /deployed/prisma
RUN cp -r /app/packages/shared/dist /deployed/node_modules/@zophiel/shared/dist

# Copy Prisma generated client
RUN mkdir -p /deployed/node_modules/.prisma && \
    cp -rL $(find /app/node_modules -path "*/.prisma/client" -type d | head -1) /deployed/node_modules/.prisma/

# ── Production ──
FROM node:22-slim AS production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=build /deployed .

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/index.js"]
