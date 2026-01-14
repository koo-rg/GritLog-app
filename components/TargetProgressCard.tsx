import React, { useEffect, useState } from 'react';
import { PerformanceRecord, PlayerTargets } from '../types';
import { broncoTimeToSeconds } from '../utils/time';
import { Metric } from './MetricGrowthCard';

interface TargetProgressCardProps {
  metric: Metric;
  records: PerformanceRecord[];
  targets: PlayerTargets;
}

const TargetProgressCard: React.FC<TargetProgressCardProps> = ({ metric, records, targets }) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  const getLatestNumericValue = (metricKey: keyof PerformanceRecord): number | null => {
    for (let i = records.length - 1; i >= 0; i--) {
      const record = records[i];
      const value = record[metricKey];
      if (value !== null && value !== undefined && value !== '') {
        if (metricKey === 'broncoTime' && typeof value === 'string') {
          return broncoTimeToSeconds(value);
        }
        if (typeof value === 'number') {
          return value;
        }
      }
    }
    return null;
  };

  const getTargetNumericValue = (metricKey: keyof PlayerTargets): number | null => {
    const value = targets[metricKey];
    if (value !== null && value !== undefined && value !== '') {
      if (metricKey === 'broncoTime' && typeof value === 'string') {
        return broncoTimeToSeconds(value);
      }
      if (typeof value === 'number') {
        return value;
      }
    }
    return null;
  };

  useEffect(() => {
    const latestValue = getLatestNumericValue(metric.key);
    const targetValue = getTargetNumericValue(metric.key);

    let progress = 0;
    if (latestValue !== null && targetValue !== null && targetValue > 0) {
      if (metric.higherIsBetter) {
        progress = (latestValue / targetValue) * 100;
      } else { // Lower is better (Bronco)
        const startValue = Math.max(latestValue, targetValue) * 1.2; // Assume a reasonable starting point
        const totalImprovement = startValue - targetValue;
        const currentImprovement = startValue - latestValue;
        if(totalImprovement > 0){
          progress = (currentImprovement / totalImprovement) * 100;
        } else {
          progress = latestValue <= targetValue ? 100 : 0;
        }
      }
    }
    // Set progress with a delay for animation
    const timer = setTimeout(() => setCurrentProgress(Math.min(progress, 150)), 100);
    return () => clearTimeout(timer);
  }, [records, targets, metric.key, metric.higherIsBetter]);


  const latestRecord = records.filter(r => r[metric.key] != null && r[metric.key] !== '');
  const latestDisplay = latestRecord.length > 0 ? latestRecord[latestRecord.length - 1][metric.key] : '-';
  
  const targetDisplay = targets[metric.key] != null ? targets[metric.key] : '-';

  return (
    <div className="bg-slate/50 backdrop-blur-lg border border-light-slate/50 p-4 rounded-xl shadow-lg h-full">
      <h4 className="font-semibold text-white mb-3 flex items-center">
        <span className={`p-2 rounded-full mr-3 ${metric.bgColor} ${metric.iconColor}`}>{metric.Icon}</span>
        {metric.name}
      </h4>
      <div className="w-full bg-light-slate/50 rounded-full h-2.5 mb-2 overflow-hidden">
        <div 
          className="bg-accent h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${currentProgress}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-text">最新: <span className="font-semibold text-white">{latestDisplay}</span></span>
        <span className="font-bold text-accent">{currentProgress.toFixed(0)}%</span>
        <span className="text-gray-text">目標: <span className="font-semibold text-white">{targetDisplay}</span></span>
      </div>
    </div>
  );
};

export default TargetProgressCard;