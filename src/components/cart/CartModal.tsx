import React from "react";
import { useCart } from "../../contexts/CartContext";
import "./CartModal.css";

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const CartModal: React.FC = () => {
  const {
    items,
    totalQuantity,
    totalPrice,
    isOpen,
    closeCart,
    removeFromCart,
    decreaseItem,
    addToCart,
    clearCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-modal__backdrop" onClick={closeCart}>
      <div
        className="cart-modal"
        onClick={(e) => e.stopPropagation()} // não fechar ao clicar dentro
      >
        <header className="cart-modal__header">
          <h2>Carrinho ({totalQuantity})</h2>
          <button
            type="button"
            className="cart-modal__close-button"
            onClick={closeCart}
          >
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <p className="cart-modal__empty">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="cart-modal__list">
              {items.map((item) => (
                <li key={item.id} className="cart-modal__item">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-modal__item-image"
                    />
                  )}

                  <div className="cart-modal__item-info">
                    <p className="cart-modal__item-name">{item.name}</p>
                    <p className="cart-modal__item-price">
                      {formatBRL(item.price)}
                    </p>

                    <div className="cart-modal__item-actions">
                      <button
                        type="button"
                        onClick={() => decreaseItem(item.id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            slug: item.slug,
                          })
                        }
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="cart-modal__remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="cart-modal__footer">
              <div className="cart-modal__total">
                <span>Total</span>
                <strong>{formatBRL(totalPrice)}</strong>
              </div>

              <div className="cart-modal__footer-actions">
                <button
                  type="button"
                  className="cart-modal__clear"
                  onClick={clearCart}
                >
                  Limpar carrinho
                </button>
                <button
                  type="button"
                  className="cart-modal__checkout"
                  onClick={() =>
                    console.log("TODO: redirecionar para checkout / WhatsApp")
                  }
                >
                  Finalizar compra
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
