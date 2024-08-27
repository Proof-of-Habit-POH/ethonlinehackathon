import Button from "@mui/material/Button";
interface ButtonProperty {
  text?: string;
  variant?: string;
  onClick?: () => void;
  color?: string;
  size?: string;
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
