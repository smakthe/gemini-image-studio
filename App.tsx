
import React, { useState, useCallback } from 'react';
import { AppMode, UploadedImage } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptInput from './components/PromptInput';
import ResultDisplay from './components/ResultDisplay';
import { processImageWithGemini, generateImageWithImagen } from './services/geminiService';
import NegativePromptInput from './components/NegativePromptInput';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setResultImage(null);
    setError(null);
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setUploadedImage(null);
    setPrompt('');
    setNegativePrompt('');
    setResultImage(null);
    setError(null);
    setIsLoading(false);
  };

  const handleSubmit = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    if (mode !== AppMode.GENERATE && !uploadedImage) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      let generatedImage: string;
      if (mode === AppMode.GENERATE) {
        generatedImage = await generateImageWithImagen(prompt, negativePrompt);
      } else {
        generatedImage = await processImageWithGemini(uploadedImage!, prompt, mode);
      }
      setResultImage(generatedImage);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate image. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, uploadedImage, mode]);

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
              onPromptChange={setPrompt}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isImageUploaded={!!uploadedImage}
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
