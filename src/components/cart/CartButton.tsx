import React from "react";
import { useCart } from "../../contexts/CartContext";
import "./CartButton.css";

const CartButton: React.FC = () => {
  const { totalQuantity, toggleCart } = useCart();

  return (
    <button type="button" className="cart-button" onClick={toggleCart}>
      <span className="cart-button__icon">🛒</span>
      {totalQuantity > 0 && (
        <span className="cart-button__badge">{totalQuantity}</span>
      )}
    </button>
  );
};

export default CartButton;
