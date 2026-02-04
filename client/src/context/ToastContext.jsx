import { createContext, useContext, useState, useCallback } from 'react';
import Toaster from '../components/common/Toaster';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    message: '',
    variant: 'success',
  });

  const showToast = useCallback((message, variant = 'success') => {
    setState({ open: true, message, variant });
  }, []);

  const hideToast = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toaster
        open={state.open}
        message={state.message}
        variant={state.variant}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
