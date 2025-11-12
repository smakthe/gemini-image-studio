import React, { useState, useEffect } from 'react';
import { AppMode } from '../types';
import { SparklesIcon, ChevronDownIcon, ChevronUpIcon, CloseIcon } from './IconComponents';
import { useAnimatedPlaceholder } from '../hooks/useAnimatedPlaceholder';
import { modeConfigs } from '../config/modeConfig';
import SuggestionChips from './SuggestionChips';

interface PromptInputProps {
  mode: AppMode;
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isImageUploaded: boolean;
  promptError: string | null;
}

const PromptInput: React.FC<PromptInputProps> = ({ mode, prompt, onPromptChange, onSubmit, isLoading, isImageUploaded, promptError }) => {
  const [isOpen, setIsOpen] = useState(false);

  const config = modeConfigs[mode];
  const isReady = mode === AppMode.GENERATE ? true : isImageUploaded;
  const isCollapsible = mode === AppMode.EDIT || mode === AppMode.TIME_TRAVEL;

  const animatedPlaceholder = useAnimatedPlaceholder(
    config.examples,
    config.placeholder,
    isReady,
    prompt
  );

  useEffect(() => {
    if (isCollapsible) {
      setIsOpen(isImageUploaded);
    } else {
      setIsOpen(true);
    }
  }, [isImageUploaded, isCollapsible]);

  const isDisabled = isLoading || !isReady || prompt.trim().length === 0;

  const handleSuggestionClick = (example: string) => {
    if (prompt.trim().length === 0) {
      onPromptChange(example);
    } else {
      const formattedExample = example.charAt(0).toLowerCase() + example.slice(1);
      const newPrompt = `${prompt} and ${formattedExample}`;
      onPromptChange(newPrompt);
    }
  };
  
  const toggleOpen = () => {
    if (isCollapsible && isImageUploaded) {
      setIsOpen(!isOpen);
    }
  };

  const textareaClasses = `w-full p-3 pr-10 bg-gray-700 rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed ${
    promptError
      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
  }`;

  const renderContent = () => (
    <div className="flex flex-col space-y-4">
      <div>
        <div className="relative w-full">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={animatedPlaceholder}
            rows={3}
            className={textareaClasses}
            disabled={!isReady}
            aria-label="Prompt input"
            aria-invalid={!!promptError}
            aria-describedby="prompt-error"
          />
          {prompt.length > 0 && isReady && (
            <button
              onClick={() => onPromptChange('')}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Clear prompt"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        {promptError && <p id="prompt-error" className="text-sm text-red-400 mt-1">{promptError}</p>}
      </div>

      {isReady && (
        <SuggestionChips
          examples={config.examples}
          onSuggestionClick={handleSuggestionClick}
          title={prompt.length === 0 ? 'Suggestions:' : 'Add to your prompt:'}
        />
      )}
      
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className="flex items-center justify-center w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed active:scale-95"
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
  );

  if (isCollapsible) {
    return (
      <div className={`bg-gray-800 rounded-lg shadow-inner overflow-hidden transition-opacity duration-300 ${!isImageUploaded ? 'opacity-50' : 'opacity-100'}`}>
        <div
          className={`flex justify-between items-center p-6 ${isImageUploaded ? 'cursor-pointer hover:bg-gray-700/50' : 'cursor-not-allowed'}`}
          onClick={toggleOpen}
          role="button"
          tabIndex={isImageUploaded ? 0 : -1}
          onKeyDown={(e) => isImageUploaded && (e.key === 'Enter' || e.key === ' ') && toggleOpen()}
          aria-expanded={isOpen}
          aria-controls="prompt-input-content"
        >
          <h2 className="text-lg font-semibold text-indigo-300 select-none">{config.title}</h2>
          <button
            className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
            aria-label={isOpen ? "Collapse prompt section" : "Expand prompt section"}
            disabled={!isImageUploaded}
          >
            {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>
        </div>
        <div
          id="prompt-input-content"
          className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-6 pb-6 pt-0">
            {isOpen && renderContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
      <h2 className="text-lg font-semibold mb-4 text-indigo-300">{config.title}</h2>
      {renderContent()}
    </div>
  );
};

export default PromptInput;