import React, { useRef } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  name: string;
  file?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
  required?: boolean;
  accept?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  file,
  onChange,
  error,
  required = false,
  accept = '.pdf,.jpg,.jpeg,.png',
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    onChange(selectedFile);
  };

  const handleRemoveFile = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {required && <span className="text-red-500 mr-1">*</span>}
        {label}
      </label>
      
      <div
        onClick={handleClick}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          error 
            ? 'border-red-300 bg-red-50' 
            : file 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-300 hover:border-cyan-400 hover:bg-cyan-50'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        {file ? (
          <div className="flex items-center justify-center space-x-3">
            <File size={24} className="text-green-600" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-green-800">{file.name}</p>
              <p className="text-xs text-green-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload size={32} className="mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Select File</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;