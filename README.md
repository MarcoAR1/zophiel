# 🩺 Zophiel — Chronic Pain Tracker

Aplicación de seguimiento de dolor crónico y calidad de vida. Monorepo con backend API, frontend SPA/PWA y soporte para builds nativos Android/iOS.

## Estructura

```
zophiel/
├── packages/shared/     # Tipos, constantes, validadores
├── apps/server/         # Express + Prisma API
└── apps/client/         # React + Vite SPA/PWA + Capacitor
```

## Setup

```bash
# Instalar dependencias
pnpm install

# Migrar base de datos
cd apps/server && npx prisma migrate dev --name init

# Seed de preguntas
pnpm --filter @zophiel/server run db:seed

# Dev (server + client en paralelo)
pnpm dev
```

## Tech Stack

- **Backend**: Express 5, Prisma (SQLite), JWT
- **Frontend**: React 19, Vite, Chart.js
- **PWA**: vite-plugin-pwa
- **Mobile**: Capacitor 6 (Android + iOS)
- **Validation**: Zod (shared)

## Features

- 📝 Registro de dolor NRS 0-10 con región corporal y tipo
- 🩹 Tracking de síntomas con severidad
- ❓ Cuestionarios diarios categorizados (dolor, ánimo, actividad, sueño)
- 📊 Gráficos de tendencia y promedios de dolor
- 💯 Índice de Calidad de Vida (QoL) compuesto
- 🔔 Notificaciones configurables (low/medium/high) con horas silenciosas
- 🌙 Dark mode con glassmorphism
