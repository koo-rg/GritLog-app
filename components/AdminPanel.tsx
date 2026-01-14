import React, { useState } from 'react';
import { Player, PerformanceRecord, PlayerTargets } from '../types';
import ConfirmationModal from './ConfirmationModal';
import TrashIcon from './icons/TrashIcon';

interface AdminPanelProps {
  player: Player;
  updatePlayerData: (playerId: number, updatedRecords: PerformanceRecord[]) => void;
  updatePlayerTargets: (playerId: number, newTargets: PlayerTargets) => void;
  onDeletePlayer: (playerId: number) => void;
  updatePlayerPersona: (playerId: number, persona: Player['aiPersona']) => void;
}

const initialNewRecordState: Omit<PerformanceRecord, 'date'> = {
  weight: null, broncoTime: null, benchPress: null, squat: null, deadlift: null, clean: null,
};


const AdminPanel: React.FC<AdminPanelProps> = ({ player, updatePlayerData, updatePlayerTargets, onDeletePlayer, updatePlayerPersona }) => {
  const [newRecord, setNewRecord] = useState<Omit<PerformanceRecord, 'date'>>(initialNewRecordState);
  const [newRecordDate, setNewRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [bulkData, setBulkData] = useState('');
  const [targets, setTargets] = useState<PlayerTargets>(player.targets);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value === '' ? null : (name === 'broncoTime' ? value : parseFloat(value)) }));
  };
  
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTargets(prev => ({ ...prev, [name]: value === '' ? null : (name === 'broncoTime' ? value : parseFloat(value)) }));
  };

  const handleSaveTargets = () => {
    updatePlayerTargets(player.id, targets);
    alert('目標を更新しました。');
  };

  const handleAddRecord = () => {
    if (!newRecordDate) {
      alert('日付を入力してください。');
      return;
    }

    const recordToAdd: PerformanceRecord = { date: newRecordDate, ...newRecord };
    
    const existingRecordIndex = player.records.findIndex(r => r.date === newRecordDate);
    let newRecordsList;

    if (existingRecordIndex > -1) {
      // 同じ日付の記録が存在する場合、上書きする
      newRecordsList = [...player.records];
      newRecordsList[existingRecordIndex] = recordToAdd;
      alert(`${newRecordDate}のデータを更新しました。`);
    } else {
      // 新しい記録として追加する
      newRecordsList = [...player.records, recordToAdd];
      alert(`${newRecordDate}のデータを追加しました。`);
    }
    
    const updatedRecords = newRecordsList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    updatePlayerData(player.id, updatedRecords);
    
    // 入力フォームをリセット
    setNewRecord(initialNewRecordState);
  };

  const handleBulkAdd = () => {
    const lines = bulkData.trim().split('\n');
    const newRecords: PerformanceRecord[] = [];
    try {
      lines.forEach(line => {
        const [date, weight, broncoTime, benchPress, squat, deadlift, clean] = line.split(/\s+/); // Split by whitespace
        if (!date) return;
        newRecords.push({
          date,
          weight: weight ? parseFloat(weight) : null,
          broncoTime: broncoTime || null,
          benchPress: benchPress ? parseFloat(benchPress) : null,
          squat: squat ? parseFloat(squat) : null,
          deadlift: deadlift ? parseFloat(deadlift) : null,
          clean: clean ? parseFloat(clean) : null,
        });
      });

      const combinedRecords = [...player.records];
      newRecords.forEach(nr => {
        const existingIndex = combinedRecords.findIndex(cr => cr.date === nr.date);
        if (existingIndex > -1) {
          combinedRecords[existingIndex] = nr; // Overwrite existing
        } else {
          combinedRecords.push(nr);
        }
      });
      
      const updatedRecords = combinedRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      updatePlayerData(player.id, updatedRecords);
      setBulkData('');
      alert(`${newRecords.length}件のデータを追加/更新しました。`);
    } catch (error) {
      alert('データの形式が正しくありません。エラーを確認してください。');
      console.error(error);
    }
  };
  
  const handleDeleteClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeletePlayer(player.id);
    setIsConfirmModalOpen(false);
  };
  
  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPersona = e.target.value as 'analyst' | 'demon_coach';
    updatePlayerPersona(player.id, newPersona);
  };

  const inputClass = "w-full bg-slate border-2 border-light-slate rounded-lg p-2 text-white placeholder-gray-text focus:outline-none focus:ring-2 focus:ring-accent transition-all";
  const buttonClass = "bg-accent text-navy font-bold py-2 px-4 rounded-lg hover:bg-accent-light transition-all duration-300 shadow-md hover:shadow-accent-glow h-10"
  const deleteButtonClass = "flex items-center justify-center bg-danger/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-danger transition-all duration-300 shadow-md h-10"

  return (
    <>
      <div className="bg-slate/70 backdrop-blur-lg border border-light-slate/50 p-6 rounded-xl shadow-lg mt-8 space-y-8">
        <h3 className="text-2xl font-bold text-white border-b-2 border-accent/30 pb-2">管理者パネル</h3>
        
        {/* AI Persona Settings */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-accent">AIコーチ設定</h4>
          <div className="max-w-xs">
              <label htmlFor="ai-persona-select" className="block text-gray-text mb-2 text-sm">
                  分析スタイルを選択してください
              </label>
              <select
                  id="ai-persona-select"
                  value={player.aiPersona || 'analyst'}
                  onChange={handlePersonaChange}
                  className={inputClass}
              >
                  <option value="analyst">AIパフォーマンスアナリスト</option>
                  <option value="demon_coach">AI鬼教官</option>
              </select>
          </div>
        </div>

        {/* Target Settings */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-accent">目標設定</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
              <input type="number" name="weight" placeholder="体重 (kg)" value={targets.weight || ''} onChange={handleTargetChange} className={inputClass} />
              <input type="text" name="broncoTime" placeholder="ブロンコ (MM:SS)" value={targets.broncoTime || ''} onChange={handleTargetChange} className={inputClass} />
              <input type="number" name="benchPress" placeholder="ベンチ (kg)" value={targets.benchPress || ''} onChange={handleTargetChange} className={inputClass} />
              <input type="number" name="squat" placeholder="スクワット (kg)" value={targets.squat || ''} onChange={handleTargetChange} className={inputClass} />
              <input type="number" name="deadlift" placeholder="デッドリフト (kg)" value={targets.deadlift || ''} onChange={handleTargetChange} className={inputClass} />
              <input type="number" name="clean" placeholder="クリーン (kg)" value={targets.clean || ''} onChange={handleTargetChange} className={inputClass} />
              <button onClick={handleSaveTargets} className={buttonClass}>目標を保存</button>
          </div>
        </div>

        {/* Single Record Add */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-accent">新しい記録を追加 / 更新</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-end">
              <input type="date" value={newRecordDate} onChange={e => setNewRecordDate(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
              <input type="number" name="weight" placeholder="体重 (kg)" value={newRecord.weight || ''} onChange={handleInputChange} className={inputClass} />
              <input type="text" name="broncoTime" placeholder="ブロンコ (MM:SS)" value={newRecord.broncoTime || ''} onChange={handleInputChange} className={inputClass} />
              <input type="number" name="benchPress" placeholder="ベンチ (kg)" value={newRecord.benchPress || ''} onChange={handleInputChange} className={inputClass} />
              <input type="number" name="squat" placeholder="スクワット (kg)" value={newRecord.squat || ''} onChange={handleInputChange} className={inputClass} />
              <input type="number" name="deadlift" placeholder="デッドリフト (kg)" value={newRecord.deadlift || ''} onChange={handleInputChange} className={inputClass} />
              <input type="number" name="clean" placeholder="クリーン (kg)" value={newRecord.clean || ''} onChange={handleInputChange} className={inputClass} />
              <button onClick={handleAddRecord} className={buttonClass}>追加 / 更新</button>
          </div>
        </div>
        
        {/* Bulk Add */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-accent">データの一括入力/更新</h4>
          <textarea
            value={bulkData}
            onChange={e => setBulkData(e.target.value)}
            placeholder="以下の形式でデータを貼り付けてください (各項目はタブまたはスペースで区切る):\nYYYY-MM-DD  体重  MM:SS  ベンチ  スクワット  デッドリフト  クリーン"
            className={`${inputClass} h-32 font-mono text-sm`}
          />
          <button onClick={handleBulkAdd} className={buttonClass}>一括処理</button>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-light-slate/50 pt-6">
            <h4 className="text-lg font-semibold text-danger-light">Warning</h4>
            <div className="mt-4">
                <p className="text-gray-text mb-4">この選手をシステムから完全に削除します。この操作は元に戻すことはできません。</p>
                <button onClick={handleDeleteClick} className={deleteButtonClass}>
                    <TrashIcon />
                    <span className="ml-2">{player.name} を削除</span>
                </button>
            </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="部員の削除"
        message={`本当に ${player.name} を削除しますか？\nこの操作は元に戻すことはできません。`}
        theme="detail"
      />
    </>
  );
};

export default AdminPanel;