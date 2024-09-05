import Button from "@mui/material/Button";
import { ButtonProps } from "@mui/material";

interface ButtonProperty {
  text?: string;
  variant?: ButtonProps["variant"];
  onClick?: () => void;
  color?: ButtonProps["color"];
  size?: ButtonProps["size"];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export default function BasicButton({
  text = "click",
  variant = "contained",
  onClick,
  color = "primary",
  size = "medium",
  startIcon = null,
  endIcon = null,
}: ButtonProperty) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      color={color}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {text}
    </Button>
  );
}
