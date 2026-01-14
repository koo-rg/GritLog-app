import React, { useState } from 'react';

interface BulkInputModalProps {
  onClose: () => void;
  onSubmit: (data: string) => void;
  theme: 'home' | 'detail';
}

const BulkInputModal: React.FC<BulkInputModalProps> = ({ onClose, onSubmit, theme }) => {
  const [bulkData, setBulkData] = useState('');
  const isHome = theme === 'home';

  const handleSubmit = () => {
    if (bulkData.trim() === '') {
      alert('データを入力してください。');
      return;
    }
    onSubmit(bulkData);
  };
  
  const placeholderText = `以下のCSV形式でデータを貼り付けてください (各項目はカンマで区切る):\n選手名,YYYY-MM-DD,体重,ブロンコ(MM:SS),ベンチ,スクワット,デッドリフト,クリーン\n\n例:\n一茶,2023-10-28,105.5,4:55,140,180,200,110\n土生,2023-10-28,110.2,5:10,135,190,210,105`;

  const baseBg = isHome ? 'bg-old-slate/90' : 'bg-slate/90';
  const border = isHome ? 'border-old-light-slate/50' : 'border-light-slate/50';
  const textPrimary = isHome ? 'text-white' : 'text-white';
  const textSecondary = isHome ? 'text-old-gray-text' : 'text-gray-text';
  const textareaBg = isHome ? 'bg-old-navy' : 'bg-navy';
  const ringColor = isHome ? 'focus:ring-old-accent' : 'focus:ring-accent';
  const cancelBtn = isHome ? 'bg-old-light-slate hover:bg-old-slate text-white' : 'bg-light-slate hover:bg-slate text-white';
  const submitBtn = isHome 
    ? 'bg-old-accent text-old-navy hover:bg-old-accent-light hover:shadow-old-accent-glow' 
    : 'bg-accent text-navy hover:bg-accent-light hover:shadow-accent-glow';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
      <div className={`${baseBg} backdrop-blur-lg border ${border} p-8 rounded-xl shadow-2xl w-full max-w-3xl space-y-6 mx-4`}>
        <h2 className={`text-2xl font-bold ${textPrimary}`}>全体データの一括入力/更新</h2>
        <p className={textSecondary}>
          各選手のデータを改行で区切り、指定のCSV形式で貼り付けてください。
          <br />
          同じ選手名と日付のデータが存在する場合は、新しいデータで上書きされます。
        </p>
        <textarea
          value={bulkData}
          onChange={(e) => setBulkData(e.target.value)}
          placeholder={placeholderText}
          className={`w-full ${textareaBg} border ${border} rounded-lg p-3 ${textPrimary} placeholder-${textSecondary} focus:outline-none focus:ring-2 ${ringColor} transition-all h-64 font-mono text-sm`}
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className={`font-bold py-2 px-6 rounded-lg transition-colors ${cancelBtn}`}
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className={`font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-md ${submitBtn}`}
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkInputModal;