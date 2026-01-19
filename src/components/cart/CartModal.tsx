import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import "./CartModal.css";
import littmannImg from "../../assets/1.png";

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

// Função para formatar preço ou mostrar "Consultar"
const formatPrice = (price: number | null | undefined): string => {
  if (price == null || price === 0 || isNaN(price)) {
    return "Consultar";
  }
  return formatBRL(price);
};

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

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Verifica se há produtos sem preço no carrinho
  const hasProductsWithoutPrice = items.some(
    (item) => item.price == null || item.price === 0 || isNaN(item.price),
  );

  const handleSendToWhatsApp = (paymentMethod: string) => {
    const businessWhatsApp = "554291383593";

    let message = `🛒 *NOVO PEDIDO - ICTUS*\n\n`;
    message += `📦 *PRODUTOS:*\n`;
    message += `━━━━━━━━━━━━━━━\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Qtd: ${item.quantity}x\n`;

      // Se não tem preço, mostra "A consultar"
      if (item.price == null || item.price === 0 || isNaN(item.price)) {
        message += `   Valor: *A CONSULTAR*\n\n`;
      } else {
        message += `   Valor unitário: ${formatBRL(item.price)}\n`;
        message += `   Subtotal: ${formatBRL(item.price * item.quantity)}\n\n`;
      }
    });

    message += `━━━━━━━━━━━━━━━\n`;

    // Se tem produtos sem preço, mostra mensagem diferente
    if (hasProductsWithoutPrice) {
      message += `💰 *VALOR TOTAL: A CONSULTAR*\n`;
      message += `   _(Alguns produtos precisam de orçamento)_\n\n`;
    } else {
      message += `💰 *VALOR TOTAL: ${formatBRL(totalPrice)}*\n\n`;
    }

    const paymentText =
      {
        pix: "PIX",
        card: "Cartão de Crédito/Débito",
        boleto: "Boleto Bancário",
        money: "Dinheiro",
      }[paymentMethod] || "A combinar";

    message += `💳 *Forma de Pagamento Preferencial:* ${paymentText}\n\n`;
    message += `✅ Aguardo confirmação do pedido!\n`;
    message += `Obrigado pela preferência! 😊`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${businessWhatsApp}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");

    setShowPaymentOptions(false);
    closeCart();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal__backdrop" onClick={closeCart}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
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
                  <img
                    src={item.image || littmannImg}
                    alt={item.name}
                    className="cart-modal__item-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = littmannImg;
                    }}
                  />

                  <div className="cart-modal__item-info">
                    <p className="cart-modal__item-name">{item.name}</p>
                    <p className="cart-modal__item-price">
                      {formatPrice(item.price)}
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
                <strong>
                  {hasProductsWithoutPrice
                    ? "A consultar"
                    : formatBRL(totalPrice)}
                </strong>
              </div>

              {/* Aviso se houver produtos sem preço */}
              {hasProductsWithoutPrice && (
                <p className="cart-modal__warning">
                  ⚠️ Alguns produtos precisam de orçamento
                </p>
              )}

              {showPaymentOptions ? (
                <div className="cart-modal__payment-options">
                  <p className="cart-modal__payment-title">
                    Escolha a forma de pagamento:
                  </p>

                  <button
                    type="button"
                    className="cart-modal__payment-btn"
                    onClick={() => handleSendToWhatsApp("pix")}
                  >
                    💳 PIX
                  </button>

                  <button
                    type="button"
                    className="cart-modal__payment-btn"
                    onClick={() => handleSendToWhatsApp("card")}
                  >
                    💳 Cartão de Crédito/Débito
                  </button>

                  <button
                    type="button"
                    className="cart-modal__payment-btn"
                    onClick={() => handleSendToWhatsApp("boleto")}
                  >
                    📄 Boleto Bancário
                  </button>

                  <button
                    type="button"
                    className="cart-modal__payment-btn"
                    onClick={() => handleSendToWhatsApp("money")}
                  >
                    💵 Dinheiro
                  </button>

                  <button
                    type="button"
                    className="cart-modal__payment-back"
                    onClick={() => setShowPaymentOptions(false)}
                  >
                    ← Voltar
                  </button>
                </div>
              ) : (
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
                    onClick={() => setShowPaymentOptions(true)}
                  >
                    <span>📱</span>
                    Finalizar via WhatsApp
                  </button>
                </div>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
