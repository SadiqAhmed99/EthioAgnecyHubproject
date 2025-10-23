import { useState, useCallback, useRef } from 'react';
import { useFetcher } from '@remix-run/react';

export interface UseFormReturn<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  handleSubmit: (onSubmit: (data: T) => void) => (e: React.FormEvent) => void;
  reset: () => void;
  validate: () => boolean;
}

export function useForm<T extends Record<string, any>>(
  initialData: T,
  validationSchema?: any
): UseFormReturn<T> {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  const setValue = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => ({ ...prev, [field as string]: '' }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validate = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(data);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path.join('.');
          newErrors[field] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  }, [data, validationSchema]);

  const handleSubmit = useCallback((onSubmit: (data: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validate()) {
        return;
      }

      setIsSubmitting(true);
      onSubmit(data);
    };
  }, [data, validate]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  const isValid = Object.keys(errors).length === 0 && Object.values(data).every(value => 
    value !== '' && value !== null && value !== undefined
  );

  return {
    data,
    errors,
    isSubmitting,
    isValid,
    setValue,
    setError,
    clearError,
    clearAllErrors,
    handleSubmit,
    reset,
    validate,
  };
}
