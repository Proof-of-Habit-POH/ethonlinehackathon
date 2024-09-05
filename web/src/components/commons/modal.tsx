"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import BasicButton from "@/components/commons/button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AppModal({
  children,
  header,
}: {
  children: React.ReactNode;
  header: string;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <BasicButton text="Verify" color="secondary" onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between">
            <button className="hidden">&#10005;</button>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {header}
            </Typography>
            <button onClick={handleClose}>&#10005; </button>
          </div>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {children}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
