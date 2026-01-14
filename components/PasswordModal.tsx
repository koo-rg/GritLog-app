import React, { useState } from 'react';

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => void;
  theme: 'home' | 'detail';
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSubmit, theme }) => {
  const [password, setPassword] = useState('');
  const isHome = theme === 'home';

  const handleSubmit = () => {
    onSubmit(password);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  const baseBg = isHome ? 'bg-old-slate/90' : 'bg-slate/90';
  const border = isHome ? 'border-old-light-slate/50' : 'border-light-slate/50';
  const textPrimary = 'text-white';
  const textSecondary = isHome ? 'text-old-gray-text' : 'text-gray-text';
  const inputBg = isHome ? 'bg-old-navy' : 'bg-navy';
  const ringColor = isHome ? 'focus:ring-old-accent' : 'focus:ring-accent';
  const cancelBtn = isHome ? 'bg-old-light-slate hover:bg-old-slate' : 'bg-light-slate hover:bg-slate';
  const submitBtn = isHome 
    ? 'bg-old-accent text-old-navy hover:bg-old-accent-light hover:shadow-old-accent-glow' 
    : 'bg-accent text-navy hover:bg-accent-light hover:shadow-accent-glow';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
      <div className={`${baseBg} backdrop-blur-lg border ${border} p-8 rounded-xl shadow-2xl w-full max-w-sm space-y-6 mx-4`}>
        <h2 className={`text-2xl font-bold ${textPrimary}`}>管理者パスワード</h2>
        <p className={textSecondary}>
          管理者モードを有効にするにはパスワードを入力してください。
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className={`w-full ${inputBg} border ${border} rounded-lg p-3 ${textPrimary} placeholder-${textSecondary} focus:outline-none focus:ring-2 ${ringColor} transition-all`}
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className={`font-bold py-2 px-6 rounded-lg transition-colors ${cancelBtn} ${textPrimary}`}
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className={`font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-md ${submitBtn}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;