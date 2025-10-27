import { useState, useCallback } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const openModal = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggleModal = useCallback((modalData = null) => {
    if (isOpen) {
      closeModal();
    } else {
      openModal(modalData);
    }
  }, [isOpen, openModal, closeModal]);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal
  };
};

export const useMultipleModals = (modalKeys = []) => {
  const [modals, setModals] = useState(() => {
    const initialModals = {};
    modalKeys.forEach(key => {
      initialModals[key] = {
        isOpen: false,
        data: null
      };
    });
    return initialModals;
  });

  const openModal = useCallback((key, data = null) => {
    setModals(prev => ({
      ...prev,
      [key]: {
        isOpen: true,
        data
      }
    }));
  }, []);

  const closeModal = useCallback((key) => {
    setModals(prev => ({
      ...prev,
      [key]: {
        isOpen: false,
        data: null
      }
    }));
  }, []);

  const toggleModal = useCallback((key, data = null) => {
    setModals(prev => ({
      ...prev,
      [key]: {
        isOpen: !prev[key].isOpen,
        data: !prev[key].isOpen ? data : null
      }
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(prev => {
      const newModals = {};
      Object.keys(prev).forEach(key => {
        newModals[key] = {
          isOpen: false,
          data: null
        };
      });
      return newModals;
    });
  }, []);

  const getModalState = useCallback((key) => {
    return modals[key] || { isOpen: false, data: null };
  }, [modals]);

  return {
    modals,
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
    getModalState
  };
};
