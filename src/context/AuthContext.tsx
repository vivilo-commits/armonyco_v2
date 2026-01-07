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

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
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
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentSession = await getSession();
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                onAuthChange?.(!!currentSession, currentSession?.user ?? null);
            } catch (err) {
                console.error('[Auth] Init error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Subscribe to auth changes
        const { data: { subscription } } = onAuthStateChange((event, newSession) => {
            console.log('[Auth] State change:', event);
            setSession(newSession);
            setUser(newSession?.user ?? null);
            onAuthChange?.(!!newSession, newSession?.user ?? null);

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setSession(null);
            }
        });

        return () => {
            subscription.unsubscribe();
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
        session,
        isLoading,
        isAuthenticated: !!user,
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
