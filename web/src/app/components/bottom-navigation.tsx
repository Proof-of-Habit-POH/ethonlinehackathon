"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// import { RestoreIcon } from "@mui/icons-material";
// import { FavoriteIcon } from "@mui/icons-material";
// import { LocationOnIcon } from "@mui/icons-material";

export default function BottomNav() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Recents" icon={":)"} />
        <BottomNavigationAction label="Favorites" icon={":)"} />
        <BottomNavigationAction label="Nearby" icon={":)"} />
      </BottomNavigation>
    </Box>
  );
}
