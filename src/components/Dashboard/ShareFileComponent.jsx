import React, { useState, useRef, useCallback } from 'react';
import { DragDropIcon, PasswordIcon, ShareIcon, UploadIcon } from "../CustomIcons";

// Password validation utility
const validatePassword = (password) => {
  const checks = {
    minLength: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password)
  };

  return {
    ...checks,
    isValid: checks.minLength && checks.hasNumber && checks.hasSymbol && 
             checks.hasLowerCase && checks.hasUpperCase
  };
};

export default function ShareFileComponent({ onFileUploaded }) {
  const fileInputRef = useRef(null);

  // ==== State management ====
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // ==== File selection (manual + drag/drop) ====
  const handleFileSelect = useCallback((files) => {
    const fileArray = Array.from(files);
    // Filter out duplicates based on file name and size
    const newFiles = fileArray.filter(newFile => 
      !selectedFiles.some(existingFile => 
        existingFile.name === newFile.name && existingFile.size === newFile.size
      )
    );
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, [selectedFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragOver to false if we're leaving the drop zone completely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
    e.target.value = '';
  };

  // ==== Password Management ====
  const handlePasswordSave = async () => {
    const passwordValidation = validatePassword(password);
    const passwordsMatch = password === confirmPassword && password.length > 0;

    if (!passwordValidation.isValid || !passwordsMatch) {
      return;
    }

    setIsPasswordSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setHasPassword(!!password);
    setIsPasswordSaving(false);
    setShowPasswordModal(false);
  };

  const handlePasswordRemove = () => {
    setPassword('');
    setConfirmPassword('');
    setHasPassword(false);
  };

  const handlePasswordKeyDown = (e) => {
    const passwordValidation = validatePassword(password);
    const passwordsMatch = password === confirmPassword && password.length > 0;
    const canSubmit = passwordValidation.isValid && passwordsMatch && !isPasswordSaving;

    if (e.key === 'Enter' && canSubmit) {
      handlePasswordSave();
    } else if (e.key === 'Escape') {
      setShowPasswordModal(false);
    }
  };

  // ==== Simulate Upload Process ====
  const simulateUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // Mock generated share link
    const mockShareUrl = `https://cloudnest.com/share/${Date.now()}${hasPassword ? '?protected=true' : ''}`;
    setShareUrl(mockShareUrl);
    setUploadStatus('success');

    // Notify parent component
    selectedFiles.forEach(file => {
      const uploadedFile = {
        name: file.name,
        size: formatFileSize(file.size),
        date: new Date().toISOString().split('T')[0],
        type: "shared",
        shareUrl: mockShareUrl,
        hasPassword: hasPassword,
        password: hasPassword ? password : null
      };
      onFileUploaded && onFileUploaded(uploadedFile);
    });

    // Reset state after a delay
    setTimeout(() => {
      setSelectedFiles([]);
      setUploadStatus('idle');
      setUploadProgress(0);
      setShareUrl('');
      setPassword('');
      setConfirmPassword('');
      setHasPassword(false);
    }, 3000);
  };

  // Helper: Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if actions should be enabled
  const hasFiles = selectedFiles.length > 0;
  const canSetPassword = hasFiles;
  const canShare = hasFiles && uploadStatus !== 'uploading';
  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSavePassword = passwordValidation.isValid && passwordsMatch && !isPasswordSaving;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* ==== Header (Title + top icon) ==== */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <UploadIcon className="w-12 h-12 text-blue-500 mb-[5px]" />
            <h1 className="text-3xl font-bold text-gray-900">File Upload</h1>
          </div>
        </div>

        {/* ==== Upload Progress bar ==== */}
        {uploadStatus === 'uploading' && (
          <div className="mb-6 card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">Uploading files... {uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* ==== Success message after upload ==== */}
        {uploadStatus === 'success' && (
          <div className="mb-6 card p-6 border-green-200 bg-green-50">
            <div className="flex items-center gap-3 mb-4">
              <ShareIcon className="w-6 h-6 text-green-600" />
              <span className="font-medium text-green-800">
                Upload successful! Files added to recent files.
                {hasPassword && (
                  <span className="ml-2 text-yellow-600">🔒 Password Protected</span>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm break-all flex-1">
                {shareUrl}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* ==== Drag & Drop Area (FIXED - keeping original colors) ==== */}
        <div className="text-center mb-12">
          <div
            className={`rounded-[2rem] transition-all duration-300 cursor-pointer ${
              isDragOver 
                ? 'bg-blue-50 scale-[1.02]' 
                : 'bg-gray-50 hover:bg-blue-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              height: '340px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="mb-8 transition-all duration-300">
              <DragDropIcon
                className={`transition-all duration-300 ${
                  isDragOver ? 'text-blue-600 scale-110' : 'text-blue-500'
                }`}
                style={{ width: '13.5rem', height: '13.5rem' }}
              />
            </div>

            <h2 className={`text-xl font-semibold mb-2 ${
              isDragOver ? 'text-blue-700' : 'text-gray-800'
            }`}>
              {isDragOver 
                ? 'Drop files here' 
                : hasFiles 
                ? `${selectedFiles.length} files selected` 
                : 'Drag and Drop file'
              }
            </h2>

            {hasFiles && !isDragOver && (
              <p className="text-gray-500 text-sm">
                Click to add more files or use the buttons below
              </p>
            )}
          </div>
        </div>

        {/* ==== Main Action Buttons ==== */}
        <div className="flex justify-center items-center gap-40 mb-12">
          {/* Upload File button */}
          <div className="text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadStatus === 'uploading'}
              className="w-24 h-24 bg-blue-500 hover:bg-blue-600 rounded-[1.2rem] flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
            >
              <UploadIcon className="w-14 h-14 text-white" />
            </button>
            <span className="block mt-4 font-semibold text-gray-800 text-base">Upload File</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept="*/*"
            />
          </div>

          {/* Set Password button */}
          <div className="text-center">
            <button
              onClick={() => setShowPasswordModal(true)}
              disabled={!canSetPassword || uploadStatus === 'uploading'}
              className={`w-24 h-24 rounded-[1.2rem] flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                canSetPassword && uploadStatus !== 'uploading'
                  ? hasPassword
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <PasswordIcon className="w-14 h-14 text-white" />
            </button>
            <span className="block mt-4 font-semibold text-gray-800 text-base">
              {hasPassword ? 'Password Set ✓' : 'Set Password'}
            </span>
          </div>

          {/* Share button */}
          <div className="text-center">
            <button
              onClick={simulateUpload}
              disabled={!canShare}
              className={`w-24 h-24 rounded-[1.2rem] flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                canShare
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {uploadStatus === 'uploading' ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShareIcon className="w-14 h-14 text-white" />
              )}
            </button>
            <span className="block mt-4 font-semibold text-gray-800 text-base">
              {uploadStatus === 'uploading' ? 'Sharing...' : 'Share'}
            </span>
          </div>
        </div>

        {/* Password Status Info */}
        {hasPassword && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <span className="mr-2">🔒</span>
              <span className="text-sm">Files will be password protected</span>
              <button
                onClick={handlePasswordRemove}
                className="ml-3 text-red-600 hover:text-red-800 text-sm underline"
              >
                Remove Password
              </button>
            </div>
          </div>
        )}

        {/* ==== Selected Files List ==== */}
        {selectedFiles.length > 0 && (
          <div className="card p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">
              Selected Files ({selectedFiles.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      📄
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==== Enhanced Password Modal (matching your screenshot) ==== */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              {/* Modal Header */}
              <div className="flex items-center justify-center pt-8 pb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
                Set Password
              </h2>

              <p className="text-gray-600 text-center mb-8 px-6">
                Create a new Password to Secure your file
              </p>

              <div className="px-6 pb-6">
                {/* New Password Input */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handlePasswordKeyDown}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      disabled={isPasswordSaving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isPasswordSaving}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.586 6.586m3.292 3.292l4.242 4.242m0 0l3.292 3.292M15.121 15.121L21.414 21.414" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={handlePasswordKeyDown}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      disabled={isPasswordSaving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isPasswordSaving}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showConfirmPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.586 6.586m3.292 3.292l4.242 4.242m0 0l3.292 3.292M15.121 15.121L21.414 21.414" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Tips to set a Strong Password:</p>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                        passwordValidation.minLength ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {passwordValidation.minLength && (
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}>
                        Must be atleast 6 characters
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                        passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {passwordValidation.hasNumber && (
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                        Must contain a number
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                        passwordValidation.hasSymbol ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {passwordValidation.hasSymbol && (
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={passwordValidation.hasSymbol ? 'text-green-600' : 'text-gray-500'}>
                        Must contain a symbol
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                        passwordValidation.hasLowerCase && passwordValidation.hasUpperCase ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {(passwordValidation.hasLowerCase && passwordValidation.hasUpperCase) && (
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={passwordValidation.hasLowerCase && passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                        Must contain Lower case & upper case character
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword.length > 0 && (
                  <div className={`mb-4 p-2 rounded-lg text-sm ${
                    passwordsMatch ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {passwordsMatch ? 'Passwords match ✓' : 'Passwords do not match'}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handlePasswordSave}
                  disabled={!canSavePassword}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    canSavePassword
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isPasswordSaving ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Setting Password...
                    </div>
                  ) : (
                    'Set Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 