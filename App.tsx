import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Player, PerformanceRecord } from './types';
import { initialPlayers } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import PlayerList from './components/PlayerList';
import PlayerDetail from './components/PlayerDetail';
import Header from './components/Header';

const App: React.FC = () => {
  const [players, setPlayers] = useLocalStorage<Player[]>('rugbyPlayerData', initialPlayers);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const theme = selectedPlayerId ? 'detail' : 'home';

  const handleSelectPlayer = (id: number) => {
    setSelectedPlayerId(id);
  };

  const handleBackToList = () => {
    setSelectedPlayerId(null);
  };

  const updatePlayerData = useCallback((playerId: number, updatedRecords: Player['records']) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === playerId ? { ...p, records: updatedRecords } : p
      )
    );
  }, [setPlayers]);

  const updatePlayerTargets = useCallback((playerId: number, newTargets: Player['targets']) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === playerId ? { ...p, targets: newTargets } : p
      )
    );
  }, [setPlayers]);
  
  const updatePlayerPersona = useCallback((playerId: number, persona: Player['aiPersona']) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === playerId ? { ...p, aiPersona: persona } : p
      )
    );
  }, [setPlayers]);

  const handleBulkUpdateAllPlayers = useCallback((bulkData: string) => {
    const lines = bulkData.trim().split('\n');
    const updatedPlayersMap = new Map(players.map(p => [p.name, JSON.parse(JSON.stringify(p))]));
    let successCount = 0;
    const errorLines: number[] = [];

    lines.forEach((line, index) => {
      if (!line.trim()) return;
      const parts = line.split(',').map(s => s.trim());
      if (parts.length < 2) {
        errorLines.push(index + 1);
        return;
      }
      const [name, date, weight, broncoTime, benchPress, squat, deadlift, clean] = parts;
      
      const playerToUpdate = updatedPlayersMap.get(name);
      
      if (!playerToUpdate) {
        errorLines.push(index + 1);
        return;
      }

      const newRecord: PerformanceRecord = {
        date,
        weight: weight ? parseFloat(weight) : null,
        broncoTime: broncoTime || null,
        benchPress: benchPress ? parseFloat(benchPress) : null,
        squat: squat ? parseFloat(squat) : null,
        deadlift: deadlift ? parseFloat(deadlift) : null,
        clean: clean ? parseFloat(clean) : null,
      };

      const existingRecordIndex = playerToUpdate.records.findIndex(r => r.date === date);
      if (existingRecordIndex > -1) {
        playerToUpdate.records[existingRecordIndex] = newRecord;
      } else {
        playerToUpdate.records.push(newRecord);
      }
      successCount++;
    });

    const finalPlayers = Array.from(updatedPlayersMap.values()).map(p => {
        p.records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return p;
    });

    setPlayers(finalPlayers);

    let alertMessage = `${successCount}件のデータを正常に処理しました。`;
    if (errorLines.length > 0) {
      alertMessage += `\n以下の行でエラーが発生しました（選手名が見つからないか、データ形式が不正です）: ${errorLines.join(', ')}`;
    }
    alert(alertMessage);
  }, [players, setPlayers]);
  
  const handleAddNewPlayer = useCallback((name: string, position: string, grade: number) => {
    setPlayers(prevPlayers => {
      const newId = prevPlayers.length > 0 ? Math.max(...prevPlayers.map(p => p.id)) + 1 : 1;
      const newPlayer: Player = {
        id: newId,
        name,
        position,
        grade,
        records: [],
        targets: { weight: null, broncoTime: null, benchPress: null, squat: null, deadlift: null, clean: null },
        aiPersona: 'analyst',
      };
      // 新しい選手を学年でソートするために、一度ソートをかける
      const updatedPlayers = [...prevPlayers, newPlayer];
      updatedPlayers.sort((a, b) => {
        if (a.grade !== b.grade) {
          return b.grade - a.grade;
        }
        return a.name.localeCompare(b.name);
      });
      return updatedPlayers;
    });
  }, [setPlayers]);

  const handleDeletePlayer = useCallback((playerId: number) => {
    setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== playerId));
    setSelectedPlayerId(null);
  }, [setPlayers]);

  const selectedPlayer = useMemo(() => 
    players.find(p => p.id === selectedPlayerId), 
    [players, selectedPlayerId]
  );
  
  useEffect(() => {
    document.body.className = theme === 'detail' 
      ? 'font-sans bg-navy text-gray-text' 
      : 'font-sans bg-old-navy text-old-gray-text';
  }, [theme]);

  const backgroundClass = theme === 'detail' ? 'bg-futuristic-gradient' : 'bg-home-vibrant-gradient';

  return (
    <div className={`min-h-screen font-sans ${backgroundClass}`}>
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        showBack={!!selectedPlayer}
        onBack={handleBackToList}
        theme={theme}
      />
      <main className="container mx-auto p-4 md:p-8">
        {!selectedPlayer ? (
          <PlayerList 
            players={players} 
            onSelectPlayer={handleSelectPlayer} 
            isAdmin={isAdmin}
            onBulkUpdate={handleBulkUpdateAllPlayers}
            onAddNewPlayer={handleAddNewPlayer}
          />
        ) : (
          <PlayerDetail
            player={selectedPlayer}
            isAdmin={isAdmin}
            updatePlayerData={updatePlayerData}
            updatePlayerTargets={updatePlayerTargets}
            onDeletePlayer={handleDeletePlayer}
            updatePlayerPersona={updatePlayerPersona}
          />
        )}
      </main>
    </div>
  );
};

export default App;