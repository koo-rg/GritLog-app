import React from 'react';
import { PerformanceRecord, PlayerTargets } from '../types';
import { broncoTimeToSeconds, secondsToBroncoTime } from '../utils/time';

export interface Metric {
  key: keyof PlayerTargets;
  name: string;
  unit: string;
  Icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  higherIsBetter: boolean;
}

interface MetricGrowthCardProps {
  metric: Metric;
  records: PerformanceRecord[];
}

const GrowthStat: React.FC<{ label: string; value: string | React.ReactNode;}> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-light-slate/50 last:border-b-0">
        <p className="text-gray-text">{label}</p>
        <p className="text-white font-semibold text-lg">{value}</p>
    </div>
);

const MetricGrowthCard: React.FC<MetricGrowthCardProps> = ({ metric, records }) => {
  const validRecords = records.filter(r => r[metric.key] != null && r[metric.key] !== '');
  const cardBaseClass = "bg-slate/50 backdrop-blur-lg border border-light-slate/50 p-4 rounded-xl shadow-lg h-full"

  if (validRecords.length === 0) {
    return (
        <div className={cardBaseClass}>
            <h3 className="font-semibold text-white mb-4 flex items-center">
                <span className={`p-2 rounded-full mr-3 ${metric.bgColor} ${metric.iconColor}`}>{metric.Icon}</span>
                {metric.name}
            </h3>
            <p className="text-gray-text text-center py-8">データがありません</p>
        </div>
    );
  }

  const isBronco = metric.key === 'broncoTime';

  const getNumericValue = (record: PerformanceRecord) => {
    const value = record[metric.key];
    if (isBronco && typeof value === 'string') {
      return broncoTimeToSeconds(value);
    }
    return typeof value === 'number' ? value : null;
  };
  
  const latestRecord = validRecords[validRecords.length - 1];
  const latestValue = getNumericValue(latestRecord);
  const firstRecord = validRecords[0];
  const firstValue = getNumericValue(firstRecord);

  let changeFromPrevious: number | null = null;
  if (validRecords.length > 1) {
    const previousRecord = validRecords[validRecords.length - 2];
    const previousValue = getNumericValue(previousRecord);
    if (latestValue !== null && previousValue !== null) {
      changeFromPrevious = latestValue - previousValue;
    }
  }

  const changeFromFirst = (latestValue !== null && firstValue !== null) ? latestValue - firstValue : null;

  const bestRecord = validRecords.reduce((best, current) => {
    const bestVal = getNumericValue(best);
    const currentVal = getNumericValue(current);
    if (bestVal === null) return current;
    if (currentVal === null) return best;
    
    if (metric.higherIsBetter) {
      return currentVal > bestVal ? current : best;
    } else {
      return currentVal < bestVal ? current : best;
    }
  });
  
  const formatChange = (change: number | null) => {
    if (change === null) return <span className="text-gray-text">-</span>;
    const isImprovement = metric.higherIsBetter ? change > 0 : change < 0;
    const isDecline = metric.higherIsBetter ? change < 0 : change > 0;
    
    let colorClass = 'text-white';
    if (isImprovement) colorClass = 'text-accent';
    if (isDecline) colorClass = 'text-pink';
    
    const sign = change > 0 ? '+' : '';
    const formattedChange = isBronco ? `${sign}${change.toFixed(0)}s` : `${sign}${change.toFixed(1)}${metric.unit}`;

    return <span className={colorClass}>{formattedChange}</span>;
  }

  return (
    <div className={cardBaseClass}>
        <h3 className="font-semibold text-white mb-4 flex items-center">
            <span className={`p-2 rounded-full mr-3 ${metric.bgColor} ${metric.iconColor}`}>{metric.Icon}</span>
            {metric.name}
        </h3>
        <div className="space-y-1">
            <GrowthStat label="最新記録" value={latestRecord[metric.key] || '-'} />
            <GrowthStat label="前回比" value={formatChange(changeFromPrevious)} />
            <GrowthStat label="初回比" value={formatChange(changeFromFirst)} />
            <GrowthStat label="自己ベスト" value={
                <span>
                    {bestRecord[metric.key]}
                    <span className="text-sm text-gray-text ml-2">({bestRecord.date})</span>
                </span>
            } />
        </div>
    </div>
  );
};

export default MetricGrowthCard;