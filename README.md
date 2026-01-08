# Armonyco V2 Core Protocol

A high-fidelity Decision Infrastructure and Operating System for institutional hospitality.

## 🚀 Production Readiness Checklist

This repository is equipped with the **Plumb-Line™ Strategy**, allowing a seamless transition from mock data to real production environments.

### Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_MODE` | Switch between `mock` and `real` data. | `mock` |
| `VITE_API_URL` | Base URL for your production backend. | `https://api.armonyco.com` |
| `VITE_API_TOKEN` | Static authorization token for testing. | - |
| `GEMINI_API_KEY` | Required for AI-driven intelligence features. | - |

---

## 🛠 Project Setup

### Local Development

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment**
   Copy `.env.example` to `.env.local` and fill in the values.
   ```bash
   cp .env.example .env.local
   ```
4. **Run Development Server**

   **Opzione 1: Solo Frontend (senza API Stripe)**
   ```bash
   npm run dev
   ```
   ⚠️ **Nota:** Le API Stripe non funzioneranno con questa opzione. Usa l'Opzione 2 per testare il pagamento.

   **Opzione 2: Frontend + API (consigliato per testare Stripe)**
   ```bash
   # Installa Vercel CLI se non l'hai già fatto
   npm install -g vercel
   
   # Avvia il server con API
   npm run dev:vercel
   ```
   Questo avvia sia il frontend che le API serverless, permettendo di testare il flusso completo di pagamento.

### Quality Hygiene

Maintain code standards using our automated tools:
- `npm run lint`: Checks for code style and potential errors.
- `npm run format`: Automatically formats the codebase.
- `npm run typecheck`: Validates TypeScript types across the project.

---

## 🏗 Deployment Guide

### Vercel / Netlify (Recommended)

1. Connect your Github repository.
2. Set the Build Command: `npm run build`.
3. Set the Output Directory: `dist`.
4. Add the Environment Variables listed above in the platform's dashboard.

### Troubleshooting

- **CORS Errors**: Ensure your `VITE_API_URL` is whitelisted in your backend's CORS policy.
- **Type Compatibility**: If you update the backend, ensure you mirror the changes in `src/types/index.ts`.
- **Latency**: Adjust `MOCK_DELAY` in `api.config.ts` to simulate different network conditions.

---

## 🏛 Architecture Governance

- **`/src/services`**: Central orchestration of data fetching and business logic.
- **`/src/types`**: Unified source of truth for all domain entities.
- **`/components/ui`**: Atomic design components for modularity.
- **`index.css`**: Design tokens and global aesthetic governance (Mate Glass, Cyber-Luxury).

---

© 2026 Armonyco. Institutional Truth & Operational Harmony.
