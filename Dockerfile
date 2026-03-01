FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ── Install dependencies ──
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY apps/server/package.json apps/server/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile

# ── Build shared package ──
FROM deps AS build
COPY packages/shared/ packages/shared/
RUN pnpm --filter @zophiel/shared build

# ── Build server ──
COPY apps/server/ apps/server/
RUN cd apps/server && npx prisma generate
RUN pnpm --filter @zophiel/server build

# ── Production ──
FROM base AS production
WORKDIR /app

# Copy package files and install production deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY --from=build /app/apps/server/package.json apps/server/
COPY --from=build /app/packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts
COPY --from=build /app/packages/shared/dist packages/shared/dist/
COPY --from=build /app/apps/server/dist apps/server/dist/
COPY --from=build /app/apps/server/prisma apps/server/prisma/

# Generate Prisma client in production
RUN cd apps/server && npx prisma generate

ENV NODE_ENV=production
EXPOSE 3001

WORKDIR /app/apps/server
CMD ["node", "dist/index.js"]
