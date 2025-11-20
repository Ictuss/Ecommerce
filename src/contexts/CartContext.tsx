import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type CartProduct = {
  id: string | number;
  name: string;
  price: number; // em número (ex: 109.9)
  image?: string;
  slug?: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (id: CartProduct["id"]) => void;
  decreaseItem: (id: CartProduct["id"]) => void;
  clearCart: () => void;

  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return ctx;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (product: CartProduct, quantity: number = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { ...product, quantity }];
    });
    setIsOpen(true); // abre carrinho quando adiciona
  };

  const removeFromCart = (id: CartProduct["id"]) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const decreaseItem = (id: CartProduct["id"]) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((v) => !v);

  const { totalQuantity, totalPrice } = useMemo(() => {
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const price = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    return { totalQuantity: quantity, totalPrice: price };
  }, [items]);

  const value: CartContextType = {
    items,
    totalQuantity,
    totalPrice,
    addToCart,
    removeFromCart,
    decreaseItem,
    clearCart,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
