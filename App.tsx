
import React from 'react';
import { AppMode } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptInput from './components/PromptInput';
import ResultDisplay from './components/ResultDisplay';
import NegativePromptInput from './components/NegativePromptInput';
import { useGeminiStudio } from './hooks/useGeminiStudio';

const App: React.FC = () => {
  const {
    mode,
    uploadedImage,
    prompt,
    negativePrompt,
    setNegativePrompt,
    resultImage,
    isLoading,
    error,
    promptError,
    handleImageUpload,
    handleModeChange,
    handleSubmit,
    handlePromptChange,
  } = useGeminiStudio();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header currentMode={mode} onModeChange={handleModeChange} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            {mode !== AppMode.GENERATE && (
              <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
            )}
            <PromptInput
              mode={mode}
              prompt={prompt}
              onPromptChange={handlePromptChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isImageUploaded={!!uploadedImage}
              promptError={promptError}
            />
            {mode === AppMode.GENERATE && (
              <NegativePromptInput
                prompt={negativePrompt}
                onPromptChange={setNegativePrompt}
              />
            )}
          </div>
          <div className="flex flex-col">
            <ResultDisplay
              isLoading={isLoading}
              error={error}
              resultImage={resultImage}
              originalImage={uploadedImage?.base64}
            />
          </div>
        </div>
        <footer className="text-center text-gray-500 mt-12 text-sm">
          <p>Powered by Gemini. Create, edit, and reimagine your photos.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
