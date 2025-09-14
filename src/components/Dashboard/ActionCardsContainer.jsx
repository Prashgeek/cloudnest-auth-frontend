import React from "react";
import { Send } from "@mui/icons-material";
import FileCopyIcon from '@mui/icons-material/FileCopy';

export function ActionCard({ text, Icon, className, rotate }) {
  return (
    <div
      className={`w-80 h-40 bg-blue-100 hover:bg-blue-200 cursor-pointer rounded-lg shadow-md flex flex-col items-center justify-center gap-3 text-center font-medium ${className}`}
    >
      <Icon fontSize="large" className={`!text-4xl ${rotate ? rotate : ""} transform`} />
      <span className="text-lg">{text}</span>
    </div>
  );
}

export default function ActionCardsContainer() {
  return (
    <div className="flex justify-center items-center gap-8">
      <ActionCard text="Share" Icon={Send} rotate="-rotate-[25deg]" />
      <ActionCard text="Receive" Icon={FileCopyIcon} />
    </div>
  );
}
