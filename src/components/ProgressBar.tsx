import React from 'react';

interface ProgressBarProps {
  percentage: number;
  completed?: number;
  total?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  completed,
  total,
  size = 'md',
  showLabel = true,
  color = 'from-blue-600 to-indigo-600',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-400">
            {completed !== undefined && total !== undefined ? (
              <span className="tabular-nums">
                {completed} of {total} completed
              </span>
            ) : (
              'Progress'
            )}
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
            {clamped}%
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
