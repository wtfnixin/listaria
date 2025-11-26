import { useState } from "react";
import SellModal from "../SellModal";
import { Button } from "@/components/ui/button";

export default function SellModalExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Sell Modal</Button>
      <SellModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) => console.log("Form submitted:", data)}
      />
    </>
  );
}
