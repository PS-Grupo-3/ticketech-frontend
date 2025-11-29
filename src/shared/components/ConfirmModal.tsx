import "../styles/confirmModal.css";
import ReactDOM from "react-dom";

type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return ReactDOM.createPortal(
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button className="btn-confirm" onClick={onConfirm}>Confirmar</button>
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

