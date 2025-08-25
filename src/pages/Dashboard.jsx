import { useState } from "react";
import FileUpload from "../components/FileUpload";

export default function Dashboard() {
  const [files, setFiles] = useState([]);

  const handleUpload = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDelete = (fileName) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    window.location.href = "/auth"; 
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white dark:bg-neutral-900 shadow-md">
        <h1 className="text-xl font-bold">CloudNest Drive</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <FileUpload onUpload={handleUpload} />

        {/* File List */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
          {files.length === 0 ? (
            <p className="text-gray-500">No files uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-white dark:bg-neutral-800 rounded-lg shadow"
                >
                  <span>{file.name}</span>
                  <div className="flex space-x-3">
                    <a
                      href={URL.createObjectURL(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
