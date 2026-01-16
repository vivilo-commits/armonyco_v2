import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    supabase,
    signInWithEmail,
    signOut as supabaseSignOut,
    getSession,
    onAuthStateChange,
    User,
    Session
} from '../lib/supabase';
import { 
    checkSubscriptionStatus, 
    type SubscriptionCheckResult 
} from '../middleware/subscription-check';
import i18n from '../i18n';

interface AuthContextType {
    user: User | null;
    profile: any | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    subscription: SubscriptionCheckResult | null;
    hasValidSubscription: boolean;
    checkSubscription: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: React.ReactNode;
    onAuthChange?: (isAuthenticated: boolean, user: User | null) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onAuthChange }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionCheckResult | null>(null);

    const clearError = useCallback(() => setError(null), []);

    // Load user profile from database
    const loadProfile = useCallback(async (userId: string) => {
        if (!supabase) {
            console.log('[AuthContext] Supabase not configured, skipping profile load');
            return;
        }

        try {
            console.log('[AuthContext] 🔄 Loading profile for user:', userId);
            
            // Create query promise
            const queryPromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            // Create timeout promise (5 seconds)
            const timeoutPromise = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Profile query timeout after 5s')), 5000)
            );

            // Race between query and timeout
            console.log('[AuthContext] Starting profile query with 5s timeout...');
            const result = await Promise.race([queryPromise, timeoutPromise]);
            const { data, error } = result as any;

            if (error) {
                console.error('[AuthContext] ❌ Supabase error loading profile:', error);
                console.error('[AuthContext] ❌ Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                setProfile(null);
                throw error;
            }

            if (!data) {
                console.warn('[AuthContext] ⚠️ Profile not found for user:', userId);
                setProfile(null);
                throw new Error('Profile not found');
            }

            console.log('[AuthContext] ✅ Profile loaded successfully!');
            console.log('[AuthContext] 📋 Profile data:', JSON.stringify(data, null, 2));
            console.log('[AuthContext] 🔑 Profile role:', data?.role);
            console.log('[AuthContext] 👤 Profile user:', data?.id);
            
            // Load user language preference
            if (data?.language && (data.language === 'en' || data.language === 'it')) {
                try {
                    await i18n.changeLanguage(data.language);
                    localStorage.setItem('language', data.language);
                    console.log('[AuthContext] 🌐 Language set to:', data.language);
                } catch (err) {
                    console.error('[AuthContext] Error changing language:', err);
                }
            }
            
            setProfile(data);
            return data;
        } catch (err) {
            console.error('[AuthContext] ❌ Profile load exception:', err);
            setProfile(null);
            throw err;
        }
    }, []);

    // Check subscription status
    const checkSubscription = useCallback(async () => {
        if (!user?.id) {
            setSubscription(null);
            return;
        }

        try {
            const result = await checkSubscriptionStatus(user.id);
            setSubscription(result);
        } catch (err) {
            console.error('[Auth] Error checking subscription:', err);
            setSubscription(null);
        }
    }, [user?.id]);

    // Initialize auth state
    useEffect(() => {
        console.log('[AuthContext] useEffect: Initializing auth...');
        
        // Safety timeout: force loading=false after 10 seconds
        const safetyTimeout = setTimeout(() => {
            console.warn('[AuthContext] ⚠️ SAFETY TIMEOUT (10s) - forcing loading false');
            setIsLoading(false);
        }, 10000);
        
        const initAuth = async () => {
            try {
                console.log('[AuthContext] Getting session...');
                const currentSession = await getSession();
                console.log('[AuthContext] Session received:', !!currentSession, 'User:', !!currentSession?.user);
                
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                onAuthChange?.(!!currentSession, currentSession?.user ?? null);
                
                // Load profile if user is authenticated
                if (currentSession?.user) {
                    console.log('[AuthContext] Loading profile...');
                    try {
                        await loadProfile(currentSession.user.id);
                        console.log('[AuthContext] ✅ Profile loaded successfully');
                    } catch (error) {
                        console.error('[AuthContext] ❌ Profile load failed (non-critical):', error);
                        // Continue anyway - don't block the app
                    }
                }
                
            } catch (err) {
                console.error('[Auth] Init error:', err);
            } finally {
                // Clear safety timeout if we complete before it fires
                clearTimeout(safetyTimeout);
                // ALWAYS set loading to false
                console.log('[AuthContext] ✅ Setting isLoading to FALSE (app ready)');
                setIsLoading(false);
            }
        };

        initAuth();
        
        // Load subscription in BACKGROUND after auth is initialized
        // This prevents blocking the app if subscription check fails or is slow
        const loadSubscriptionInBackground = async () => {
            try {
                const currentSession = await getSession();
                if (currentSession?.user) {
                    console.log('[AuthContext] Loading subscription in background for user:', currentSession.user.id);
                    
                    // Add timeout to prevent hanging
                    const timeoutPromise = new Promise<null>((_, reject) => 
                        setTimeout(() => reject(new Error('Subscription check timeout')), 5000)
                    );
                    
                    const subscriptionPromise = checkSubscriptionStatus(currentSession.user.id);
                    
                    const result = await Promise.race([
                        subscriptionPromise,
                        timeoutPromise
                    ]) as any;
                    
                    setSubscription(result);
                    console.log('[AuthContext] ✅ Background subscription loaded:', result);
                }
            } catch (err) {
                console.error('[AuthContext] ⚠️ Background subscription load failed (non-critical):', err);
                // Set default subscription state - app continues working
                setSubscription({ active: false, tier: 'free' } as any);
            }
        };
        
        // Start background load after a small delay to let auth finish
        setTimeout(() => loadSubscriptionInBackground(), 100);

        // Subscribe to auth changes
        const { data: { subscription: authSubscription } } = onAuthStateChange(async (event, newSession) => {
            console.log('[AuthContext] Auth state change:', event, 'User:', !!newSession?.user);
            setSession(newSession);
            setUser(newSession?.user ?? null);
            onAuthChange?.(!!newSession, newSession?.user ?? null);

            if (event === 'SIGNED_OUT') {
                console.log('[AuthContext] User signed out, clearing state');
                setUser(null);
                setSession(null);
                setSubscription(null);
                setProfile(null);
            } else if (event === 'SIGNED_IN' && newSession?.user) {
                console.log('[AuthContext] User signed in, loading profile and subscription in background');
                
                // Load profile in BACKGROUND (non-blocking)
                loadProfile(newSession.user.id)
                    .then(() => console.log('[AuthContext] ✅ Background profile loaded'))
                    .catch(err => console.error('[AuthContext] ⚠️ Background profile error (non-critical):', err));
                
                // Load subscription in BACKGROUND (non-blocking)
                // This prevents the app from hanging if subscription check fails
                (async () => {
                    try {
                        console.log('[AuthContext] Step 1: Fetching subscription data...');
                        
                        // Add timeout to prevent hanging
                        const timeoutPromise = new Promise<null>((_, reject) => 
                            setTimeout(() => reject(new Error('Subscription check timeout')), 5000)
                        );
                        
                        const subscriptionPromise = checkSubscriptionStatus(newSession.user!.id);
                        
                        const result = await Promise.race([
                            subscriptionPromise,
                            timeoutPromise
                        ]) as any;
                        
                        console.log('[AuthContext] Step 2: Subscription loaded successfully:', result);
                        setSubscription(result);
                        console.log('[AuthContext] Step 3: Subscription state updated');
                    } catch (error) {
                        console.error('[AuthContext] ⚠️ Error loading subscription (non-critical):', error);
                        // Set a default empty subscription state - don't block the app
                        setSubscription({ active: false, tier: 'free' } as any);
                        console.log('[AuthContext] Using default subscription state');
                    } finally {
                        console.log('[AuthContext] Step 4: Subscription loading complete (background)');
                    }
                })();
                
                console.log('[AuthContext] ✅ User signed in - app ready (profile and subscription loading in background)');
            }
        });

        return () => {
            clearTimeout(safetyTimeout);
            authSubscription.unsubscribe();
        };
    }, [onAuthChange]);

    const signIn = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { session: newSession, user: newUser } = await signInWithEmail(email, password);
            setSession(newSession);
            setUser(newUser);
        } catch (err: any) {
            const message = err.message || 'Failed to sign in';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        setIsLoading(true);
        try {
            await supabaseSignOut();
            setUser(null);
            setSession(null);
        } catch (err: any) {
            const message = err.message || 'Failed to sign out';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value: AuthContextType = {
        user,
        profile,
        session,
        isLoading,
        isAuthenticated: !!user,
        subscription,
        hasValidSubscription: subscription?.active ?? false,
        checkSubscription,
        signIn,
        signOut,
        error,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
