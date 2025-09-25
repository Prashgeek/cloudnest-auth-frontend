import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Trash2, RotateCcw, X } from "lucide-react";

export default function Trash() {
  const [trashItems, setTrashItems] = useState([]);
  const location = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  useEffect(() => {
    const loadTrash = () => {
      try {
        const storedTrash = JSON.parse(localStorage.getItem("trashItems")) || [];
        setTrashItems(storedTrash);
      } catch (error) {
        console.error("Error loading trash items:", error);
        setTrashItems([]);
      }
    };
  
    // Load initially
    loadTrash();
  
    // Listen for storage changes
    window.addEventListener("storage", loadTrash);
  
    return () => {
      window.removeEventListener("storage", loadTrash);
    };
  }, []);
  
  useEffect(() => {
    try {
      const storedTrash = JSON.parse(localStorage.getItem("trashItems")) || [];
      setTrashItems(storedTrash);
    } catch (error) {
      console.error("Error loading trash items on route change:", error);
    }
  }, [location]);  // re-run whenever route changes

  const restoreItem = (item) => {
    try {
      // Remove from trash
      const updatedTrash = trashItems.filter((t) => t.id !== item.id);
      setTrashItems(updatedTrash);
      localStorage.setItem("trashItems", JSON.stringify(updatedTrash));

      // Add back to downloads
      const downloads = JSON.parse(localStorage.getItem("downloads")) || [];
      const updatedDownloads = [...downloads, item];
      localStorage.setItem("downloads", JSON.stringify(updatedDownloads));
      
      // Notify other components that downloads have been updated
      window.dispatchEvent(new CustomEvent("downloadsUpdated"));
    } catch (error) {
      console.error("Error restoring item:", error);
    }
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeletingAll(false);
    setShowDeleteModal(true);
  };

  const openEmptyTrashModal = () => {
    setItemToDelete(null);
    setIsDeletingAll(true);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    try {
      if (isDeletingAll) {
        // Empty trash
        setTrashItems([]);
        localStorage.setItem("trashItems", JSON.stringify([]));
      } else {
        // Delete single item
        const updatedTrash = trashItems.filter((t) => t.id !== itemToDelete.id);
        setTrashItems(updatedTrash);
        localStorage.setItem("trashItems", JSON.stringify(updatedTrash));
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting item permanently:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Trash</h1>
        <p className="text-gray-600 mb-6">Items in trash will be permanently deleted after 30 days</p>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <Trash2 className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-gray-700">
              {trashItems.length} {trashItems.length === 1 ? "item" : "items"} in trash
            </span>
          </div>
          <button
            onClick={openEmptyTrashModal}
            disabled={trashItems.length === 0}
            className={`px-4 py-2 rounded flex items-center ${trashItems.length === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Empty Trash
          </button>
        </div>

        {trashItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Trash is empty</h3>
            <p className="text-gray-500">Items you delete will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trashItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.deletedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => restoreItem(item)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        <RotateCcw className="w-4 h-4 inline mr-1" />
                        Restore
                      </button>
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isDeletingAll ? "Empty Trash?" : "Delete Permanently?"}
                </h3>
                <p className="text-gray-600">
                  {isDeletingAll 
                    ? "All items in the trash will be permanently deleted. This action cannot be undone."
                    : `This item will be permanently deleted. This action cannot be undone.`}
                </p>
              </div>
            </div>
            
            {!isDeletingAll && itemToDelete && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{itemToDelete.name}</p>
                    <p className="text-xs text-gray-500">{itemToDelete.size}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {isDeletingAll ? "Empty Trash" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}