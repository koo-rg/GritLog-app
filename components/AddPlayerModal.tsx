import React, { useState } from 'react';

interface AddPlayerModalProps {
  onClose: () => void;
  onSubmit: (name: string, position: string, grade: number) => void;
  theme: 'home' | 'detail';
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ onClose, onSubmit, theme }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [grade, setGrade] = useState(1);
  const isHome = theme === 'home';

  const handleSubmit = () => {
    if (!name.trim() || !position.trim()) {
      alert('名前とポジションを入力してください。');
      return;
    }
    onSubmit(name.trim(), position.trim(), grade);
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

  const inputClass = `w-full ${inputBg} border ${border} rounded-lg p-3 ${textPrimary} placeholder-${textSecondary} focus:outline-none focus:ring-2 ${ringColor} transition-all`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
      <div className={`${baseBg} backdrop-blur-lg border ${border} p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 mx-4`}>
        <h2 className={`text-2xl font-bold ${textPrimary}`}>新しい部員を追加</h2>
        
        <div className="space-y-4">
            <div>
                <label className={`block ${textSecondary} mb-2`}>名前</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="例: 山田 太郎"
                    autoFocus
                    className={inputClass}
                />
            </div>
            <div>
                <label className={`block ${textSecondary} mb-2`}>ポジション</label>
                <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="例: PR/HO"
                    className={inputClass}
                />
            </div>
            <div>
                <label className={`block ${textSecondary} mb-2`}>学年</label>
                <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className={inputClass}
                >
                    <option value={1}>1年生</option>
                    <option value={2}>2年生</option>
                    <option value={3}>3年生</option>
                    <option value={4}>4年生</option>
                </select>
            </div>
        </div>
        
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
            追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlayerModal;