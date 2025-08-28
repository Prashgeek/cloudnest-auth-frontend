import React from "react";

const Trash = ({ trash, setTrash }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Trash</h2>
      {trash.length === 0 ? (
        <p className="text-gray-500">No items in trash</p>
      ) : (
        <ul>
          {trash.map((item, i) => (
            <li key={i} className="p-2 bg-gray-100 rounded mb-2">{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Trash;
