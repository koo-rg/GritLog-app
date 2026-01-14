import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  theme: 'home' | 'detail';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, theme }) => {
  if (!isOpen) return null;
  const isHome = theme === 'home';

  const baseBg = isHome ? 'bg-old-slate/90' : 'bg-slate/90';
  const border = isHome ? 'border-old-light-slate/50' : 'border-light-slate/50';
  const textSecondary = isHome ? 'text-old-gray-text' : 'text-gray-text';
  const cancelBtn = isHome ? 'bg-old-light-slate hover:bg-old-slate text-white' : 'bg-light-slate hover:bg-slate text-white';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
      <div className={`${baseBg} backdrop-blur-lg border ${border} p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 mx-4`}>
        <h2 className="text-2xl font-bold text-danger-light">{title}</h2>
        <p className={`${textSecondary} whitespace-pre-wrap`}>{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className={`font-bold py-2 px-6 rounded-lg transition-colors ${cancelBtn}`}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="bg-danger text-white font-bold py-2 px-6 rounded-lg hover:bg-danger/80 transition-all duration-300"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;