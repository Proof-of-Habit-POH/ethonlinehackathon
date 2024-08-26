"use client";
import * as React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
interface ChipProperties {
  label?: string;
  color?: string;
  size?: string;
  variant?: "outlined" | "filled";
  onClick?: () => void;
}

export default function ChipBar({
  label = "Clicable",
  color = "primary",
  size = "small",
  variant = "filled",
  onClick = () => {},
}: ChipProperties) {
  return (
    <Chip
      color={color}
      size="small"
      label={label}
      variant={variant}
      onClick={onClick}
    />
  );
}
