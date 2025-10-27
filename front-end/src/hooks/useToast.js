import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = ++toastId;
    const newToast = {
      id,
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title, description) => {
    return addToast({ title, description, type: 'success' });
  }, [addToast]);

  const error = useCallback((title, description) => {
    return addToast({ title, description, type: 'error' });
  }, [addToast]);

  const warning = useCallback((title, description) => {
    return addToast({ title, description, type: 'warning' });
  }, [addToast]);

  const info = useCallback((title, description) => {
    return addToast({ title, description, type: 'info' });
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  };
};
