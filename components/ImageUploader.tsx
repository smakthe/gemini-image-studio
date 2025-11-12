
import React, { useCallback, useState } from 'react';
import { UploadedImage } from '../types';
import { fileToBase64 } from '../services/geminiService';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
  uploadedImage: UploadedImage | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const { base64, mimeType } = await fileToBase64(file);
        onImageUpload({ file, base64, mimeType });
      } else {
        alert('Please select an image file.');
      }
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
      <h2 className="text-lg font-semibold mb-4 text-indigo-300">1. Upload Your Image</h2>
      {uploadedImage ? (
        <div className="relative group">
          <img
            src={uploadedImage.base64}
            alt="Uploaded preview"
            className="w-full h-auto max-h-96 object-contain rounded-md"
          />
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
          >
            Click to change image
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-indigo-500 bg-gray-700' : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'}`}
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
            <p className="text-xs text-gray-500">PNG, JPG, GIF, or WEBP</p>
          </div>
        </label>
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
