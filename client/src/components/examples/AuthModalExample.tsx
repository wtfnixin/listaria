import { useState } from "react";
import AuthModal from "../AuthModal";
import { Button } from "@/components/ui/button";
import { AuthProvider } from "@/context/AuthContext";

function AuthModalDemo() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Auth Modal</Button>
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultTab="login"
      />
    </>
  );
}

export default function AuthModalExample() {
  return (
    <AuthProvider>
      <AuthModalDemo />
    </AuthProvider>
  );
}
