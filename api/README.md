# API Backend per Stripe e Registrazione

Queste sono le serverless functions di Vercel per gestire pagamenti Stripe e invio email.

## Setup

### 1. Installa dipendenze backend

```bash
npm install stripe @sendgrid/mail @vercel/node
```

### 2. Configura variabili ambiente

Crea un file `.env` o configura su Vercel Dashboard:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid (o altro servizio email)
SENDGRID_API_KEY=SG....
FROM_EMAIL=noreply@armonyco.com

# Supabase (se necessario per webhook)
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
```

### 3. Configura Webhook Stripe

1. Vai su Stripe Dashboard > Developers > Webhooks
2. Aggiungi endpoint: `https://tuodominio.com/api/webhooks/stripe`
3. Seleziona eventi:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copia il webhook secret in `STRIPE_WEBHOOK_SECRET`

### 4. Deploy su Vercel

```bash
vercel --prod
```

## Endpoints

### POST /api/stripe/create-checkout

Crea una sessione Stripe Checkout.

**Body:**
```json
{
  "planId": 1,
  "planName": "STARTER",
  "amount": 30428,
  "credits": 25000,
  "email": "user@azienda.it",
  "metadata": {
    "firstName": "Mario",
    "lastName": "Rossi",
    "businessName": "Azienda SRL",
    "vatNumber": "12345678901"
  },
  "successUrl": "https://...",
  "cancelUrl": "https://..."
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### GET /api/stripe/verify-payment?session_id=...

Verifica lo stato di un pagamento.

**Response:**
```json
{
  "status": "success",
  "paymentIntentId": "pi_...",
  "amount": 30428,
  "metadata": {...}
}
```

### POST /api/webhooks/stripe

Gestisce webhook Stripe (chiamato automaticamente da Stripe).

### POST /api/email/welcome

Invia email di benvenuto.

**Body:**
```json
{
  "to": "user@azienda.it",
  "subject": "Benvenuto in Armonyco",
  "data": {
    "firstName": "Mario",
    "planName": "STARTER",
    "credits": 25000,
    "dashboardUrl": "https://..."
  }
}
```

## Testing Locale

Per testare in locale:

```bash
vercel dev
```

Gli endpoint saranno disponibili su `http://localhost:3000/api/...`

## Note Importanti

- ⚠️ Le funzioni sono in modalità MOCK finché non configuri le chiavi API
- ⚠️ Decommentare il codice Stripe nelle funzioni dopo aver configurato le chiavi
- ⚠️ Il webhook richiede che il body parser sia disabilitato (già configurato)
- ⚠️ Testare con carte di test Stripe: https://stripe.com/docs/testing

## Carte di Test Stripe

- **Successo:** 4242 4242 4242 4242
- **Richiede 3D Secure:** 4000 0025 0000 3155
- **Fallimento:** 4000 0000 0000 9995
- **Scadenza:** Qualsiasi data futura
- **CVV:** Qualsiasi 3 cifre
- **CAP:** Qualsiasi 5 cifre

