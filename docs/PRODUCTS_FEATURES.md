# Products & Features Management System

## Overview

Sistema di gestione delle feature/prodotti basato sulla tabella `user_product_activations` che collega utenti e prodotti con stati multipli.

## Database Schema

### Tabella: `user_product_activations`

```sql
CREATE TABLE user_product_activations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'paused', 'inactive')),
  activated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### Stati Disponibili

- **`active`**: Feature abilitata e utilizzabile dall'utente
- **`paused`**: Feature temporaneamente sospesa (es: manutenzione, utente in ferie)
- **`inactive`**: Feature disabilitata dall'utente o amministratore
- **`not_activated`**: Feature mai attivata (stato implicito, no record nel DB)

## Frontend Usage

### 1. Importare il Servizio

```typescript
import { 
  getProductsWithStatus, 
  toggleUserProduct,
  hasActiveProduct,
  getActiveUserProducts
} from '@/services/products.service';
```

### 2. Mostrare Lista Feature

```tsx
import { ProductsList } from '@/components/ProductsList';

function FeaturesPage() {
  return (
    <div>
      <h1>Gestione Feature</h1>
      <ProductsList />
    </div>
  );
}
```

### 3. Verificare se Utente Ha Feature Attiva

```typescript
// Check singola feature
const hasHeating = await hasActiveProduct(userId, 'heating-product-id');

if (hasHeating) {
  // Mostra funzionalità riscaldamento
}

// Ottieni tutte le feature attive
const activeProducts = await getActiveUserProducts(userId);
console.log('Active products:', activeProducts);
```

### 4. Toggle Feature (Active ↔ Inactive)

```typescript
// Attiva feature
await toggleUserProduct(userId, productId, 'active');

// Disattiva feature
await toggleUserProduct(userId, productId, 'inactive');
```

## API Endpoint

### GET `/api/user/has-product`

Verifica se un utente ha una feature attiva.

**Query Parameters:**
- `userId` (required): ID dell'utente
- `productId` (required): ID del prodotto

**Response:**

```json
{
  "hasFeature": true,
  "status": "active",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "productId": "heating-system",
  "timestamp": "2026-01-09T10:30:00.000Z"
}
```

**Stati Possibili:**
- `"active"` → `hasFeature: true`
- `"paused"` → `hasFeature: false`
- `"inactive"` → `hasFeature: false`
- `"not_activated"` → `hasFeature: false`

**Esempio di Chiamata:**

```typescript
const response = await fetch(
  `/api/user/has-product?userId=${userId}&productId=${productId}`
);
const data = await response.json();

if (data.hasFeature) {
  console.log('User can access this feature');
}
```

## Gestione Stati

### Attivazione Iniziale

Quando un utente si registra o acquista un piano, attiva le feature di default:

```typescript
import { activateProduct } from '@/services/products.service';

// Attiva singola feature
await activateProduct('heating-product-id');

// Oppure attiva tutte le feature
import { activateAllProducts } from '@/services/products.service';
await activateAllProducts();
```

### Sospensione Temporanea

Quando una subscription scade o richiede manutenzione:

```typescript
import { pauseUserProduct } from '@/services/products.service';

await pauseUserProduct(userId, productId);
```

### Riattivazione

```typescript
import { resumeProduct } from '@/services/products.service';

await resumeProduct(productId);
```

### Disattivazione Permanente

```typescript
import { deactivateProduct } from '@/services/products.service';

await deactivateProduct(productId);
```

## UI Components

### ProductsList Component

Componente React che mostra tutte le feature con toggle switch.

**Features:**
- ✅ Lista prodotti con status in tempo reale
- ✅ Toggle switch per enable/disable
- ✅ Badge di categoria (GUEST, REVENUE, OPS, PLAYBOOK)
- ✅ Indicatore costo crediti
- ✅ Status badge (active/paused/inactive)
- ✅ Disabilita toggle se feature in pausa
- ✅ Loading e error states
- ✅ Responsive design

**Props:** Nessuna, gestisce tutto internamente

**Styling:** Importa automaticamente `ProductsList.css`

## Best Practices

### 1. Check Feature Prima dell'Uso

```typescript
// ❌ BAD: Assumere che utente abbia feature
function showHeatingDashboard() {
  // Display heating controls
}

// ✅ GOOD: Verificare prima
async function showHeatingDashboard() {
  const hasFeature = await hasActiveProduct(userId, 'heating');
  
  if (!hasFeature) {
    return <UpgradePrompt feature="heating" />;
  }
  
  return <HeatingDashboard />;
}
```

### 2. Cache Status Lato Client

```typescript
// Usa React Query o SWR per cachare
import { useQuery } from '@tanstack/react-query';

function useUserProducts(userId: string) {
  return useQuery({
    queryKey: ['user-products', userId],
    queryFn: () => getProductsWithStatus(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
```

### 3. Gestione Errori

```typescript
try {
  await toggleUserProduct(userId, productId, 'active');
  showSuccessToast('Feature activated');
} catch (error) {
  console.error('Failed to toggle feature:', error);
  showErrorToast('Failed to update feature. Please try again.');
  // Ricarica stato per sincronizzare UI
  await loadProducts();
}
```

### 4. Sincronizzazione Real-time (Opzionale)

```typescript
import { supabase } from '@/lib/supabase';

// Subscribe to changes
const subscription = supabase
  .channel('user_product_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_product_activations',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Product status changed:', payload);
      // Refresh products list
      loadProducts();
    }
  )
  .subscribe();

// Cleanup
return () => subscription.unsubscribe();
```

## Security

### RLS Policies (Supabase)

Assicurati che le policy RLS siano configurate:

```sql
-- Users can only read their own activations
CREATE POLICY "Users can view own activations"
  ON user_product_activations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update own activations
CREATE POLICY "Users can update own activations"
  ON user_product_activations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Only service role can insert
CREATE POLICY "Service role can insert"
  ON user_product_activations
  FOR INSERT
  WITH CHECK (true);
```

## Testing

```typescript
import { describe, it, expect } from 'vitest';
import { toggleUserProduct, hasActiveProduct } from './products.service';

describe('Products Service', () => {
  it('should toggle product status', async () => {
    await toggleUserProduct(userId, productId, 'active');
    const isActive = await hasActiveProduct(userId, productId);
    expect(isActive).toBe(true);
    
    await toggleUserProduct(userId, productId, 'inactive');
    const isInactive = await hasActiveProduct(userId, productId);
    expect(isInactive).toBe(false);
  });
});
```

## Troubleshooting

### Feature non si attiva

1. Verifica che l'utente sia autenticato
2. Controlla che il `product_id` esista nella tabella `products`
3. Verifica le RLS policies su Supabase
4. Controlla console per errori

### Status non si aggiorna in UI

1. Verifica che `loadProducts()` venga chiamato dopo toggle
2. Controlla che lo stato React si aggiorni correttamente
3. Usa React DevTools per ispezionare lo stato

### API ritorna 500

1. Verifica che `VITE_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` siano configurati
2. Controlla i log Vercel/API
3. Verifica che la tabella `user_product_activations` esista

## Migration Guide

Se hai già un sistema di feature flags diverso, puoi migrare così:

```typescript
// Da boolean flags a user_product_activations
async function migrateUserFeatures(userId: string, oldFeatures: Record<string, boolean>) {
  for (const [productCode, isEnabled] of Object.entries(oldFeatures)) {
    const product = await getProductByCode(productCode);
    if (product && isEnabled) {
      await toggleUserProduct(userId, product.id, 'active');
    }
  }
}
```

## Roadmap

- [ ] Webhook per notificare cambi status
- [ ] Analytics su usage feature
- [ ] A/B testing per feature
- [ ] Feature flags condizionali (es: attive solo in certe regioni)
- [ ] Limiti di utilizzo per feature (rate limiting)
