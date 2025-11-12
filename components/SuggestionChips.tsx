import React, { useState, useEffect } from 'react';

interface SuggestionChipsProps {
  examples: string[];
  onSuggestionClick: (example: string) => void;
  title: string;
  visibleCount?: number;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  examples,
  onSuggestionClick,
  title,
  visibleCount = 5,
}) => {
  const [displayExamples, setDisplayExamples] = useState<string[]>([]);

  useEffect(() => {
    if (examples.length > 0) {
      const shuffled = [...examples].sort(() => 0.5 - Math.random());
      setDisplayExamples(shuffled.slice(0, visibleCount));
    }
  }, [examples, visibleCount]);

  return (
    <div className="pt-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {displayExamples.map((example) => (
          <button
            key={example}
            onClick={() => onSuggestionClick(example)}
            className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionChips;
