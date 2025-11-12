
import React from 'react';
import { AppMode } from '../types';
import { EditIcon, TimeTravelIcon, GenerateIcon } from './IconComponents';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange }) => {
  const getButtonClasses = (mode: AppMode) =>
    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
      currentMode === mode
        ? 'bg-indigo-600 text-white shadow-md'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Gemini Image Studio
          </h1>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => onModeChange(AppMode.GENERATE)}
              className={getButtonClasses(AppMode.GENERATE)}
            >
              <GenerateIcon className="w-5 h-5" />
              <span className="hidden md:inline">Generate</span>
            </button>
            <button
              onClick={() => onModeChange(AppMode.EDIT)}
              className={getButtonClasses(AppMode.EDIT)}
            >
              <EditIcon className="w-5 h-5" />
              <span className="hidden md:inline">Image Editor</span>
            </button>
            <button
              onClick={() => onModeChange(AppMode.TIME_TRAVEL)}
              className={getButtonClasses(AppMode.TIME_TRAVEL)}
            >
              <TimeTravelIcon className="w-5 h-5" />
              <span className="hidden md:inline">Time-Travel Booth</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
