/**
 * VALIDATION SERVICE
 * Advanced validation functions for registration flow
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
 * Validates email format (accepts any valid email)
 */
export function validateBusinessEmail(email: string): { valid: boolean; error?: string } {
    if (!email || !email.trim()) {
        return { valid: false, error: 'Email required' };
    }

    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    // Accept all emails with valid format
    return { valid: true };
}

// ============================================================================
// PASSWORD VALIDATION
// ============================================================================

export interface PasswordStrengthResult {
    score: number; // 0-4 (0=very weak, 4=very strong)
    feedback: string;
    valid: boolean;
}

/**
 * Validates password strength and returns feedback
 */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
    if (!password) {
        return { score: 0, feedback: 'Password required', valid: false };
    }

    const length = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    let score = 0;
    let feedback = '';

    // Minimum length
    if (length < 8) {
        return { 
            score: 0, 
            feedback: 'Password too short (minimum 8 characters)', 
            valid: false 
        };
    }

    // Calculate score
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (hasLower && hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    // Normalize score 0-4
    score = Math.min(4, Math.floor(score * 0.8));

    // Validate mandatory requirements
    const valid = length >= 8 && hasUpper && hasNumber && hasSpecial;

    // Feedback
    if (!valid) {
        const missing = [];
        if (!hasUpper) missing.push('1 uppercase letter');
        if (!hasNumber) missing.push('1 number');
        if (!hasSpecial) missing.push('1 special character');
        feedback = `Missing: ${missing.join(', ')}`;
    } else {
        switch (score) {
            case 0:
            case 1:
                feedback = 'Weak password';
                break;
            case 2:
                feedback = 'Medium password';
                break;
            case 3:
                feedback = 'Strong password';
                break;
            case 4:
                feedback = 'Very strong password';
                break;
        }
    }

    return { score, feedback, valid };
}

// ============================================================================
// ITALIAN VAT NUMBER VALIDATION (Partita IVA)
// ============================================================================

/**
 * Validates Italian VAT number (format only - 11 digits)
 */
export function validateItalianVAT(vat: string): { valid: boolean; error?: string } {
    if (!vat || !vat.trim()) {
        return { valid: false, error: 'VAT number required' };
    }

    // Remove spaces and convert to uppercase
    const cleaned = vat.replace(/\s/g, '').toUpperCase();

    // Check format: 11 numeric digits
    if (!/^[0-9]{11}$/.test(cleaned)) {
        return { 
            valid: false, 
            error: 'VAT number must contain exactly 11 numeric digits' 
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
 * Validates EU VAT number via VIES API
 * NOTE: VIES is a SOAP service, here we use a proxy/wrapper
 */
export async function validateVIES(vat: string, countryCode: string): Promise<VIESResult> {
    try {
        // Clean input
        const cleanVAT = vat.replace(/\s/g, '').toUpperCase();
        const cleanCountry = countryCode.toUpperCase();

        // For Italy, use local validation first
        if (cleanCountry === 'IT') {
            const localCheck = validateItalianVAT(cleanVAT);
            if (!localCheck.valid) {
                return { valid: false, error: localCheck.error };
            }
        }

        // VIES API call via public proxy
        // NOTE: VIES API blocks direct calls from browser (CORS)
        // In production use your own backend to avoid CORS
        const url = `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${cleanCountry}/vat/${cleanVAT}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            // Fallback: if API unavailable, allow proceeding anyway
            console.warn('[VIES] API unavailable, skipping validation');
            return { 
                valid: true, 
                error: 'EU VAT verification (VIES) is not available from browser. You can proceed anyway.' 
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
                error: 'VAT number not found in European VIES registry',
            };
        }
    } catch (error) {
        console.warn('[VIES] API call error (probably CORS):', error);
        // In case of CORS error, allow proceeding anyway
        return { 
            valid: true, 
            error: 'VAT verification requires a backend. You can proceed with registration anyway.' 
        };
    }
}

// ============================================================================
// CAP (POSTAL CODE) VALIDATION
// ============================================================================

/**
 * Validates Italian postal code (5 digits)
 */
export function validateItalianCAP(cap: string): { valid: boolean; error?: string } {
    if (!cap || !cap.trim()) {
        return { valid: true }; // Postal code is optional
    }

    const cleaned = cap.replace(/\s/g, '');

    if (!/^[0-9]{5}$/.test(cleaned)) {
        return { 
            valid: false, 
            error: 'Postal code must contain exactly 5 digits' 
        };
    }

    return { valid: true };
}

// ============================================================================
// SDI CODE VALIDATION
// ============================================================================

/**
 * Validates SDI Code (7 alphanumeric characters or "0000000" for PEC)
 */
export function validateSDI(code: string): { valid: boolean; error?: string } {
    if (!code || !code.trim()) {
        return { valid: true }; // SDI is optional if PEC is provided
    }

    const cleaned = code.replace(/\s/g, '').toUpperCase();

    // "0000000" indicates using PEC instead of SDI
    if (cleaned === '0000000') {
        return { valid: true };
    }

    // Otherwise must be 7 alphanumeric characters
    if (!/^[A-Z0-9]{7}$/.test(cleaned)) {
        return { 
            valid: false, 
            error: 'SDI code must contain 7 alphanumeric characters' 
        };
    }

    return { valid: true };
}

// ============================================================================
// PHONE VALIDATION
// ============================================================================

/**
 * Validates Italian/international phone number
 */
export function validateItalianPhone(phone: string): { valid: boolean; error?: string } {
    if (!phone || !phone.trim()) {
        return { valid: true }; // Phone is optional
    }

    const cleaned = phone.replace(/[\s\-().]/g, '');

    // Italian format: +39 or 0039 followed by 9-10 digits
    // International format: + followed by 10-15 digits
    const italianRegex = /^(\+39|0039)?[0-9]{9,10}$/;
    const internationalRegex = /^\+[0-9]{10,15}$/;

    if (!italianRegex.test(cleaned) && !internationalRegex.test(cleaned)) {
        return { 
            valid: false, 
            error: 'Invalid phone format (e.g. +39 333 123 4567)' 
        };
    }

    return { valid: true };
}

// ============================================================================
// FISCAL CODE VALIDATION (Codice Fiscale)
// ============================================================================

/**
 * Validates Italian Fiscal Code (basic format)
 */
export function validateFiscalCode(code: string): { valid: boolean; error?: string } {
    if (!code || !code.trim()) {
        return { valid: true }; // Fiscal code is optional if VAT number is provided
    }

    const cleaned = code.replace(/\s/g, '').toUpperCase();

    // Format: 16 alphanumeric characters
    // Simplified pattern (complete validation requires more complex algorithm)
    if (!/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.test(cleaned)) {
        return { 
            valid: false, 
            error: 'Invalid Fiscal Code format (16 characters)' 
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
 * Validates Step 1 data (Account Base)
 */
export function validateStep1(data: Partial<RegistrationData>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // First name and last name
    if (!data.firstName?.trim()) {
        errors.firstName = 'First name required';
    }
    if (!data.lastName?.trim()) {
        errors.lastName = 'Last name required';
    }

    // Email
    const emailCheck = validateBusinessEmail(data.email || '');
    if (!emailCheck.valid) {
        errors.email = emailCheck.error || 'Invalid email';
    }

    // Password
    const passwordCheck = validatePasswordStrength(data.password || '');
    if (!passwordCheck.valid) {
        errors.password = passwordCheck.feedback;
    }

    // Confirm password
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    // Terms and conditions
    if (data.acceptTerms !== true) {
        errors.acceptTerms = 'You must accept the terms and conditions';
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validates Step 2 data (Business Details)
 */
export function validateStep2(data: Partial<RegistrationData>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Business name
    if (!data.businessName?.trim()) {
        errors.businessName = 'Business name required';
    }

    // VAT number
    const vatCheck = validateItalianVAT(data.vatNumber || '');
    if (!vatCheck.valid) {
        errors.vatNumber = vatCheck.error || 'Invalid VAT number';
    }

    // Fiscal Code (optional)
    if (data.fiscalCode) {
        const cfCheck = validateFiscalCode(data.fiscalCode);
        if (!cfCheck.valid) {
            errors.fiscalCode = cfCheck.error || 'Invalid Fiscal Code';
        }
    }

    // Address
    if (!data.address?.trim()) {
        errors.address = 'Address required';
    }

    // Postal code
    if (data.cap) {
        const capCheck = validateItalianCAP(data.cap);
        if (!capCheck.valid) {
            errors.cap = capCheck.error || 'Invalid postal code';
        }
    }

    // City
    if (!data.city?.trim()) {
        errors.city = 'City required';
    }

    // Country
    if (!data.country?.trim()) {
        errors.country = 'Country required';
    }

    // Phone (optional)
    if (data.phone) {
        const phoneCheck = validateItalianPhone(data.phone);
        if (!phoneCheck.valid) {
            errors.phone = phoneCheck.error || 'Invalid phone';
        }
    }

    // SDI and PEC are completely optional - no validation required

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

