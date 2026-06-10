"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PIZZA_MAP, toppingPrice, type Pizza } from "./menu";

export interface CartItem {
  /** unique line id */
  lineId: string;
  /** signature pizza id, or "custom" */
  pizzaId: string;
  name: string;
  image: string;
  basePrice: number;
  toppings: string[];
  quantity: number;
}

export function itemUnitPrice(item: CartItem): number {
  return item.basePrice + toppingPrice(item.toppings);
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "lineId" | "quantity">, quantity?: number) => void;
  updateItem: (lineId: string, patch: Partial<Pick<CartItem, "toppings" | "quantity">>) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "slizza-cart-v1";

function newLineId() {
  return `line_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
      setItems((prev) => [...prev, { ...item, lineId: newLineId(), quantity }]);
    };
    const updateItem: CartContextValue["updateItem"] = (lineId, patch) => {
      setItems((prev) =>
        prev
          .map((it) => (it.lineId === lineId ? { ...it, ...patch } : it))
          .filter((it) => it.quantity > 0),
      );
    };
    const removeItem: CartContextValue["removeItem"] = (lineId) => {
      setItems((prev) => prev.filter((it) => it.lineId !== lineId));
    };
    const clear = () => setItems([]);

    const count = items.reduce((n, it) => n + it.quantity, 0);
    const subtotal = items.reduce((s, it) => s + itemUnitPrice(it) * it.quantity, 0);

    return { items, addItem, updateItem, removeItem, clear, count, subtotal };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function cartItemFromPizza(pizza: Pizza, toppings?: string[]): Omit<CartItem, "lineId" | "quantity"> {
  return {
    pizzaId: pizza.id,
    name: pizza.name,
    image: pizza.image,
    basePrice: pizza.basePrice,
    toppings: toppings ?? [...pizza.defaultToppings],
  };
}

export { PIZZA_MAP };
