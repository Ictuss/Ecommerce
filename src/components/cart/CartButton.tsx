import React from "react";
import { useCart } from "../../contexts/CartContext";
import "./CartButton.css";

interface CartButtonProps {
  showLabel?: boolean;
}

const CartButton: React.FC<CartButtonProps> = ({ showLabel = false }) => {
  const { totalQuantity, toggleCart } = useCart();

  return (
    <button
      type="button"
      className={`cart-button ${showLabel ? "cart-button--with-label" : ""}`}
      onClick={toggleCart}
    >
      {showLabel && <span className="cart-button__label">Carrinho</span>}
      <span className="cart-button__icon">🛒</span>
      {totalQuantity > 0 && (
        <span className="cart-button__badge">{totalQuantity}</span>
      )}
    </button>
  );
};

export default CartButton;
