interface LoadingSpinnerProps {
  isGenerating?: boolean;
}

const LoadingSpinner = ({ isGenerating = false }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
      </div>
      <p className="mt-4 text-gray-600">
        {isGenerating ? 'Generating your roadmap...' : 'Loading...'}
      </p>
    </div>
  );
};

export default LoadingSpinner;