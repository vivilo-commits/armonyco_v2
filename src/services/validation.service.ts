/**
 * VALIDATION SERVICE
 * Funzioni avanzate di validazione per il flusso di registrazione
 */

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

const CONSUMER_EMAIL_DOMAINS = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
    'icloud.com', 'aol.com', 'mail.com', 'libero.it', 'virgilio.it',
    'tiscali.it', 'fastwebnet.it', 'tin.it', 'alice.it', 'email.it'
];

/**
 * Valida formato email (accetta qualsiasi email valida)
 */
export function validateBusinessEmail(email: string): { valid: boolean; error?: string } {
    if (!email || !email.trim()) {
        return { valid: false, error: 'Email richiesta' };
    }

    // Validazione formato base
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Formato email non valido' };
    }

    // Accetta tutte le email con formato valido
    return { valid: true };
}

// ============================================================================
// PASSWORD VALIDATION
// ============================================================================

export interface PasswordStrengthResult {
    score: number; // 0-4 (0=molto debole, 4=molto forte)
    feedback: string;
    valid: boolean;
}

/**
 * Valida la forza della password e restituisce feedback
 */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
    if (!password) {
        return { score: 0, feedback: 'Password richiesta', valid: false };
    }

    const length = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    let score = 0;
    let feedback = '';

    // Lunghezza minima
    if (length < 8) {
        return { 
            score: 0, 
            feedback: 'Password troppo corta (minimo 8 caratteri)', 
            valid: false 
        };
    }

    // Calcola score
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (hasLower && hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    // Normalizza score 0-4
    score = Math.min(4, Math.floor(score * 0.8));

    // Validazione requisiti obbligatori
    const valid = length >= 8 && hasUpper && hasNumber && hasSpecial;

    // Feedback
    if (!valid) {
        const missing = [];
        if (!hasUpper) missing.push('1 maiuscola');
        if (!hasNumber) missing.push('1 numero');
        if (!hasSpecial) missing.push('1 carattere speciale');
        feedback = `Mancante: ${missing.join(', ')}`;
    } else {
        switch (score) {
            case 0:
            case 1:
                feedback = 'Password debole';
                break;
            case 2:
                feedback = 'Password media';
                break;
            case 3:
                feedback = 'Password forte';
                break;
            case 4:
                feedback = 'Password molto forte';
                break;
        }
    }

    return { score, feedback, valid };
}

// ============================================================================
// ITALIAN VAT NUMBER VALIDATION (Partita IVA)
// ============================================================================

/**
 * Valida Partita IVA italiana (solo formato - 11 cifre)
 */
export function validateItalianVAT(vat: string): { valid: boolean; error?: string } {
    if (!vat || !vat.trim()) {
        return { valid: false, error: 'Partita IVA richiesta' };
    }

    // Rimuovi spazi e converti in uppercase
    const cleaned = vat.replace(/\s/g, '').toUpperCase();

    // Verifica formato: 11 cifre numeriche
    if (!/^[0-9]{11}$/.test(cleaned)) {
        return { 
            valid: false, 
            error: 'Partita IVA deve contenere esattamente 11 cifre numeriche' 
        };
    }

    return { valid: true };
}

// ============================================================================
// VIES API VALIDATION (EU VAT)
// ============================================================================

export interface VIESResult {
    valid: boolean;
    companyName?: string;
    companyAddress?: string;
    error?: string;
}

/**
 * Valida P.IVA europea tramite API VIES
 * NOTA: VIES è un servizio SOAP, qui usiamo un proxy/wrapper
 */
export async function validateVIES(vat: string, countryCode: string): Promise<VIESResult> {
    try {
        // Pulisci input
        const cleanVAT = vat.replace(/\s/g, '').toUpperCase();
        const cleanCountry = countryCode.toUpperCase();

        // Per Italia, usa validazione locale prima
        if (cleanCountry === 'IT') {
            const localCheck = validateItalianVAT(cleanVAT);
            if (!localCheck.valid) {
                return { valid: false, error: localCheck.error };
            }
        }

        // Chiamata API VIES tramite proxy pubblico
        // NOTA: L'API VIES blocca chiamate dirette dal browser (CORS)
        // In produzione usare un proprio backend per evitare CORS
        const url = `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${cleanCountry}/vat/${cleanVAT}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            // Fallback: se API non disponibile, permetti comunque di procedere
            console.warn('[VIES] API non disponibile, skip validazione');
            return { 
                valid: true, 
                error: 'La verifica P.IVA europea (VIES) non è disponibile dal browser. Puoi comunque procedere.' 
            };
        }

        const data = await response.json();

        if (data.valid === true) {
            return {
                valid: true,
                companyName: data.name || undefined,
                companyAddress: data.address || undefined,
            };
        } else {
            return {
                valid: false,
                error: 'Partita IVA non trovata nel registro europeo VIES',
            };
        }
    } catch (error) {
        console.warn('[VIES] Errore chiamata API (probabilmente CORS):', error);
        // In caso di errore CORS, permetti comunque di procedere
        return { 
            valid: true, 
            error: 'La verifica P.IVA richiede un backend. Puoi comunque procedere con la registrazione.' 
        };
    }
}

// ============================================================================
// CAP (POSTAL CODE) VALIDATION
// ============================================================================

/**
 * Valida CAP italiano (5 cifre)
 */
export function validateItalianCAP(cap: string): { valid: boolean; error?: string } {
    if (!cap || !cap.trim()) {
        return { valid: true }; // CAP è opzionale
    }

    const cleaned = cap.replace(/\s/g, '');

    if (!/^[0-9]{5}$/.test(cleaned)) {
        return { 
            valid: false, 
            error: 'CAP deve contenere esattamente 5 cifre' 
        };
    }

    return { valid: true };
}

// ============================================================================
// SDI CODE VALIDATION
// ============================================================================

/**
 * Valida Codice SDI (7 caratteri alfanumerici o "0000000" per PEC)
 */
export function validateSDI(code: string): { valid: boolean; error?: string } {
    if (!code || !code.trim()) {
        return { valid: true }; // SDI è opzionale se c'è PEC
    }

    const cleaned = code.replace(/\s/g, '').toUpperCase();

    // "0000000" indica che si usa PEC invece di SDI
    if (cleaned === '0000000') {
        return { valid: true };
    }

    // Altrimenti deve essere 7 caratteri alfanumerici
    if (!/^[A-Z0-9]{7}$/.test(cleaned)) {
        return { 
            valid: false, 
            error: 'Codice SDI deve contenere 7 caratteri alfanumerici' 
        };
    }

    return { valid: true };
}

// ============================================================================
// PHONE VALIDATION
// ============================================================================

/**
 * Valida numero di telefono italiano/internazionale
 */
export function validateItalianPhone(phone: string): { valid: boolean; error?: string } {
    if (!phone || !phone.trim()) {
        return { valid: true }; // Telefono è opzionale
    }

    const cleaned = phone.replace(/[\s\-().]/g, '');

    // Formato italiano: +39 o 0039 seguito da 9-10 cifre
    // Formato internazionale: + seguito da 10-15 cifre
    const italianRegex = /^(\+39|0039)?[0-9]{9,10}$/;
    const internationalRegex = /^\+[0-9]{10,15}$/;

    if (!italianRegex.test(cleaned) && !internationalRegex.test(cleaned)) {
        return { 
            valid: false, 
            error: 'Formato telefono non valido (es. +39 333 123 4567)' 
        };
    }

    return { valid: true };
}

// ============================================================================
// FISCAL CODE VALIDATION (Codice Fiscale)
// ============================================================================

/**
 * Valida Codice Fiscale italiano (formato base)
 */
export function validateFiscalCode(code: string): { valid: boolean; error?: string } {
    if (!code || !code.trim()) {
        return { valid: true }; // Codice fiscale è opzionale se c'è P.IVA
    }

    const cleaned = code.replace(/\s/g, '').toUpperCase();

    // Formato: 16 caratteri alfanumerici
    // Pattern semplificato (validazione completa richiede algoritmo più complesso)
    if (!/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.test(cleaned)) {
        return { 
            valid: false, 
            error: 'Formato Codice Fiscale non valido (16 caratteri)' 
        };
    }

    return { valid: true };
}

// ============================================================================
// COMPLETE FORM VALIDATION
// ============================================================================

export interface RegistrationData {
    // Step 1
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    acceptTerms: boolean;

    // Step 2
    businessName: string;
    vatNumber: string;
    fiscalCode?: string;
    address: string;
    civicNumber?: string;
    cap?: string;
    city: string;
    province?: string;
    country: string;
    phone?: string;
    sdiCode?: string;
    pecEmail?: string;
}

/**
 * Valida i dati dello Step 1 (Account Base)
 */
export function validateStep1(data: Partial<RegistrationData>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Nome e cognome
    if (!data.firstName?.trim()) {
        errors.firstName = 'Nome richiesto';
    }
    if (!data.lastName?.trim()) {
        errors.lastName = 'Cognome richiesto';
    }

    // Email
    const emailCheck = validateBusinessEmail(data.email || '');
    if (!emailCheck.valid) {
        errors.email = emailCheck.error || 'Email non valida';
    }

    // Password
    const passwordCheck = validatePasswordStrength(data.password || '');
    if (!passwordCheck.valid) {
        errors.password = passwordCheck.feedback;
    }

    // Conferma password
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Le password non corrispondono';
    }

    // Termini e condizioni
    if (data.acceptTerms !== true) {
        errors.acceptTerms = 'Devi accettare i termini e condizioni';
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Valida i dati dello Step 2 (Dati Aziendali)
 */
export function validateStep2(data: Partial<RegistrationData>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Ragione sociale
    if (!data.businessName?.trim()) {
        errors.businessName = 'Ragione sociale richiesta';
    }

    // Partita IVA
    const vatCheck = validateItalianVAT(data.vatNumber || '');
    if (!vatCheck.valid) {
        errors.vatNumber = vatCheck.error || 'P.IVA non valida';
    }

    // Codice Fiscale (opzionale)
    if (data.fiscalCode) {
        const cfCheck = validateFiscalCode(data.fiscalCode);
        if (!cfCheck.valid) {
            errors.fiscalCode = cfCheck.error || 'Codice Fiscale non valido';
        }
    }

    // Indirizzo
    if (!data.address?.trim()) {
        errors.address = 'Indirizzo richiesto';
    }

    // CAP
    if (data.cap) {
        const capCheck = validateItalianCAP(data.cap);
        if (!capCheck.valid) {
            errors.cap = capCheck.error || 'CAP non valido';
        }
    }

    // Città
    if (!data.city?.trim()) {
        errors.city = 'Città richiesta';
    }

    // Nazione
    if (!data.country?.trim()) {
        errors.country = 'Nazione richiesta';
    }

    // Telefono (opzionale)
    if (data.phone) {
        const phoneCheck = validateItalianPhone(data.phone);
        if (!phoneCheck.valid) {
            errors.phone = phoneCheck.error || 'Telefono non valido';
        }
    }

    // SDI e PEC sono completamente opzionali - nessuna validazione richiesta

    return { valid: Object.keys(errors).length === 0, errors };
}

export const validationService = {
    validateBusinessEmail,
    validatePasswordStrength,
    validateItalianVAT,
    validateVIES,
    validateItalianCAP,
    validateSDI,
    validateItalianPhone,
    validateFiscalCode,
    validateStep1,
    validateStep2,
};

