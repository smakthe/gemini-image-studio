
import { useState, useCallback } from 'react';
import { AppMode, UploadedImage } from '../types';
import { processImageWithGemini, generateImageWithImagen } from '../services/geminiService';

export const useGeminiStudio = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

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
    setPromptError(null);
    setIsLoading(false);
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (promptError) {
      setPromptError(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) {
      setPromptError('Please enter a prompt.');
      return;
    }
    if (mode !== AppMode.GENERATE && !uploadedImage) {
      setError('Please upload an image before submitting.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPromptError(null);
    setResultImage(null);

    try {
      let generatedImage: string;
      if (mode === AppMode.GENERATE) {
        generatedImage = await generateImageWithImagen(prompt, negativePrompt);
      } else {
        if (!uploadedImage) {
          throw new Error("Cannot process image without an uploaded image for type safety.");
        }
        generatedImage = await processImageWithGemini(uploadedImage, prompt, mode);
      }
      setResultImage(generatedImage);
    } catch (e: unknown) {
      let errorMessage = 'An unknown error occurred. Please try again.';
      if (e instanceof Error) {
        if (e.message.includes('prompt was blocked')) {
          errorMessage = 'Your prompt may have violated safety policies. Please adjust your prompt and try again.';
        } else if (e.message.includes('No image was generated')) {
          errorMessage = 'The model could not generate an image from your prompt. Please try a different prompt.';
        } else {
          errorMessage = e.message;
        }
      }
      setError(`Failed to generate image. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, uploadedImage, mode]);

  return {
    mode,
    uploadedImage,
    prompt,
    handlePromptChange,
    negativePrompt,
    setNegativePrompt,
    resultImage,
    isLoading,
    error,
    promptError,
    handleImageUpload,
    handleModeChange,
    handleSubmit,
  };
};
