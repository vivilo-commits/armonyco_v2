/**
 * EMAIL SERVICE
 * Transactional email sending management
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
// EMAIL SENDING (via backend API)
// ============================================================================

/**
 * Sends welcome email after registration completed
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
                subject: `Welcome to Armonyco, ${data.firstName}!`,
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
            throw new Error('Error sending email');
        }

        console.log('[Email] Welcome email sent to:', data.to);
        return true;
    } catch (error: any) {
        console.error('[Email] Error sending welcome email:', error);
        // Don't block flow if email fails
        return false;
    }
}

/**
 * Sends payment confirmation email
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
                subject: 'Payment Confirmation - Armonyco',
                data: {
                    firstName: data.firstName,
                    orderNumber: data.orderNumber,
                    planName: data.planName,
                    amount: data.amount,
                    credits: data.credits,
                    invoiceUrl: data.invoiceUrl,
                    date: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }),
                },
            }),
        });

        if (!response.ok) {
            throw new Error('Error sending confirmation email');
        }

        console.log('[Email] Payment confirmation email sent to:', data.to);
        return true;
    } catch (error: any) {
        console.error('[Email] Error sending payment confirmation:', error);
        return false;
    }
}

// ============================================================================
// MOCK EMAIL (for development without backend)
// ============================================================================

/**
 * Simulates email sending for local testing
 */
export async function mockSendEmail(
    type: 'welcome' | 'payment',
    data: WelcomeEmailData | PaymentConfirmationData
): Promise<boolean> {
    console.warn(`[Email] MOCK - Sending email type "${type}" to:`, data.to);
    console.log('[Email] MOCK - Email data:', data);

    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[Email] MOCK - Email "${type}" sent successfully`);
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
// EMAIL TEMPLATES (HTML for preview/debug)
// ============================================================================

/**
 * Generates HTML template for welcome email
 */
export function generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Armonyco</title>
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
            <h1>🎉 Welcome to Armonyco!</h1>
        </div>
        <div class="content">
            <h2>Hello ${data.firstName},</h2>
            <p>
                Thank you for registering with Armonyco! Your account is now active and ready to use.
            </p>
            
            <div class="info-box">
                <h3>📋 Registration Summary</h3>
                <p><strong>Company:</strong> ${data.businessName}</p>
                <p><strong>Plan:</strong> ${data.planName}</p>
                <p><strong>Credits:</strong> ${data.credits.toLocaleString('en-US')} ArmoCredits©</p>
                <p><strong>Email:</strong> ${data.to}</p>
            </div>

            <p>
                You can start using the platform right away by accessing your dashboard.
            </p>

            <center>
                <a href="${window.location.origin}/app/dashboard" class="button">
                    Go to Dashboard
                </a>
            </center>

            ${data.invoiceUrl ? `
            <p style="margin-top: 30px;">
                <strong>Invoice:</strong> Your invoice is available 
                <a href="${data.invoiceUrl}">here</a>.
            </p>
            ` : ''}

            <p style="margin-top: 30px;">
                Need help? Check out our 
                <a href="${window.location.origin}/docs">documentation</a> or 
                <a href="mailto:support@armonyco.com">contact support</a>.
            </p>

            <p>
                Best regards,<br>
                <strong>The Armonyco Team</strong>
            </p>
        </div>
        <div class="footer">
            <p>© 2026 Armonyco. All rights reserved.</p>
            <p>
                <a href="${window.location.origin}/privacy">Privacy Policy</a> | 
                <a href="${window.location.origin}/terms">Terms and Conditions</a>
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Generates HTML template for payment confirmation
 */
export function generatePaymentConfirmationHTML(data: PaymentConfirmationData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
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
            <h1>Payment Confirmed!</h1>
        </div>
        <div class="content">
            <h2>Hello ${data.firstName},</h2>
            <p>
                Your payment has been processed successfully. 
                Thank you for choosing Armonyco!
            </p>
            
            <div class="info-box">
                <h3>📄 Order Details</h3>
                <p><strong>Order Number:</strong> ${data.orderNumber}</p>
                <p><strong>Plan:</strong> ${data.planName}</p>
                <p><strong>Credits:</strong> ${data.credits.toLocaleString('en-US')} ArmoCredits©</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US')}</p>
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
                <p class="total">Total: €${(data.amount / 100).toFixed(2)}</p>
                <p style="font-size: 12px; color: #666;">VAT included</p>
            </div>

            ${data.invoiceUrl ? `
            <p>
                <strong>Invoice:</strong> You can download your invoice 
                <a href="${data.invoiceUrl}">by clicking here</a>.
            </p>
            ` : ''}

            <p>
                Your credits have been credited immediately to your account
                and are ready to use.
            </p>

            <p style="margin-top: 30px;">
                Questions? Contact us at 
                <a href="mailto:billing@armonyco.com">billing@armonyco.com</a>
            </p>

            <p>
                Best regards,<br>
                <strong>The Armonyco Team</strong>
            </p>
        </div>
        <div class="footer">
            <p>© 2026 Armonyco. All rights reserved.</p>
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

