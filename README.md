<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Armonyco V2 - Operational Governance Engine

## Design Philosophy: Black & Mate Gold
Armonyco V2 is built on a premium "Mate Glass" aesthetic. The design system prioritizes legibility, luxury, and professional grit.
- **Color Hygiene**: ZERO pure black (#000). We use a deep mate grey (#050505) to ensure depth and premium texture.
- **Glassmorphism**: Standardized `Mate Glass` blur (24px) across all overlays, modals, and dropdowns.
- **Interactions**: Subtle, institutional-grade micro-animations (scale-up on hover, fade-in transitions).

## Architecture
- **Framework**: React + Vite + Tailwind CSS.
- **State Management**: React Context + Hooks.
- **Assets**: Optimized PNGs for logos, Lucide-React for icons.
- **Structure**:
    - `/src`: Core logic, hooks, services, and central components.
    - `/components`: UI library (landing & app-specific).
    - `/pages`: View definitions (Dashboard, AGS, AEM, etc.).
    - `index.css`: Central source of truth for design tokens.

View your app in AI Studio: https://ai.studio/apps/drive/1LZRmNUUlfAfUMzXkY_OqBqhrb7r0mMeP

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
