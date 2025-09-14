import React from "react";
import { Box, Typography } from "@mui/material";
import pandaImg from '../../assets/cloudnest_banner.png'

export default function Banner() {
  return (
    <Box
      sx={{
        backgroundColor: "#dbeafe", // baby blue
        p: 3, // padding (equivalent to p-6)
        borderRadius: 2, // rounded-lg
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight="600">
          Hi, Saniya
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your secure cloud awaits you.
        </Typography>
      </Box>

      {/* ✅ Image instead of emoji */}
      <Box
        component="img"
        src={pandaImg}
        alt="Panda"
        sx={{ width: 304, height: 204, objectFit: "contain" }}
      />
    </Box>
  );
}
