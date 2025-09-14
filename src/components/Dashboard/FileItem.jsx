import React from "react";

export default function FileItem({ file }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
      <div>
        <p className="font-medium">{file.name}</p>
        <p className="text-sm text-gray-500">
          Size: {file.size} • Downloaded: {file.date}
        </p>
      </div>
      <div className="flex gap-3">
        <button className="text-blue-600 hover:text-blue-800">⬇️</button>
        <button className="text-green-600 hover:text-green-800">🔗</button>
      </div>
    </div>
  );
}
