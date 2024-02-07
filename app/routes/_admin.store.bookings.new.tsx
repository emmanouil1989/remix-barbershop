import React, { useState } from "react";
import { useNavigate } from "@remix-run/react";
import Dialog, { DialogFooter, DialogHeader } from "~/components/Dialog";
import Button from "~/components/button/Button";

export default function NewBooking() {
  const navigate = useNavigate();
  let [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
    navigate(-1);
  };
  console.log("here");

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen}>
      <DialogHeader title="New Booking" />
      <div>
        <p>Content</p>
      </div>
      <DialogFooter>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogFooter>
    </Dialog>
  );
}
