import React from "react";
import "../styles/confirmModal.css"

type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <p className="confirm-message">{message}</p>
        
        <div className="confirm-buttons">
          <button className="btn-confirm" onClick={onConfirm}>Confirmar</button>
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

