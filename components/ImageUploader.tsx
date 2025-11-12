
import React, { useCallback, useState } from 'react';
import { UploadedImage } from '../types';
import { fileToBase64 } from '../services/geminiService';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
  uploadedImage: UploadedImage | null;
}

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    setUploadError(null);
    if (files && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image/')) {
        setUploadError('Invalid file type. Please upload an image.');
        return;
      }
      
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      const { base64, mimeType } = await fileToBase64(file);
      onImageUpload({ file, base64, mimeType });
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadError(null);
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const getDropzoneClasses = () => {
    const baseClasses = 'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors';
    if (uploadError) {
      return `${baseClasses} border-red-500 bg-red-900/20 animate-shake`;
    }
    if (isDragging) {
      return `${baseClasses} border-indigo-500 bg-gray-700`;
    }
    return `${baseClasses} border-gray-600 bg-gray-700/50 hover:bg-gray-700 animate-pulse-border`;
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
      <h2 className="text-lg font-semibold mb-4 text-indigo-300">1. Upload Your Image</h2>
      {uploadedImage ? (
        <div className="relative group">
          <img
            src={`data:${uploadedImage.mimeType};base64,${uploadedImage.base64}`}
            alt="Uploaded preview"
            className="w-full h-auto max-h-96 object-contain rounded-md"
          />
          <button
            onClick={() => {
              setUploadError(null);
              (document.getElementById('file-upload') as HTMLInputElement).value = '';
              document.getElementById('file-upload')?.click();
            }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
          >
            Click to change image
          </button>
        </div>
      ) : (
        <>
          <label
            htmlFor="file-upload"
            className={getDropzoneClasses()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF, or WEBP (Max 4MB)</p>
            </div>
          </label>
          {uploadError && (
              <p className="text-center text-sm text-red-400 mt-2">{uploadError}</p>
          )}
        </>
      )}
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
      />
    </div>
  );
};

export default ImageUploader;
