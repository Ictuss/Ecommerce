import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  slug?: string;
  imageUrl?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQty: (id: string | number, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "ecommerce-cart-v1";

function loadInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignora erro de storage
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    function addItem(newItem: CartItem) {
      setItems((prev) => {
        const existing = prev.find((p) => p.id === newItem.id);
        if (existing) {
          return prev.map((p) =>
            p.id === newItem.id ? { ...p, qty: p.qty + newItem.qty } : p
          );
        }
        return [...prev, newItem];
      });
    }

    function removeItem(id: string | number) {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }

    function updateQty(id: string | number, qty: number) {
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
      );
    }

    function clear() {
      setItems([]);
    }

    return {
      items,
      addItem,
      removeItem,
      updateQty,
      clear,
      totalItems,
      totalPrice,
    };
  }, [items]);

  return React.createElement(CartContext.Provider, { value }, children);
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart precisa estar dentro de CartProvider");
  }
  return ctx;
}
