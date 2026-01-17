/**
 * LoadingSpinner component
 * Animated loading indicator
 */
export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-[#00D084] rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-500 text-sm animate-pulse">Loading TrendRadar...</p>
    </div>
  );
}
