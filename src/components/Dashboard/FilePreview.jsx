import React, { useEffect } from "react";

const FilePreview = ({ file, onClose }) => {
  useEffect(() => {
    if (file && file.content) {
      // Create a blob depending on type
      let blob;
      if (file.type === "text") {
        blob = new Blob([file.content], { type: "text/plain" });
      } else if (file.type === "pdf") {
        blob = new Blob([file.content], { type: "application/pdf" });
      } else if (file.type === "image") {
        blob = new Blob([file.content], { type: "image/*" });
      } else {
        blob = new Blob([file.content]);
      }

      const blobUrl = URL.createObjectURL(blob);

      // Open in a new tab
      window.open(blobUrl, "_blank");

      // Cleanup blob when component unmounts
      return () => URL.revokeObjectURL(blobUrl);
    }
  }, [file]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <button
        onClick={onClose}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        Close
      </button>
      <p className="text-gray-600">File opened in a new tab: {file?.name}</p>
    </div>
  );
};

export default FilePreview;
