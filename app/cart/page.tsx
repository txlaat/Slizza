"use client";

import { useState } from "react";

import Link from 'next/link';
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Minus, Plus, SlidersHorizontal, Trash2, ShoppingBag } from "lucide-react";
import { useCart, itemUnitPrice, type CartItem } from "@/lib/cart";
import { TOPPING_MAP } from "@/lib/menu";
import { PizzaCustomizer } from "@/components/pizza-customizer";
import { Steam } from "@/components/animated-fx";



const DELIVERY = 3.5;

export default function CartPage() {
  const { items, subtotal, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Looks like the oven is cold. Let's fix that.
        </p>
        <div className="mt-7 flex gap-3">
          <Link
            href="/menu"
            className="rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-warm transition-transform hover:scale-105"
          >
            Browse the menu
          </Link>
          <Link
            href="/build"
            className="rounded-full border border-border bg-card px-7 py-3.5 font-semibold transition-colors hover:bg-secondary"
          >
            Build your own
          </Link>
        </div>
      </div>
    );
  }

  const total = subtotal + DELIVERY;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-5xl font-extrabold">Your order</h1>
        <button
          onClick={() => {
            clear();
            toast("Cart cleared");
          }}
          className="text-sm font-medium text-muted-foreground hover:text-destructive"
        >
          Clear all
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartRow key={item.lineId} item={item} />
            ))}
          </AnimatePresence>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft">
            <Steam className="absolute right-6 top-2 opacity-50" />
            <h2 className="font-display text-2xl font-extrabold">Summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Subtotal" value={subtotal} />
              <Row label="Delivery" value={DELIVERY} />
              <div className="border-t border-border pt-3">
                <Row label="Total" value={total} bold />
              </div>
            </dl>
            <button
              onClick={() =>
                toast.success("Order placed!", {
                  description: "Your pizzas are heading to the oven. 🍕",
                })
              }
              className="mt-6 w-full rounded-full bg-gradient-ember py-4 font-semibold text-primary-foreground shadow-warm transition-transform hover:scale-[1.02]"
            >
              Checkout · ${total.toFixed(2)}
            </button>
            <Link
              href="/menu"
              className="mt-3 block text-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Add more pizzas
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-display text-lg font-extrabold" : "text-muted-foreground"}>
        {label}
      </dt>
      <dd className={bold ? "font-display text-lg font-extrabold text-primary" : "font-medium"}>
        ${value.toFixed(2)}
      </dd>
    </div>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const { updateItem, removeItem } = useCart();
  const [editing, setEditing] = useState(false);
  const unit = itemUnitPrice(item);
  const toppingNames = item.toppings.map((id) => TOPPING_MAP[id]?.name).filter(Boolean);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className="flex gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft"
      >
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-secondary">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="w-20 drop-shadow-pizza"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <span className="font-display text-lg font-extrabold text-primary">
              ${(unit * item.quantity).toFixed(2)}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {toppingNames.join(" · ")}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-full border border-border p-1">
              <IconBtn
                label="Decrease quantity"
                onClick={() => updateItem(item.lineId, { quantity: item.quantity - 1 })}
              >
                <Minus className="h-4 w-4" />
              </IconBtn>
              <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
              <IconBtn
                label="Increase quantity"
                onClick={() => updateItem(item.lineId, { quantity: item.quantity + 1 })}
              >
                <Plus className="h-4 w-4" />
              </IconBtn>
            </div>

            <div className="flex items-center gap-1">
              <IconBtn label="Edit toppings" onClick={() => setEditing(true)}>
                <SlidersHorizontal className="h-4 w-4" />
              </IconBtn>
              <IconBtn
                label="Remove item"
                onClick={() => {
                  removeItem(item.lineId);
                  toast("Removed from cart");
                }}
              >
                <Trash2 className="h-4 w-4" />
              </IconBtn>
            </div>
          </div>
        </div>
      </motion.div>

      <PizzaCustomizer
        open={editing}
        onOpenChange={setEditing}
        title={`Edit ${item.name}`}
        basePrice={item.basePrice}
        initialToppings={item.toppings}
        confirmLabel="Save changes"
        onConfirm={(toppings) => {
          updateItem(item.lineId, { toppings });
          toast.success("Pizza updated");
        }}
      />
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {children}
    </button>
  );
}
