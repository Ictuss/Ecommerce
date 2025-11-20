import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Importe o index.css aqui
import App from "./App.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
