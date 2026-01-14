import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import BulkInputModal from './BulkInputModal';
import UploadIcon from './icons/UploadIcon';
import Ranking from './Ranking';
import AddPlayerModal from './AddPlayerModal';
import UserPlusIcon from './icons/UserPlusIcon';

interface PlayerListProps {
  players: Player[];
  onSelectPlayer: (id: number) => void;
  isAdmin: boolean;
  onBulkUpdate: (data: string) => void;
  onAddNewPlayer: (name: string, position: string, grade: number) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onSelectPlayer, isAdmin, onBulkUpdate, onAddNewPlayer }) => {
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);

  const playersByGrade = players.reduce((acc, player) => {
    const grade = player.grade;
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(player);
    return acc;
  }, {} as Record<number, Player[]>);

  const gradesToDisplay = [4, 3, 2, 1];
  
  const handleBulkSubmit = (data: string) => {
    onBulkUpdate(data);
    setIsBulkModalOpen(false);
  };
  
  const handleAddPlayerSubmit = (name: string, position: string, grade: number) => {
    onAddNewPlayer(name, position, grade);
    setIsAddPlayerModalOpen(false);
  };

  const lastUpdatedDate = useMemo(() => {
    let latestDate: Date | null = null;
    players.forEach(player => {
      player.records.forEach(record => {
        if (record.date) {
            const recordDate = new Date(record.date);
            if (!latestDate || recordDate > latestDate) {
                latestDate = recordDate;
            }
        }
      });
    });
    if (!latestDate) return null;
    return latestDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }, [players]);


  return (
    <div className="space-y-12">
      <div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-0 animate-fadeInUp"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        <Ranking players={players} type="latest" lastUpdatedDate={lastUpdatedDate} />
        <Ranking players={players} type="growth" lastUpdatedDate={lastUpdatedDate} />
      </div>

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b-2 border-old-accent-light/20 pb-4 mt-12 gap-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">選手一覧</h2>
          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsAddPlayerModalOpen(true)}
                className="flex items-center justify-center bg-old-accent hover:bg-old-accent-light text-old-navy font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-old-accent-glow"
              >
                <UserPlusIcon />
                <span className="ml-2">部員を追加</span>
              </button>
              <button 
                onClick={() => setIsBulkModalOpen(true)}
                className="flex items-center justify-center bg-old-light-slate hover:bg-old-slate text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                <UploadIcon />
                <span className="ml-2">全体データ一括入力</span>
              </button>
            </div>
          )}
        </div>

        {isBulkModalOpen && (
          <BulkInputModal 
            onClose={() => setIsBulkModalOpen(false)}
            onSubmit={handleBulkSubmit}
            theme="home"
          />
        )}
        
        {isAddPlayerModalOpen && (
          <AddPlayerModal 
            onClose={() => setIsAddPlayerModalOpen(false)}
            onSubmit={handleAddPlayerSubmit}
            theme="home"
          />
        )}

        {gradesToDisplay.map((grade, gradeIndex) => (
          <div key={grade}>
            <h3 className="text-2xl font-bold text-old-accent-light mt-8 mb-4">{grade}年生</h3>
            {(playersByGrade[grade] && playersByGrade[grade].length > 0) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {playersByGrade[grade].map((player, playerIndex) => (
                  <div
                    key={player.id}
                    className="bg-old-slate/50 backdrop-blur-lg border border-old-light-slate/50 rounded-xl p-4 shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ease-in-out group hover:border-old-accent hover:shadow-old-accent-glow"
                    onClick={() => onSelectPlayer(player.id)}
                    style={{ animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0, animationDelay: `${200 + (gradeIndex * 100) + (playerIndex * 50)}ms` }}
                  >
                    <h4 className="text-lg font-bold text-white group-hover:text-old-accent-light transition-colors truncate">{player.name}</h4>
                    <p className="text-sm text-old-gray-text">{player.position}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-old-gray-text bg-old-slate/30 border border-old-light-slate/20 p-4 rounded-lg text-center">
                この学年の部員は登録されていません。
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;