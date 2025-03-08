import { useState, useCallback } from 'react';

interface ApiError {
    message: string;
    code?: string;
}

export const useApiError = () => {
    const [error, setError] = useState<ApiError | null>(null);

    const handleError = useCallback((error: unknown) => {
        if (error instanceof Error) {
            setError({ message: error.message });
        } else if (typeof error === 'string') {
            setError({ message: error });
        } else {
            setError({ message: 'An unknown error occurred' });
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        error,
        handleError,
        clearError
    };
};

export default useApiError;
