"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import { usePathname, useRouter } from "next/navigation";
export default function BottomNav() {
  const [value, setValue] = React.useState(0);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname === "/") {
      setValue(0);
    } else if (pathname === "/create") {
      setValue(1);
    } else if (pathname === "/sponsorhabit") {
      setValue(2);
    }
  }, [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    console.log(newValue);
    setValue(newValue);
    switch (newValue) {
      case 0:
        router.push("/");
        break;
      case 1:
        router.push("/habit/create");
        break;
      case 2:
        router.push("/friends");
        break;
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction
          icon={
            <HomeIcon
              fontSize="large"
              color={value === 0 ? "primary" : "inherit"}
            />
          }
        />
        <BottomNavigationAction
          icon={
            <AddCircleOutlinedIcon
              fontSize="large"
              color={value === 1 ? "primary" : "inherit"}
            />
          }
        />
        <BottomNavigationAction
          icon={
            <GroupsIcon
              fontSize="large"
              color={value === 2 ? "primary" : "inherit"}
            />
          }
        />
      </BottomNavigation>
    </Box>
  );
}
