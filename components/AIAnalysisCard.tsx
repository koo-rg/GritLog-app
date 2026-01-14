import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import { Player } from '../types';

interface AIAnalysisCardProps {
    comment: string;
    isLoading: boolean;
    error: string | null;
    persona: Player['aiPersona'];
}

const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ comment, isLoading, error, persona }) => {
    const isDemonCoach = persona === 'demon_coach';
    const title = isDemonCoach ? 'AI鬼教官の檄' : 'AIパフォーマンス分析';
    const titleColor = isDemonCoach ? 'text-danger-light' : 'text-accent';
    const glowAnimation = isDemonCoach 
      ? 'animate-[pulseGlow_2.5s_infinite_ease-in-out]' 
      : 'animate-pulseGlow';
    const titleGlowStyle = isDemonCoach ? { filter: 'drop-shadow(0 0 8px #B00020)' } : {};


    return (
        <div className={`bg-slate/50 p-5 rounded-xl shadow-lg text-white border ${isDemonCoach ? 'border-danger/50' : 'border-accent/30'} backdrop-blur-lg`}>
            <h3 className={`text-xl font-bold mb-3 flex items-center ${titleColor} ${glowAnimation}`} style={titleGlowStyle}>
                <SparklesIcon />
                <span className="ml-2">{title}</span>
            </h3>
            {isLoading && (
                <div className="flex items-center h-16">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span className="text-gray-text">分析中...</span>
                </div>
            )}
            {error && (
                <div className="bg-danger/20 p-3 rounded-lg border border-danger/50">
                    <p className="font-semibold text-danger-light">コメント生成エラー</p>
                    <p className="text-sm text-danger-light/80">{error}</p>
                </div>
            )}
            {!isLoading && !error && comment && (
                <p className="text-base leading-relaxed whitespace-pre-wrap">{comment}</p>
            )}
        </div>
    );
};

export default AIAnalysisCard;