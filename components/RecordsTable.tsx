import React from 'react';
import { PerformanceRecord } from '../types';

interface RecordsTableProps {
  records: PerformanceRecord[];
  isAdmin: boolean;
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records, isAdmin }) => {
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b-2 border-light-slate/50">
          <tr className="text-left text-accent">
            <th className="p-3 text-sm font-semibold tracking-wider">日付</th>
            <th className="p-3 text-sm font-semibold tracking-wider">体重(kg)</th>
            <th className="p-3 text-sm font-semibold tracking-wider">ブロンコ</th>
            <th className="p-3 text-sm font-semibold tracking-wider">ベンチ(kg)</th>
            <th className="p-3 text-sm font-semibold tracking-wider">スクワット(kg)</th>
            <th className="p-3 text-sm font-semibold tracking-wider">デッドリフト(kg)</th>
            <th className="p-3 text-sm font-semibold tracking-wider">クリーン(kg)</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map(record => (
            <tr key={record.date} className="border-b border-light-slate/30 hover:bg-light-slate/20 transition-colors duration-200">
              <td className="p-3 text-white font-medium">{record.date}</td>
              <td className="p-3 text-gray-text">{record.weight !== null ? record.weight : '-'}</td>
              <td className="p-3 text-gray-text">{record.broncoTime || '-'}</td>
              <td className="p-3 text-gray-text">{record.benchPress !== null ? record.benchPress : '-'}</td>
              <td className="p-3 text-gray-text">{record.squat !== null ? record.squat : '-'}</td>
              <td className="p-3 text-gray-text">{record.deadlift !== null ? record.deadlift : '-'}</td>
              <td className="p-3 text-gray-text">{record.clean !== null ? record.clean : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;