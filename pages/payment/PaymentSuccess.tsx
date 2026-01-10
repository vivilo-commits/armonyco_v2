/**
 * PAYMENT SUCCESS PAGE
 * Handles the return from Stripe Checkout after successful payment
 * Completes the registration by:
 * 1. Verifying payment with Stripe (server-side)
 * 2. Retrieving pending registration data from localStorage
 * 3. Creating Supabase account
 * 4. Saving all user data to database
 * 5. Redirecting to dashboard
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader, AlertTriangle, XCircle } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';
import { completeRegistration } from '../../src/services/registration.service';

interface PaymentSuccessProps {
    onComplete?: () => void;
}

type Status = 'verifying' | 'creating_account' | 'success' | 'error';

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onComplete }) => {
    const [status, setStatus] = useState<Status>('verifying');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [retryCount, setRetryCount] = useState(0);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        completeRegistrationFlow();
    }, []);

    const completeRegistrationFlow = async () => {
        try {
            setStatus('verifying');
            setErrorMessage('');

            // 1. Get session_id from URL
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');

            if (!sessionId) {
                console.error('[PaymentSuccess] No session_id in URL');
                setStatus('error');
                setErrorMessage('Session ID not found in URL. Contact support.');
                return;
            }

            console.log('[PaymentSuccess] Session ID:', sessionId);

            // 2. Verify payment with backend (server-side verification)
            console.log('[PaymentSuccess] Verifying payment...');
            const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
            const verifyEndpoint = `${backendUrl}/api/stripe/verify-payment`;

            const verifyResponse = await fetch(verifyEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId }),
            });

            if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error during payment verification');
            }

            const verifyResult = await verifyResponse.json();

            if (!verifyResult.verified) {
                console.error('[PaymentSuccess] Payment not verified:', verifyResult);
                setStatus('error');
                setErrorMessage('Payment not completed. Try again or contact support.');
                return;
            }

            console.log('[PaymentSuccess] ✅ Payment verified successfully');

            // 3. Retrieve pending registration data from localStorage
            const pendingDataStr = localStorage.getItem('pending_registration');

            if (!pendingDataStr) {
                console.error('[PaymentSuccess] No pending registration data in localStorage');
                setStatus('error');
                setErrorMessage('Registration data not found. Data may have expired. Try registration again.');
                return;
            }

            const registrationData = JSON.parse(pendingDataStr);
            console.log('[PaymentSuccess] Retrieved registration data from localStorage');

            // Check if data is expired (24 hours)
            const dataAge = Date.now() - (registrationData.timestamp || 0);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            if (dataAge > maxAge) {
                console.error('[PaymentSuccess] Registration data expired');
                setStatus('error');
                setErrorMessage('Registration data has expired. Try registration again.');
                localStorage.removeItem('pending_registration');
                return;
            }

            // Validate that email and password are present
            if (!registrationData.email || !registrationData.password) {
                console.error('[PaymentSuccess] ❌ Missing email or password in registration data');
                setStatus('error');
                setErrorMessage('Incomplete registration data (missing email or password). Try registration again.');
                localStorage.removeItem('pending_registration');
                return;
            }

            if (registrationData.password.length < 6) {
                console.error('[PaymentSuccess] ❌ Password too short');
                setStatus('error');
                setErrorMessage('Password too short. Try registration again.');
                localStorage.removeItem('pending_registration');
                return;
            }

            console.log('[PaymentSuccess] ✅ All validations passed. Proceeding with registration...');

            // 4. Create Supabase account and save data
            setStatus('creating_account');
            console.log('[PaymentSuccess] Creating account with Stripe data...');
            console.log('[PaymentSuccess] Stripe Customer ID:', verifyResult.stripeCustomerId);
            console.log('[PaymentSuccess] Stripe Subscription ID:', verifyResult.stripeSubscriptionId);

            const result = await completeRegistration({
                email: registrationData.email,
                password: registrationData.password,
                firstName: registrationData.firstName,
                lastName: registrationData.lastName,
                businessName: registrationData.businessName,
                vatNumber: registrationData.vatNumber,
                fiscalCode: registrationData.fiscalCode,
                phone: registrationData.phone,
                address: registrationData.address,
                civicNumber: registrationData.civicNumber,
                cap: registrationData.cap,
                city: registrationData.city,
                province: registrationData.province,
                country: registrationData.country,
                sdiCode: registrationData.sdiCode,
                pecEmail: registrationData.pecEmail,
                planId: registrationData.planId,
                planCredits: registrationData.planCredits,
                stripeSessionId: sessionId,
                stripeCustomerId: verifyResult.stripeCustomerId,
                stripeSubscriptionId: verifyResult.stripeSubscriptionId,
            });

            if (!result.success) {
                console.error('[PaymentSuccess] Registration failed:', result.error);
                setStatus('error');
                setErrorMessage(result.error || 'Error creating account');
                // DO NOT delete data from localStorage to allow retry
                return;
            }

            console.log('[PaymentSuccess] ✅ Account created successfully!');

            // 5. Clean up localStorage
            localStorage.removeItem('pending_registration');
            localStorage.removeItem('armonyco_registration_draft');

            // 6. Set success state
            setStatus('success');
            setUserData({
                email: registrationData.email,
                planName: registrationData.planName,
                planCredits: registrationData.planCredits,
            });

            // 7. Redirect to dashboard after 3 seconds
            setTimeout(() => {
                if (onComplete) {
                    onComplete();
                } else {
                    window.location.href = '/app/dashboard';
                }
            }, 3000);

        } catch (error: any) {
            console.error('[PaymentSuccess] Error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Unexpected error during registration');
        }
    };

    const handleRetry = () => {
        setRetryCount(retryCount + 1);
        completeRegistrationFlow();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img 
                        src="/assets/logo-full.png" 
                        alt="Armonyco" 
                        className="h-12 object-contain" 
                    />
                </div>

                {/* Card */}
                <div className="bg-[#151515] border border-zinc-800 rounded-2xl p-8 md:p-12">
                    {/* Status: Verifying */}
                    {status === 'verifying' && (
                        <div className="text-center space-y-6 animate-in fade-in duration-500">
                            <div className="w-24 h-24 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center">
                                <Loader size={48} className="text-blue-400 animate-spin" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-3">
                                    Verifying Payment...
                                </h1>
                                <p className="text-zinc-400">
                                    We are verifying your payment with Stripe
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Status: Creating Account */}
                    {status === 'creating_account' && (
                        <div className="text-center space-y-6 animate-in fade-in duration-500">
                            <div className="w-24 h-24 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <Loader size={48} className="text-emerald-400 animate-spin" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-3">
                                    Creating Account...
                                </h1>
                                <p className="text-zinc-400">
                                    Your payment has been verified. We are creating your account.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Status: Success */}
                    {status === 'success' && (
                        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 mx-auto bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-500 delay-200">
                                <CheckCircle size={64} className="text-white" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-white mb-3">
                                    Welcome to Armonyco! 🎉
                                </h1>
                                <p className="text-lg text-zinc-400">
                                    Your account has been successfully created
                                </p>
                            </div>

                            {userData && (
                                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-left space-y-3">
                                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider text-center mb-4">
                                        Account Summary
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Email:</span>
                                            <span className="font-medium text-white">{userData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Plan:</span>
                                            <span className="font-medium text-white">{userData.planName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Credits:</span>
                                            <span className="font-bold text-emerald-400">
                                                {userData.planCredits.toLocaleString('en-US')} ArmoCredits©
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                <p className="text-sm text-zinc-300">
                                    📧 We have sent you a confirmation email with all the details
                                </p>
                            </div>

                            <div className="pt-4">
                                <p className="text-sm text-zinc-500">
                                    You will be redirected to the dashboard in a few seconds...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Status: Error */}
                    {status === 'error' && (
                        <div className="text-center space-y-6 animate-in fade-in duration-500">
                            <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                                <XCircle size={48} className="text-red-400" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-white mb-3">
                                    Registration Error
                                </h1>
                                <p className="text-zinc-400">
                                    A problem occurred while creating your account
                                </p>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle size={24} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="font-semibold text-red-300 mb-1">Error Details</p>
                                        <p className="text-sm text-red-400">{errorMessage}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    variant="primary"
                                    onClick={handleRetry}
                                    className="min-w-[200px]"
                                >
                                    🔄 Retry
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleGoHome}
                                    className="min-w-[200px]"
                                >
                                    Back to Home
                                </Button>
                            </div>

                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                                <p className="text-xs text-zinc-500">
                                    💡 <strong>Note:</strong> Your payment was processed successfully. 
                                    If the error persists, contact support with the session code from the URL.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-zinc-600">
                        Need help? Contact support at{' '}
                        <a href="mailto:support@armonyco.com" className="text-emerald-400 hover:underline">
                            support@armonyco.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
