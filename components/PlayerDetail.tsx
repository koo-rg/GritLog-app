import React, { useState, useEffect } from 'react';
import { Player, PerformanceRecord, PlayerTargets } from '../types';
import AdminPanel from './AdminPanel';
import RecordsTable from './RecordsTable';
import WeightScaleIcon from './icons/WeightScaleIcon';
import DumbbellIcon from './icons/DumbbellIcon';
import MetricGrowthCard, { Metric } from './MetricGrowthCard';
import TargetProgressCard from './TargetProgressCard';
import AIAnalysisCard from './AIAnalysisCard';
import { GoogleGenAI } from '@google/genai';
import ChartLineIcon from './icons/ChartLineIcon';

interface PlayerDetailProps {
  player: Player;
  isAdmin: boolean;
  updatePlayerData: (playerId: number, updatedRecords: PerformanceRecord[]) => void;
  updatePlayerTargets: (playerId: number, newTargets: PlayerTargets) => void;
  onDeletePlayer: (playerId: number) => void;
  updatePlayerPersona: (playerId: number, persona: Player['aiPersona']) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; iconBgColor?: string; iconColor?: string }> = ({ icon, label, value, iconBgColor = 'bg-light-slate', iconColor = 'text-white' }) => (
    <div className="bg-slate/50 border border-light-slate/50 p-4 rounded-xl flex items-center shadow-lg h-full">
        <div className={`p-3 rounded-full mr-4 ${iconBgColor} ${iconColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-text">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const PlayerDetail: React.FC<PlayerDetailProps> = ({ player, isAdmin, updatePlayerData, updatePlayerTargets, onDeletePlayer, updatePlayerPersona }) => {
  const [aiComment, setAiComment] = useState('');
  const [isLoadingComment, setIsLoadingComment] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    if (!process.env.API_KEY) {
        setError("APIキーが設定されていません。");
        setIsLoadingComment(false);
        return;
    }

    const generateAIComment = async () => {
        setIsLoadingComment(true);
        setError(null);
        setAiComment('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const recentRecords = player.records.slice(-3).reverse();
            const recordsString = recentRecords.length > 0
              ? recentRecords.map(r => 
                ` - ${r.date}: 体重 ${r.weight || '-'}kg, BP ${r.benchPress || '-'}kg, SQ ${r.squat || '-'}kg, DL ${r.deadlift || '-'}kg, CL ${r.clean || '-'}kg, Bronco ${r.broncoTime || '-'}`
              ).join('\n')
              : '記録がありません。';

            const targetsString = `体重 ${player.targets.weight || '-'}kg, BP ${player.targets.benchPress || '-'}kg, SQ ${player.targets.squat || '-'}kg, DL ${player.targets.deadlift || '-'}kg, CL ${player.targets.clean || '-'}kg, Bronco ${player.targets.broncoTime || '-'}`;

            const persona = player.aiPersona || 'analyst';
            let prompt = '';

            if (persona === 'demon_coach') {
              prompt = `あなたは一流ラグビーチームの非常に厳格なAI鬼教官です。あなたの言葉は辛辣ですが、その裏には深い愛情と期待が込められています。選手の限界を引き出すため、一切の妥協を許しません。以下の選手のデータに基づき、分析を提供してください。
必ず、以下の構成を守ってください。
1. まず、最近のパフォーマンスで「唯一」評価できる点を、少しだけ（本当に少しだけ）褒めます。
2. 次に、目標達成のために改善すべき点を、具体的かつ厳しい言葉で「2つ以上」指摘します。
3. 最後に、選手を精神的に追い込み、さらなる高みへと奮い立たせるような、熱い檄を飛ばして締めくくります。
分析は日本語で、全体で150字から200字程度にまとめてください。

選手名: ${player.name}
ポジション: ${player.position}

目標値:
${targetsString}

最近の記録 (新しい順):
${recordsString}
`;
            } else { // analyst (default)
              prompt = `あなたは一流ラグビーチームの最先端AIパフォーマンスアナリストです。あなたの分析は鋭く、データに基づき、選手を鼓舞するものです。以下の選手のデータに基づき、分析を提供してください。
必ず、以下の構成を守ってください。
1. まず、最近のパフォーマンスで特筆すべき良い点を「1つ以上」挙げ、具体的に褒めます。
2. 次に、さらなる成長のために取り組むべき課題やアドバイスを「2つ以上」、具体的かつ実行可能な形で提案します。
分析は日本語で、全体で150字から200字程度にまとめてください。

選手名: ${player.name}
ポジション: ${player.position}

目標値:
${targetsString}

最近の記録 (新しい順):
${recordsString}
`;
            }
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            if (controller.signal.aborted) return;

            if (response.text) {
                setAiComment(response.text);
            } else {
                throw new Error("AIからの応答がありませんでした。");
            }

        } catch (e: any) {
             if (e.name === 'AbortError') {
                console.log('Fetch aborted');
                return;
            }
            console.error("AI comment generation failed:", e);
            setError("AIコメントの生成に失敗しました。");
        } finally {
            if (!controller.signal.aborted) {
                setIsLoadingComment(false);
            }
        }
    };

    generateAIComment();

    return () => {
        controller.abort();
    }
  }, [player]);

  const getLatestMetricValue = (metricKey: keyof PerformanceRecord): string | number | null => {
    for (let i = player.records.length - 1; i >= 0; i--) {
      const record = player.records[i];
      const value = record[metricKey];
      if (value !== null && value !== undefined && value !== '') {
        return value;
      }
    }
    return null;
  };

  const latestWeight = getLatestMetricValue('weight');
  const latestBenchPress = getLatestMetricValue('benchPress');
  const latestSquat = getLatestMetricValue('squat');
  const latestDeadlift = getLatestMetricValue('deadlift');
  const latestClean = getLatestMetricValue('clean');
  const latestBroncoTime = getLatestMetricValue('broncoTime');

  const metrics: Metric[] = [
    { key: 'weight', name: '体重', unit: 'kg', Icon: <WeightScaleIcon />, iconColor: 'text-white', bgColor: 'bg-sky/80', higherIsBetter: true },
    { key: 'benchPress', name: 'ベンチプレス', unit: 'kg', Icon: <DumbbellIcon />, iconColor: 'text-white', bgColor: 'bg-pink/80', higherIsBetter: true },
    { key: 'squat', name: 'スクワット', unit: 'kg', Icon: <DumbbellIcon />, iconColor: 'text-white', bgColor: 'bg-purple/80', higherIsBetter: true },
    { key: 'deadlift', name: 'デッドリフト', unit: 'kg', Icon: <DumbbellIcon />, iconColor: 'text-white', bgColor: 'bg-orange/80', higherIsBetter: true },
    { key: 'clean', name: 'クリーン', unit: 'kg', Icon: <DumbbellIcon />, iconColor: 'text-white', bgColor: 'bg-teal/80', higherIsBetter: true },
    { key: 'broncoTime', name: 'ブロンコテスト', unit: '', Icon: <ChartLineIcon />, iconColor: 'text-accent', bgColor: 'bg-accent/20', higherIsBetter: false },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-slate/50 p-6 rounded-xl shadow-2xl text-center border border-light-slate/50">
        <div>
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-wide">{player.name}</h2>
          <p className="text-xl md:text-2xl text-accent font-semibold mt-1 tracking-wider">{player.position}</p>
        </div>
      </div>
      
      <AIAnalysisCard
        comment={aiComment}
        isLoading={isLoadingComment}
        error={error}
        persona={player.aiPersona || 'analyst'}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon={<WeightScaleIcon />} label="最新体重" value={latestWeight !== null ? `${latestWeight} kg` : '-'} iconBgColor="bg-sky/80" />
          <StatCard icon={<DumbbellIcon />} label="ベンチ" value={latestBenchPress !== null ? `${latestBenchPress} kg` : '-'} iconBgColor="bg-pink/80" />
          <StatCard icon={<DumbbellIcon />} label="スクワット" value={latestSquat !== null ? `${latestSquat} kg` : '-'} iconBgColor="bg-purple/80"/>
          <StatCard icon={<DumbbellIcon />} label="デッドリフト" value={latestDeadlift !== null ? `${latestDeadlift} kg` : '-'} iconBgColor="bg-orange/80" />
          <StatCard icon={<DumbbellIcon />} label="クリーン" value={latestClean !== null ? `${latestClean} kg` : '-'} iconBgColor="bg-teal/80" />
          <StatCard icon={<ChartLineIcon />} label="ブロンコ" value={latestBroncoTime !== null ? String(latestBroncoTime) : '-'} iconBgColor="bg-accent/20" iconColor="text-accent"/>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mt-8 mb-4 border-b-2 border-accent/30 pb-2">目標達成状況</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {metrics.map((metric, index) => (
                <div key={metric.key} className="opacity-0 animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                    <TargetProgressCard
                        metric={metric}
                        records={player.records}
                        targets={player.targets}
                    />
                </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {metrics.map((metric, index) => (
          <div key={metric.key} className="opacity-0 animate-fadeInUp" style={{ animationDelay: `${index * 100 + 100}ms` }}>
            <MetricGrowthCard
              metric={metric}
              records={player.records}
            />
          </div>
        ))}
      </div>

      <div className="bg-slate/70 backdrop-blur-lg border border-light-slate/50 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-white border-b-2 border-accent/30 pb-2 mb-6">全記録データ</h3>
          <RecordsTable
            records={player.records}
            isAdmin={isAdmin}
          />
      </div>

      {isAdmin && <AdminPanel player={player} updatePlayerData={updatePlayerData} updatePlayerTargets={updatePlayerTargets} onDeletePlayer={onDeletePlayer} updatePlayerPersona={updatePlayerPersona} />}
    </div>
  );
};

export default PlayerDetail;