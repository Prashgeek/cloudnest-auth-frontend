import { useState } from "react";
import { UploadCloud } from "lucide-react"; 

export default function FileUpload({ onUpload }) {
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    onUpload(fileArray);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
        dragging
          ? "border-blue-500 bg-blue-50 dark:bg-neutral-900 scale-105"
          : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-neutral-900"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById("fileInput").click()}
    >
      <input
        id="fileInput"
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <UploadCloud className="w-12 h-12 text-blue-500" />
      <div>
        <p className="font-medium text-gray-800 dark:text-gray-200">
          Drag & Drop your files here
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          or <span className="text-blue-500 font-semibold">browse</span> to upload
        </p>
      </div>
    </div>
  );
}
