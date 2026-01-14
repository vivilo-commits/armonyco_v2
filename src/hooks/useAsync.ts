import { useState, useEffect, useCallback } from 'react';

type Status = 'idle' | 'pending' | 'success' | 'error';

interface State<T> {
    status: Status;
    data: T | null;
    error: string | null;
}

export const useAsync = <T,>(asyncFunction: () => Promise<T>, immediate = true) => {
    const [state, setState] = useState<State<T>>({
        status: 'idle',
        data: null,
        error: null,
    });

    const execute = useCallback(() => {
        console.log('[useAsync] Setting status to pending...');
        setState({ status: 'pending', data: null, error: null });
        
        // Safety timeout
        const timeoutId = setTimeout(() => {
            console.warn('[useAsync] ⚠️ Async operation timeout after 10 seconds');
            setState({ status: 'error', data: null, error: 'Operation timed out' });
        }, 10000);
        
        return asyncFunction()
            .then((response) => {
                clearTimeout(timeoutId);
                console.log('[useAsync] ✅ Success, setting status to success');
                setState({ status: 'success', data: response, error: null });
            })
            .catch((error) => {
                clearTimeout(timeoutId);
                console.error('[useAsync] ❌ Error:', error);
                setState({ status: 'error', data: null, error: error.message || 'Something went wrong' });
            });
    }, [asyncFunction]);

    useEffect(() => {
        console.log('[useAsync] useEffect triggered, immediate:', immediate);
        if (immediate) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            execute();
        }
    }, [execute, immediate]);

    return { ...state, execute };
};
