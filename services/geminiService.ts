
import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';
import { AppMode, UploadedImage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateImageWithImagen = async (prompt: string, negativePrompt?: string): Promise<string> => {
  try {
    // The `negativePrompt` should be at the top level of the request, not inside `config`.
    const requestPayload: {
      model: string;
      prompt: string;
      config: {
          numberOfImages: number;
          aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
      };
      negativePrompt?: string;
    } = {
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
      },
    };

    if (negativePrompt?.trim()) {
      requestPayload.negativePrompt = negativePrompt;
    }

    const response = await ai.models.generateImages(requestPayload);

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageData = response.generatedImages[0].image.imageBytes;
      const mimeType = response.generatedImages[0].image.mimeType || 'image/png';
      return `data:${mimeType};base64,${base64ImageData}`;
    } else {
      throw new Error('No image was generated in the response.');
    }
  } catch (error) {
    console.error("Error calling Imagen API:", error);
    throw new Error("The Imagen API failed to process the request. Please check your prompt and try again.");
  }
};

export const processImageWithGemini = async (
  image: UploadedImage,
  prompt: string,
  mode: AppMode,
): Promise<string> => {
  const model = ai.models;

  const imagePart = {
    inlineData: {
      data: image.base64,
      mimeType: image.mimeType,
    },
  };

  let fullPrompt = prompt;
  if (mode === AppMode.TIME_TRAVEL) {
    fullPrompt = `Take the person from this photo and realistically place them in the following scene: ${prompt}. Maintain their facial features but adapt their clothing and the background to match the scene.`;
  }
  
  const textPart = {
    text: fullPrompt,
  };

  try {
    const response: GenerateContentResponse = await model.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imageParts = response.candidates?.[0]?.content?.parts?.filter(
      (part) => part.inlineData && part.inlineData.mimeType.startsWith('image/')
    );

    if (imageParts && imageParts.length > 0 && imageParts[0].inlineData) {
      const base64ImageData = imageParts[0].inlineData.data;
      const mimeType = imageParts[0].inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageData}`;
    } else {
      throw new Error('No image was generated in the response.');
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The Gemini API failed to process the request. Please check your prompt and try again.");
  }
};
