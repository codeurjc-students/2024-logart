import React, { createContext, useState, useEffect } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [currentModal, setCurrentModal] = useState(null); 
  const [modalProps, setModalProps] = useState({}); 

  const openModal = (modalComponent, props = {}) => {
    setCurrentModal(() => modalComponent); 
    setModalProps(props); 
  };

  const closeModal = () => {
    setCurrentModal(null);
    setModalProps({});
  };

  useEffect(() => {
    if (currentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [currentModal]);

  return (
    <ModalContext.Provider value={{ currentModal, modalProps, openModal, closeModal }}>
      {children}
      {currentModal && React.cloneElement(currentModal, { ...modalProps })}
    </ModalContext.Provider>
  );
};
