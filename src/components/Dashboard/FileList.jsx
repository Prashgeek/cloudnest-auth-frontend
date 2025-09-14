import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { FaFileWord, FaFilePdf } from "react-icons/fa";
import { Download, Share2 } from "lucide-react";

export default function FileList({ files = [] }) {
  // Helper to decide icon based on file extension
  const getFileIcon = (fileName) => {
    if (fileName.toLowerCase().endsWith(".pdf")) {
      return <FaFilePdf className="text-red-500 text-2xl" />;
    } else if (
      fileName.toLowerCase().endsWith(".doc") ||
      fileName.toLowerCase().endsWith(".docx")
    ) {
      return <FaFileWord className="text-blue-500 text-2xl" />;
    }
    return <FaFileWord className="text-gray-500 text-2xl" />; // fallback
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-[90%] max-w-7xl mt-6 mx-auto">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Files</h2>

      <List>
        {files.map((file, index) => (
          <React.Fragment key={index}>
            <ListItem
              className="flex items-center"
              disableGutters
            >
              {/* File icon and details (takes all available space) */}
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(file.name)}
                <ListItemText
                  primary={file.name}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {file.size} • {file.date}
                    </Typography>
                  }
                />
              </div>

              {/* Action icons (stick to right) */}
              <div className="flex gap-4 text-gray-600">
                <Download className="w-5 h-5 cursor-pointer hover:text-green-600" />
                <Share2 className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </div>
            </ListItem>

            {index < files.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}
