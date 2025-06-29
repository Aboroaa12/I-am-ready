import React from 'react';
import { Star, Trophy, Zap } from 'lucide-react';
import { UserProgress } from '../types';

interface ProgressBarProps {
  progress: UserProgress;
  currentActivity?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, currentActivity }) => {
  const calculateOverallProgress = () => {
    // Ensure progress starts at 0% when totalScore is 0
    if (progress.totalScore === 0) return 0;
    const baseProgress = Math.min((progress.totalScore / 500) * 100, 100);
    return Math.round(baseProgress);
  };

  const progressPercentage = calculateOverallProgress();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">تقدمك في التعلم</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-gray-700">{progress.totalScore}</span>
          </div>
          {progress.currentStreak > 0 && (
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-gray-700">{progress.currentStreak}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>التقدم العام</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {currentActivity && (
        <div className="text-center py-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            النشاط الحالي: {currentActivity}
          </span>
        </div>
      )}

      {progress.unitsCompleted.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">الوحدات المكتملة:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {progress.unitsCompleted.map((unit, index) => (
              <span 
                key={index}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold"
              >
                {unit}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;