
import React from 'react';
import { ImageResultIcon } from './IconComponents';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
  originalImage: string | undefined;
}

const LoadingSkeleton: React.FC = () => (
  <div className="w-full aspect-square bg-gray-700 rounded-lg animate-pulse flex flex-col items-center justify-center p-8 text-center">
    <div className="w-16 h-16 bg-gray-600 rounded-full mb-4"></div>
    <div className="w-3/4 h-6 bg-gray-600 rounded-md mb-2"></div>
    <div className="w-1/2 h-4 bg-gray-600 rounded-md"></div>
    <p className="text-gray-400 text-sm mt-4">Gemini is thinking... This may take a moment.</p>
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, resultImage, originalImage }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-inner h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-indigo-300">3. Your New Image</h2>
      <div className="flex-grow flex items-center justify-center w-full min-h-[300px] md:min-h-[400px] lg:min-h-full">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Oops! Something went wrong.</h3>
            <p className="text-sm">{error}</p>
          </div>
        ) : resultImage ? (
          <div className="w-full">
            <img src={resultImage} alt="Generated result" className="w-full h-auto object-contain rounded-md max-h-[70vh]" />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <ImageResultIcon className="w-16 h-16 mx-auto mb-4" />
            <p>Your generated image will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
