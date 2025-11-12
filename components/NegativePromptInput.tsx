import React, { useState } from 'react';
import NEGATIVE_PROMPT_EXAMPLES from '../NEGATIVE_PROMPT_EXAMPLES';
import { ChevronDownIcon, ChevronUpIcon } from './IconComponents';
import SuggestionChips from './SuggestionChips';

interface NegativePromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
}

const NegativePromptInput: React.FC<NegativePromptInputProps> = ({ prompt, onPromptChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuggestionClick = (example: string) => {
    const lowerExample = example.toLowerCase();
    const currentPrompts = prompt.toLowerCase().split(', ').filter(p => p.trim() !== '');
    if (currentPrompts.includes(lowerExample)) {
      return;
    }
    const newPrompt = prompt ? `${prompt}, ${lowerExample}` : example;
    onPromptChange(newPrompt);
  };

  const toggleOpen = () => setIsOpen(!isOpen);
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-inner overflow-hidden">
      <div 
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-700/50 transition-colors"
        onClick={toggleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleOpen()}
        aria-expanded={isOpen}
        aria-controls="negative-prompt-content"
      >
        <h2 className="text-lg font-semibold text-indigo-300 select-none">2. Mention negative prompts (optional)</h2>
        <button 
          className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={isOpen ? "Collapse negative prompts section" : "Expand negative prompts section"}
        >
          {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
      </div>

      <div
        id="negative-prompt-content"
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-6 pt-0 flex flex-col space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="e.g., 'blurry, grainy, text, watermark'"
            rows={2}
            className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            aria-label="Negative prompt input"
            tabIndex={isOpen ? 0 : -1}
          />
          
          <SuggestionChips
            examples={NEGATIVE_PROMPT_EXAMPLES}
            onSuggestionClick={handleSuggestionClick}
            title="Suggestions:"
            visibleCount={5}
          />
        </div>
      </div>
    </div>
  );
};

export default NegativePromptInput;
