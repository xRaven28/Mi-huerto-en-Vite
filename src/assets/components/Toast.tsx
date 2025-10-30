import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  color?: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, color = '#51af13ff', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      <div className="toast show align-items-center text-white border-0" style={{ backgroundColor: color }}>
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose} aria-label="Close" />
        </div>
      </div>
    </div>
  );
};

export default Toast;
