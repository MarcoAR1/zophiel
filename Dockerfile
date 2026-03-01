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
FROM deps AS build-shared
COPY packages/shared/ packages/shared/
RUN pnpm --filter @zophiel/shared build

# ── Build server ──
FROM build-shared AS build-server
COPY apps/server/ apps/server/
RUN cd apps/server && npx prisma generate
RUN pnpm --filter @zophiel/server build

# ── Production ──
FROM base AS production
COPY --from=deps /app/node_modules node_modules/
COPY --from=deps /app/apps/server/node_modules apps/server/node_modules/
COPY --from=deps /app/packages/shared/node_modules packages/shared/node_modules/
COPY --from=build-shared /app/packages/shared/dist packages/shared/dist/
COPY --from=build-shared /app/packages/shared/package.json packages/shared/
COPY --from=build-server /app/apps/server/dist apps/server/dist/
COPY --from=build-server /app/apps/server/package.json apps/server/
COPY --from=build-server /app/apps/server/prisma apps/server/prisma/
COPY --from=build-server /app/apps/server/node_modules/.prisma apps/server/node_modules/.prisma/

ENV NODE_ENV=production
EXPOSE 3001

WORKDIR /app/apps/server
CMD ["node", "dist/index.js"]
