/**
 * EMAIL SERVICE
 * Gestione invio email transazionali
 */

// ============================================================================
// TYPES
// ============================================================================

export interface WelcomeEmailData {
    to: string;
    firstName: string;
    lastName: string;
    businessName: string;
    planName: string;
    credits: number;
    invoiceUrl?: string;
}

export interface PaymentConfirmationData {
    to: string;
    firstName: string;
    orderNumber: string;
    planName: string;
    amount: number;
    credits: number;
    invoiceUrl?: string;
}

// ============================================================================
// EMAIL SENDING (tramite backend API)
// ============================================================================

/**
 * Invia email di benvenuto dopo registrazione completata
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const endpoint = `${backendUrl}/api/email/welcome`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: data.to,
                subject: `Benvenuto in Armonyco, ${data.firstName}!`,
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    businessName: data.businessName,
                    planName: data.planName,
                    credits: data.credits,
                    invoiceUrl: data.invoiceUrl,
                    dashboardUrl: `${window.location.origin}/app/dashboard`,
                    documentationUrl: `${window.location.origin}/docs`,
                },
            }),
        });

        if (!response.ok) {
            throw new Error('Errore invio email');
        }

        console.log('[Email] Welcome email inviata a:', data.to);
        return true;
    } catch (error: any) {
        console.error('[Email] Errore invio welcome email:', error);
        // Non bloccare il flusso se l'email fallisce
        return false;
    }
}

/**
 * Invia email di conferma pagamento
 */
export async function sendPaymentConfirmation(data: PaymentConfirmationData): Promise<boolean> {
    try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const endpoint = `${backendUrl}/api/email/payment-confirmation`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: data.to,
                subject: 'Conferma Pagamento - Armonyco',
                data: {
                    firstName: data.firstName,
                    orderNumber: data.orderNumber,
                    planName: data.planName,
                    amount: data.amount,
                    credits: data.credits,
                    invoiceUrl: data.invoiceUrl,
                    date: new Date().toLocaleDateString('it-IT', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }),
                },
            }),
        });

        if (!response.ok) {
            throw new Error('Errore invio email conferma');
        }

        console.log('[Email] Payment confirmation email inviata a:', data.to);
        return true;
    } catch (error: any) {
        console.error('[Email] Errore invio payment confirmation:', error);
        return false;
    }
}

// ============================================================================
// MOCK EMAIL (per sviluppo senza backend)
// ============================================================================

/**
 * Simula invio email per testing locale
 */
export async function mockSendEmail(
    type: 'welcome' | 'payment',
    data: WelcomeEmailData | PaymentConfirmationData
): Promise<boolean> {
    console.warn(`[Email] MOCK - Invio email tipo "${type}" a:`, data.to);
    console.log('[Email] MOCK - Dati email:', data);

    // Simula delay network
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[Email] MOCK - Email "${type}" inviata con successo`);
            resolve(true);
        }, 500);
    });
}

/**
 * Mock welcome email
 */
export async function mockWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    return mockSendEmail('welcome', data);
}

/**
 * Mock payment confirmation
 */
export async function mockPaymentConfirmation(data: PaymentConfirmationData): Promise<boolean> {
    return mockSendEmail('payment', data);
}

// ============================================================================
// EMAIL TEMPLATES (HTML per preview/debug)
// ============================================================================

/**
 * Genera HTML template per email di benvenuto
 */
export function generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Benvenuto in Armonyco</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #ffd700; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { display: inline-block; background: #ffd700; color: #000; padding: 12px 30px; 
                  text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .info-box { background: #fff; border-left: 4px solid #ffd700; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Benvenuto in Armonyco!</h1>
        </div>
        <div class="content">
            <h2>Ciao ${data.firstName},</h2>
            <p>
                Grazie per esserti registrato su Armonyco! Il tuo account è ora attivo e pronto all'uso.
            </p>
            
            <div class="info-box">
                <h3>📋 Riepilogo Registrazione</h3>
                <p><strong>Azienda:</strong> ${data.businessName}</p>
                <p><strong>Piano:</strong> ${data.planName}</p>
                <p><strong>Crediti:</strong> ${data.credits.toLocaleString('it-IT')} ArmoCredits©</p>
                <p><strong>Email:</strong> ${data.to}</p>
            </div>

            <p>
                Puoi iniziare subito ad utilizzare la piattaforma accedendo alla tua dashboard.
            </p>

            <center>
                <a href="${window.location.origin}/app/dashboard" class="button">
                    Vai alla Dashboard
                </a>
            </center>

            ${data.invoiceUrl ? `
            <p style="margin-top: 30px;">
                <strong>Fattura:</strong> La tua fattura è disponibile 
                <a href="${data.invoiceUrl}">qui</a>.
            </p>
            ` : ''}

            <p style="margin-top: 30px;">
                Hai bisogno di aiuto? Consulta la nostra 
                <a href="${window.location.origin}/docs">documentazione</a> o 
                <a href="mailto:support@armonyco.com">contatta il supporto</a>.
            </p>

            <p>
                A presto,<br>
                <strong>Il Team Armonyco</strong>
            </p>
        </div>
        <div class="footer">
            <p>© 2026 Armonyco. Tutti i diritti riservati.</p>
            <p>
                <a href="${window.location.origin}/privacy">Privacy Policy</a> | 
                <a href="${window.location.origin}/terms">Termini e Condizioni</a>
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Genera HTML template per conferma pagamento
 */
export function generatePaymentConfirmationHTML(data: PaymentConfirmationData): string {
    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conferma Pagamento</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: #fff; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .success-icon { font-size: 48px; }
        .info-box { background: #fff; border: 1px solid #ddd; padding: 20px; margin: 20px 0; }
        .total { font-size: 24px; color: #10b981; font-weight: bold; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✓</div>
            <h1>Pagamento Confermato!</h1>
        </div>
        <div class="content">
            <h2>Ciao ${data.firstName},</h2>
            <p>
                Il tuo pagamento è stato elaborato con successo. 
                Grazie per aver scelto Armonyco!
            </p>
            
            <div class="info-box">
                <h3>📄 Dettagli Ordine</h3>
                <p><strong>Numero Ordine:</strong> ${data.orderNumber}</p>
                <p><strong>Piano:</strong> ${data.planName}</p>
                <p><strong>Crediti:</strong> ${data.credits.toLocaleString('it-IT')} ArmoCredits©</p>
                <p><strong>Data:</strong> ${new Date().toLocaleDateString('it-IT')}</p>
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
                <p class="total">Totale: €${(data.amount / 100).toFixed(2)}</p>
                <p style="font-size: 12px; color: #666;">IVA inclusa</p>
            </div>

            ${data.invoiceUrl ? `
            <p>
                <strong>Fattura:</strong> Puoi scaricare la tua fattura 
                <a href="${data.invoiceUrl}">cliccando qui</a>.
            </p>
            ` : ''}

            <p>
                I tuoi crediti sono stati accreditati immediatamente sul tuo account
                e sono pronti per essere utilizzati.
            </p>

            <p style="margin-top: 30px;">
                Domande? Scrivici a 
                <a href="mailto:billing@armonyco.com">billing@armonyco.com</a>
            </p>

            <p>
                Cordiali saluti,<br>
                <strong>Il Team Armonyco</strong>
            </p>
        </div>
        <div class="footer">
            <p>© 2026 Armonyco. Tutti i diritti riservati.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

// ============================================================================
// EXPORT SERVICE
// ============================================================================

export const emailService = {
    sendWelcomeEmail,
    sendPaymentConfirmation,
    mockWelcomeEmail,
    mockPaymentConfirmation,
    generateWelcomeEmailHTML,
    generatePaymentConfirmationHTML,
};

