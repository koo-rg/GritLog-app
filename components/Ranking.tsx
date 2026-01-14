import React, { useState, useMemo } from 'react';
import { Player, PerformanceRecord } from '../types';
import { getPlayerCategory } from '../utils/position';
import { broncoTimeToSeconds } from '../utils/time';
import TrophyIcon from './icons/TrophyIcon';

interface RankingMetric {
    key: keyof PerformanceRecord;
    name: string;
    unit: string;
    higherIsBetter: boolean;
}

const metrics: RankingMetric[] = [
    { key: 'weight', name: '体重', unit: 'kg', higherIsBetter: true },
    { key: 'benchPress', name: 'ベンチ', unit: 'kg', higherIsBetter: true },
    { key: 'squat', name: 'スクワット', unit: 'kg', higherIsBetter: true },
    { key: 'deadlift', name: 'デッドリフト', unit: 'kg', higherIsBetter: true },
    { key: 'clean', name: 'クリーン', unit: 'kg', higherIsBetter: true },
    { key: 'broncoTime', name: 'ブロンコ', unit: '', higherIsBetter: false },
];

const categories = ['全体', 'FW', 'BK'];

interface RankingProps {
  players: Player[];
  type: 'latest' | 'growth';
  lastUpdatedDate?: string | null;
}

const getNumericValue = (record: PerformanceRecord | null, metric: RankingMetric): number | null => {
    if (!record) return null;
    const rawValue = record[metric.key];
    if (metric.key === 'broncoTime' && typeof rawValue === 'string') {
        return broncoTimeToSeconds(rawValue);
    }
    if (typeof rawValue === 'number') {
        return rawValue;
    }
    return null;
};

const Ranking: React.FC<RankingProps> = ({ players, type, lastUpdatedDate }) => {
    const [activeMetric, setActiveMetric] = useState<RankingMetric>(metrics[0]);
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

    const title = type === 'latest' ? 'ランキング (最新記録)' : '成長ランキング (前回比)';

    const rankedPlayers = useMemo(() => {
        const categoryMap: Record<string, 'FW' | 'BK' | 'Unknown'> = {};
        players.forEach(p => {
            categoryMap[p.id] = getPlayerCategory(p.position);
        });
        
        const filteredPlayers = players.filter(p => {
            if (activeCategory === '全体') return true;
            return categoryMap[p.id] === activeCategory;
        });

        if (type === 'latest') {
            const playersWithLatestRecord = filteredPlayers.map(player => {
                const validRecords = player.records.filter(r => r[activeMetric.key] !== null && r[activeMetric.key] !== '');
                const latestRecord = validRecords.length > 0 ? validRecords[validRecords.length - 1] : null;
                const value = getNumericValue(latestRecord, activeMetric);
                return {
                    ...player,
                    value,
                    displayValue: latestRecord ? latestRecord[activeMetric.key] || '-' : '-',
                };
            }).filter(p => p.value !== null);

            playersWithLatestRecord.sort((a, b) => {
                if (a.value === null) return 1;
                if (b.value === null) return -1;
                return activeMetric.higherIsBetter ? b.value - a.value : a.value - b.value;
            });
            
            return playersWithLatestRecord.slice(0, 5);
        } else { // type === 'growth'
            const playersWithGrowth = filteredPlayers
                .filter(p => p.records.filter(r => r[activeMetric.key] !== null && r[activeMetric.key] !== '').length >= 2)
                .map(player => {
                    const validRecords = player.records.filter(r => r[activeMetric.key] !== null && r[activeMetric.key] !== '');
                    const latestRecord = validRecords[validRecords.length - 1];
                    const previousRecord = validRecords[validRecords.length - 2];

                    const latestValue = getNumericValue(latestRecord, activeMetric);
                    const previousValue = getNumericValue(previousRecord, activeMetric);

                    if (latestValue === null || previousValue === null) {
                        return { ...player, growthValue: null, displayValue: '-' };
                    }
                    
                    let growthValue: number;
                    if (activeMetric.higherIsBetter) {
                        growthValue = latestValue - previousValue;
                    } else {
                        growthValue = previousValue - latestValue;
                    }
                    
                    const sign = growthValue > 0 ? '+' : '';
                    const isBronco = activeMetric.key === 'broncoTime';
                    const displayValue = growthValue.toFixed(1) === '0.0' && !isBronco
                        ? '±0'
                        : isBronco
                            ? `${sign}${growthValue.toFixed(0)}s`
                            : `${sign}${growthValue.toFixed(1)}${activeMetric.unit}`;
                    
                    return { ...player, growthValue, displayValue };
                })
                .filter(p => p.growthValue !== null && p.growthValue > 0);

            playersWithGrowth.sort((a, b) => (b.growthValue ?? 0) - (a.growthValue ?? 0));
            
            return playersWithGrowth.slice(0, 5);
        }

    }, [players, activeMetric, activeCategory, type]);

    return (
        <div className="bg-old-slate/50 backdrop-blur-lg border border-old-light-slate/50 p-4 sm:p-6 rounded-xl shadow-lg h-full">
            <div className="flex items-baseline justify-between flex-wrap gap-x-4 gap-y-2 mb-4">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              {lastUpdatedDate && (
                <span className="text-sm text-old-gray-text whitespace-nowrap">最終更新: {lastUpdatedDate}</span>
              )}
            </div>
            <div className="mb-4 overflow-x-auto pb-2 -mx-2 px-2">
                <div className="flex space-x-2">
                    {metrics.map(metric => (
                        <button
                            key={metric.key}
                            onClick={() => setActiveMetric(metric)}
                            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activeMetric.key === metric.key ? 'bg-old-accent text-old-navy shadow-md' : 'text-old-gray-text bg-old-light-slate hover:bg-old-slate'}`}
                        >
                            {metric.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-center space-x-2 mb-4 bg-old-slate/60 p-1 rounded-lg">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`w-full py-2 text-sm font-bold rounded-md transition-all duration-300 ${activeCategory === category ? 'bg-old-accent text-old-navy shadow' : 'text-old-gray-text hover:bg-old-light-slate'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            
            <div>
                {rankedPlayers.length > 0 ? (
                    <ol className="space-y-2">
                        {rankedPlayers.map((player, index) => (
                            <li key={player.id} className="flex items-center bg-old-light-slate/50 border border-old-light-slate/30 p-3 rounded-lg transition-all hover:border-old-accent/50 hover:bg-old-light-slate/80">
                                <span className={`text-lg font-bold w-8 text-center ${index < 3 ? 'text-white' : 'text-old-gray-text'}`}>{index + 1}</span>
                                <TrophyIcon rank={index + 1} />
                                <span className="font-semibold text-white flex-1 mx-2 sm:mx-4 truncate">{player.name} <span className="text-xs text-old-gray-text hidden sm:inline">({player.position})</span></span>
                                <span className="font-bold text-old-accent-light text-lg">
                                  {type === 'latest'
                                    ? `${player.displayValue} ${(player as any).value !== null ? activeMetric.unit : ''}`
                                    : player.displayValue
                                  }
                                </span>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-old-gray-text text-center py-4 h-48 flex items-center justify-center">このカテゴリのデータはありません。</p>
                )}
            </div>
        </div>
    );
};

export default Ranking;