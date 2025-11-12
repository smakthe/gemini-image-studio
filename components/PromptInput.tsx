
import React, { useState, useEffect } from 'react';
import { AppMode } from '../types';
import { SparklesIcon } from './IconComponents';
import EDIT_EXAMPLES from '../EDIT_EXAMPLES';
import TIME_TRAVEL_EXAMPLES from '../TIME_TRAVEL_EXAMPLES';
import GENERATE_EXAMPLES from '../GENERATE_EXAMPLES';

interface PromptInputProps {
  mode: AppMode;
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isImageUploaded: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ mode, prompt, onPromptChange, onSubmit, isLoading, isImageUploaded }) => {
  const [displayExamples, setDisplayExamples] = useState<string[]>([]);

  const getModeConfig = () => {
    switch (mode) {
      case AppMode.GENERATE:
        return {
          title: "1. Describe Your Vision",
          placeholder: "e.g., 'A robot holding a red skateboard.'",
          examples: GENERATE_EXAMPLES,
          isReady: true,
        };
      case AppMode.EDIT:
        return {
          title: "2. Describe Your Vision",
          placeholder: "e.g., 'Add a retro filter' or 'Make the background a cityscape at night.'",
          examples: EDIT_EXAMPLES,
          isReady: isImageUploaded,
        };
      case AppMode.TIME_TRAVEL:
        return {
          title: "2. Describe Your Vision",
          placeholder: "e.g., 'A 1920s jazz singer on stage' or 'An astronaut on Mars'.",
          examples: TIME_TRAVEL_EXAMPLES,
          isReady: isImageUploaded,
        };
    }
  };

  const config = getModeConfig();

  useEffect(() => {
    const shuffled = [...config.examples].sort(() => 0.5 - Math.random());
    setDisplayExamples(shuffled.slice(0, 5));
  }, [mode, isImageUploaded]); // Re-shuffle when mode or image upload status changes

  const isDisabled = isLoading || !config.isReady || prompt.trim().length === 0;

  const handleSuggestionClick = (example: string) => {
    if (prompt.trim().length === 0) {
      onPromptChange(example);
    } else {
      const formattedExample = example.charAt(0).toLowerCase() + example.slice(1);
      const newPrompt = `${prompt} and ${formattedExample}`;
      onPromptChange(newPrompt);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
      <h2 className="text-lg font-semibold mb-4 text-indigo-300">{config.title}</h2>
      <div className="flex flex-col space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={config.placeholder}
          rows={3}
          className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!config.isReady}
          aria-label="Prompt input"
        />

        {config.isReady && (
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              {prompt.length === 0 ? 'Suggestions:' : 'Add to your prompt:'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {displayExamples.map((example) => (
                <button
                  key={example}
                  onClick={() => handleSuggestionClick(example)}
                  className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={onSubmit}
          disabled={isDisabled}
          className="flex items-center justify-center w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate Image
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
