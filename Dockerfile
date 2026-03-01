FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
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
# Stage Prisma client to a known path (resolve pnpm symlinks)
RUN mkdir -p /prisma-client /prisma-at-client && \
    cp -rL $(find /app/node_modules -path "*/.prisma/client" -type d | head -1) /prisma-client/ && \
    cp -rL $(find /app/node_modules -path "*/@prisma/client" -type d | head -1) /prisma-at-client/

# ── Production ──
FROM base AS production
WORKDIR /app

# Install production deps only
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY --from=build /app/apps/server/package.json apps/server/
COPY --from=build /app/packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --prod

# Copy built code
COPY --from=build /app/packages/shared/dist packages/shared/dist/
COPY --from=build /app/apps/server/dist apps/server/dist/
COPY --from=build /app/apps/server/prisma apps/server/prisma/

# Copy pre-generated Prisma client
COPY --from=build /prisma-client/client/ node_modules/.prisma/client/
COPY --from=build /prisma-at-client/client/ node_modules/@prisma/client/

ENV NODE_ENV=production
EXPOSE 3001

WORKDIR /app/apps/server
CMD ["node", "dist/index.js"]
