// Utility functions for grade-specific colors

// Get background color for grade
export const getGradeBackgroundColor = (grade: number): string => {
  if (grade === 0) return 'bg-gradient-to-br from-purple-50 to-pink-50';
  if (grade === 1) return 'bg-gradient-to-br from-blue-50 to-sky-50';
  if (grade === 2) return 'bg-gradient-to-br from-green-50 to-emerald-50';
  if (grade === 3) return 'bg-gradient-to-br from-yellow-50 to-amber-50';
  if (grade === 4) return 'bg-gradient-to-br from-orange-50 to-red-50';
  if (grade === 5) return 'bg-gradient-to-br from-pink-50 to-rose-50';
  if (grade === 6) return 'bg-gradient-to-br from-violet-50 to-purple-50';
  if (grade === 7) return 'bg-gradient-to-br from-indigo-50 to-blue-50';
  if (grade === 8) return 'bg-gradient-to-br from-teal-50 to-green-50';
  if (grade === 9) return 'bg-gradient-to-br from-amber-50 to-yellow-50';
  if (grade === 10) return 'bg-gradient-to-br from-red-50 to-orange-50';
  if (grade === 11) return 'bg-gradient-to-br from-rose-50 to-pink-50';
  if (grade === 12) return 'bg-gradient-to-br from-purple-50 to-indigo-50';
  return 'bg-gradient-to-br from-gray-50 to-blue-50';
};

// Get gradient color for grade
export const getGradeGradientColor = (grade: number): string => {
  if (grade === 0) return 'from-purple-600 to-pink-600';
  if (grade === 1) return 'from-blue-500 to-sky-500';
  if (grade === 2) return 'from-green-500 to-emerald-500';
  if (grade === 3) return 'from-yellow-500 to-amber-500';
  if (grade === 4) return 'from-orange-500 to-red-500';
  if (grade === 5) return 'from-pink-500 to-rose-500';
  if (grade === 6) return 'from-violet-500 to-purple-500';
  if (grade === 7) return 'from-indigo-500 to-blue-500';
  if (grade === 8) return 'from-teal-500 to-green-500';
  if (grade === 9) return 'from-amber-500 to-yellow-500';
  if (grade === 10) return 'from-red-500 to-orange-500';
  if (grade === 11) return 'from-rose-500 to-pink-500';
  if (grade === 12) return 'from-purple-500 to-indigo-500';
  return 'from-gray-500 to-slate-500';
};

// Get solid color for grade
export const getGradeSolidColor = (grade: number): string => {
  if (grade === 0) return 'text-purple-600';
  if (grade === 1) return 'text-blue-600';
  if (grade === 2) return 'text-green-600';
  if (grade === 3) return 'text-yellow-600';
  if (grade === 4) return 'text-orange-600';
  if (grade === 5) return 'text-pink-600';
  if (grade === 6) return 'text-violet-600';
  if (grade === 7) return 'text-indigo-600';
  if (grade === 8) return 'text-teal-600';
  if (grade === 9) return 'text-cyan-600';
  if (grade === 10) return 'text-emerald-600';
  if (grade === 11) return 'text-blue-600';
  if (grade === 12) return 'text-teal-600';
  return 'text-gray-600';
};

// Get light background color for grade
export const getGradeLightColor = (grade: number): string => {
  if (grade === 0) return 'bg-purple-50';
  if (grade === 1) return 'bg-blue-50';
  if (grade === 2) return 'bg-green-50';
  if (grade === 3) return 'bg-yellow-50';
  if (grade === 4) return 'bg-orange-50';
  if (grade === 5) return 'bg-pink-50';
  if (grade === 6) return 'bg-violet-50';
  if (grade === 7) return 'bg-indigo-50';
  if (grade === 8) return 'bg-teal-50';
  if (grade === 9) return 'bg-amber-50';
  if (grade === 10) return 'bg-red-50';
  if (grade === 11) return 'bg-rose-50';
  if (grade === 12) return 'bg-purple-50';
  return 'bg-gray-50';
};

// Get border color for grade
export const getGradeBorderColor = (grade: number): string => {
  if (grade === 0) return 'border-purple-300';
  if (grade === 1) return 'border-blue-300';
  if (grade === 2) return 'border-green-300';
  if (grade === 3) return 'border-yellow-300';
  if (grade === 4) return 'border-orange-300';
  if (grade === 5) return 'border-pink-300';
  if (grade === 6) return 'border-violet-300';
  if (grade === 7) return 'border-indigo-300';
  if (grade === 8) return 'border-teal-300';
  if (grade === 9) return 'border-amber-300';
  if (grade === 10) return 'border-red-300';
  if (grade === 11) return 'border-rose-300';
  if (grade === 12) return 'border-purple-300';
  return 'border-gray-300';
};