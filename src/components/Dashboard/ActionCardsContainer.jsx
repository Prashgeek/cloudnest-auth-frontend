import React from "react";
import { Send } from "@mui/icons-material";
import FileCopyIcon from '@mui/icons-material/FileCopy';

export function ActionCard({ text, Icon, className, rotate, onClick }) {
  return (
    <div
      className={`w-80 h-40 bg-blue-100 hover:bg-blue-200 cursor-pointer rounded-lg shadow-md flex flex-col items-center justify-center gap-3 text-center font-medium ${className}`}
      onClick={onClick}
    >
      <Icon 
        fontSize="large" 
        className={`!text-6xl text-white ${rotate ? rotate : ""} transform`}
        style={{ color: 'white', fontSize: '4rem' }}
      />
      <div className="bg-white px-4 py-2 rounded-full shadow-sm">
        <span className="text-base font-semibold text-black">{text}</span>
      </div>
    </div>
  );
}

export default function ActionCardsContainer({ onReceiveFile, onSendFile, onShareFile }) {
  return (
    <div className="flex justify-center items-center gap-8">
      <ActionCard 
        text="Share" 
        Icon={Send} 
        rotate="-rotate-[25deg]" 
        onClick={onShareFile}
      />
      <ActionCard 
        text="Receive" 
        Icon={FileCopyIcon} 
        onClick={onReceiveFile}
      />
    </div>
  );
}