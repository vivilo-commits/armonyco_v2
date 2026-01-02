# Backend Plumbing Architecture

This project is prepared for real backend integration using a standardized service layer.

## How to Switch Between Mock and Real API

1. Open `src/config/api.config.ts`.
2. Change the `MODE` variable:
   ```typescript
   export const API_CONFIG = {
     MODE: 'real', // Switch from 'mock' to 'real'
     // ...
   };
   ```
3. Ensure `NEXT_PUBLIC_API_URL` is set in your `.env` file.

## Folder Structure

- `src/config/`: Central configuration for API endpoints and environments.
- `src/types/`: Centralized TypeScript interfaces for all domain entities.
- `src/services/`: Domain-specific logic. All UI components consume data from here.
- `src/mocks/`: Mock data generators and static fixtures.

## Adding a New Service

1. Define the interface in `src/types/index.ts`.
2. Create the service in `src/services/your.service.ts`.
3. Use the `apiClient` to handle both mock and real data:
   ```typescript
   export const yourService = {
     getData: () => apiClient.get('/endpoint', mockData)
   };
   ```
