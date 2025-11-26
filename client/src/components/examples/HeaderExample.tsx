import { useState } from "react";
import Header from "../Header";

export default function HeaderExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <Header
      isLoggedIn={isLoggedIn}
      userName="NITIN KUMAR"
      onLogin={() => {
        console.log("Login clicked");
        setIsLoggedIn(true);
      }}
      onRegister={() => console.log("Register clicked")}
      onLogout={() => {
        console.log("Logout clicked");
        setIsLoggedIn(false);
      }}
      onSell={() => console.log("Sell clicked")}
      onSearch={(query, category) => console.log("Search:", query, category)}
      onLocationClick={() => console.log("Location clicked")}
    />
  );
}
