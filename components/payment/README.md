# Sistema di Pagamento Stripe con PaymentElement

Questo sistema implementa pagamenti one-time utilizzando Stripe Payment Intent e PaymentElement, permettendo pagamenti embedded direttamente nella tua applicazione.

## Caratteristiche

- ✅ **PaymentElement**: Componente unificato che supporta carte, wallet (Apple Pay, Google Pay), e altri metodi di pagamento
- ✅ **Testing locale**: Supporto completo per test in ambiente locale con Stripe CLI
- ✅ **Sicurezza**: Validazione webhook, gestione errori sicura
- ✅ **UX moderna**: Loading states, gestione errori, conferma pagamento

## Setup

### 1. Configurazione Variabili d'Ambiente

Aggiungi al tuo `.env.local`:

```env
# Frontend
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Backend (Vercel Dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Ottieni le chiavi da: https://dashboard.stripe.com/test/apikeys

### 2. Configurazione Webhook (per testing locale)

Per testare i webhook in locale:

```bash
# Installa Stripe CLI
# Windows: https://github.com/stripe/stripe-cli/releases
# Mac: brew install stripe/stripe-cli/stripe
# Linux: vedi documentazione Stripe

# Login
stripe login

# Forward webhook events to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Il comando ti fornirà un `whsec_...` da usare come `STRIPE_WEBHOOK_SECRET` in locale.

### 3. Configurazione Webhook (produzione)

1. Vai su Stripe Dashboard → Developers → Webhooks
2. Aggiungi endpoint: `https://tuodominio.com/api/webhooks/stripe`
3. Seleziona eventi:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copia il webhook secret in `STRIPE_WEBHOOK_SECRET` su Vercel

## Utilizzo

### Esempio Base

```tsx
import { PaymentExample } from './components/payment/PaymentExample';

function CheckoutPage() {
    const handleSuccess = (paymentIntentId: string) => {
        console.log('Payment succeeded:', paymentIntentId);
        // Redirect to success page
    };

    const handleError = (error: string) => {
        console.error('Payment error:', error);
        // Show error message
    };

    return (
        <PaymentExample
            amount={30428} // €304.28 in cents
            email="user@example.com"
            userId="user_123"
            metadata={{
                firstName: "Mario",
                lastName: "Rossi",
                planId: "1",
            }}
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
}
```

### Utilizzo Avanzato

Se vuoi più controllo, usa direttamente `PaymentContainer`:

```tsx
import { useState, useEffect } from 'react';
import { PaymentContainer } from './components/payment/PaymentContainer';
import { createPaymentIntent } from './src/services/payment.service';

function CustomCheckout() {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        const initPayment = async () => {
            const result = await createPaymentIntent({
                amount: 30428,
                currency: 'eur',
                email: 'user@example.com',
                metadata: { planId: '1' },
            });
            setClientSecret(result.clientSecret);
        };
        initPayment();
    }, []);

    if (!clientSecret) return <div>Loading...</div>;

    return (
        <PaymentContainer
            clientSecret={clientSecret}
            amount={30428}
            currency="eur"
            onSuccess={(id) => console.log('Success:', id)}
        />
    );
}
```

## Testing

### Carte di Test

Usa queste carte per testare:

- **Successo**: `4242 4242 4242 4242`
- **3D Secure richiesto**: `4000 0025 0000 3155`
- **Pagamento rifiutato**: `4000 0000 0000 0002`

Per tutte le carte:
- **Data**: Qualsiasi data futura (es. 12/25)
- **CVC**: Qualsiasi 3 cifre (es. 123)
- **CAP**: Qualsiasi (es. 12345)

### Testing Webhook Locale

1. Avvia il server locale: `vercel dev` o `npm run dev:vercel`
2. In un altro terminale: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Completa un pagamento di test
4. Verifica i log nel terminale per vedere gli eventi webhook

## Componenti

### `PaymentForm`

Componente principale che contiene il PaymentElement di Stripe.

**Props:**
- `clientSecret`: Client secret del Payment Intent
- `amount`: Importo in centesimi
- `currency`: Valuta (default: 'eur')
- `onSuccess`: Callback quando il pagamento ha successo
- `onError`: Callback in caso di errore
- `metadata`: Metadati aggiuntivi

### `PaymentContainer`

Wrapper che fornisce il contesto Stripe Elements.

**Props:**
- Stesse props di `PaymentForm`
- `stripePublicKey`: Opzionale, usa `VITE_STRIPE_PUBLIC_KEY` se non specificato

### `PaymentExample`

Componente completo che gestisce l'intero flusso (creazione payment intent + form).

**Props:**
- `amount`: Importo in centesimi
- `email`: Email dell'utente
- `userId`: ID utente (opzionale)
- `metadata`: Metadati aggiuntivi
- `onSuccess`: Callback successo
- `onError`: Callback errore

## API Endpoints

### POST `/api/checkout/create-payment-intent`

Crea un Payment Intent.

**Body:**
```json
{
  "amount": 30428,
  "currency": "eur",
  "email": "user@example.com",
  "userId": "user_123",
  "metadata": {
    "planId": "1",
    "planName": "STARTER"
  },
  "description": "Payment description"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "customerId": "cus_xxx",
  "amount": 30428,
  "currency": "eur",
  "status": "requires_payment_method"
}
```

### POST `/api/webhooks/stripe`

Gestisce eventi webhook da Stripe.

**Eventi gestiti:**
- `payment_intent.succeeded`: Pagamento completato con successo
- `payment_intent.payment_failed`: Pagamento fallito

## Sicurezza

- ✅ **Validazione webhook**: Tutti i webhook sono validati con `stripe.webhooks.constructEvent()`
- ✅ **Chiavi segrete**: Mai esposte nel frontend
- ✅ **HTTPS**: Richiesto in produzione
- ✅ **Error handling**: Errori gestiti senza esporre dettagli sensibili

## Troubleshooting

### "Stripe non inizializzato correttamente"

Verifica che `VITE_STRIPE_PUBLIC_KEY` sia impostato in `.env.local` e che inizi con `pk_test_` o `pk_live_`.

### "API endpoint not found (404)"

In locale, usa `vercel dev` invece di `npm run dev` per far funzionare le API serverless.

### Webhook non ricevuti

1. Verifica che `STRIPE_WEBHOOK_SECRET` sia configurato
2. In locale, usa `stripe listen --forward-to localhost:PORT/api/webhooks/stripe`
3. In produzione, verifica l'endpoint su Stripe Dashboard

### Pagamento bloccato

- Verifica che la carta di test sia valida
- Controlla i log di Stripe Dashboard per dettagli
- Alcune carte richiedono 3D Secure (gestito automaticamente)

## Riferimenti

- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe PaymentElement](https://stripe.com/docs/payments/payment-element)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)


