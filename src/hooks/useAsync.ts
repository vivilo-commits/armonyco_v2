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
        setState({ status: 'pending', data: null, error: null });
        return asyncFunction()
            .then((response) => {
                setState({ status: 'success', data: response, error: null });
            })
            .catch((error) => {
                setState({ status: 'error', data: null, error: error.message || 'Something went wrong' });
            });
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { ...state, execute };
};
