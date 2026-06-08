"use client";

import { useState } from "react";

import Link from 'next/link';
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowRight, Plus, SlidersHorizontal } from "lucide-react";
import { PIZZAS, toppingPrice, type Pizza } from "@/lib/menu";
import { useCart, cartItemFromPizza } from "@/lib/cart";
import { PizzaCustomizer } from "@/components/pizza-customizer";
const doughImg = "/assets/pizza-dough.png";



export default function MenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="text-center">
        <h1 className="font-display text-5xl font-extrabold">The Menu</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Signature pies, ready to fire. Add them as-is or tweak every topping to
          taste. Or start from scratch with your own creation.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PIZZAS.map((pizza, i) => (
          <PizzaCard key={pizza.id} pizza={pizza} index={i} />
        ))}
        <BuildTile />
      </div>
    </div>
  );
}

function PizzaCard({ pizza, index }: { pizza: Pizza; index: number }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);

  function quickAdd() {
    addItem(cartItemFromPizza(pizza));
    toast.success(`${pizza.name} added to cart`, { description: "Fired up and ready." });
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, delay: (index % 3) * 0.06 }}
        className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft"
      >
        <div className="relative flex justify-center py-2">
          <div className="absolute inset-0 -z-10 mx-auto my-auto h-40 w-40 rounded-full bg-gradient-cheese opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40" />
          <div className="drop-shadow-pizza">
            <img
              src={pizza.image}
              alt={pizza.name}
              loading="lazy"
              width={1024}
              height={1024}
              className="w-48 transition-transform duration-[1200ms] ease-out group-hover:rotate-[360deg]"
            />
          </div>
        </div>

        <span className="mt-4 w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          {pizza.tagline}
        </span>
        <h2 className="mt-3 text-2xl font-bold">{pizza.name}</h2>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{pizza.description}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="font-display text-2xl font-extrabold text-primary">
            ${pizza.basePrice.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Customize ${pizza.name}`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={quickAdd}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition-transform hover:scale-105"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
      </motion.article>

      <PizzaCustomizer
        open={open}
        onOpenChange={setOpen}
        title={`Customize ${pizza.name}`}
        basePrice={pizza.basePrice}
        initialToppings={[...pizza.defaultToppings]}
        confirmLabel="Add to cart"
        onConfirm={(toppings) => {
          addItem(cartItemFromPizza(pizza, toppings));
          const extra = toppingPrice(toppings) - toppingPrice(pizza.defaultToppings);
          toast.success(`${pizza.name} added`, {
            description:
              extra !== 0 ? "Customised just the way you like it." : "Added to cart.",
          });
        }}
      />
    </>
  );
}

function BuildTile() {
  return (
    <Link
      href="/build"
      className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-primary/40 bg-gradient-ember/5 p-6 text-center transition-colors hover:border-primary"
    >
      <div className="drop-shadow-pizza">
        <img
          src={doughImg}
          alt="Blank pizza dough"
          loading="lazy"
          width={1024}
          height={1024}
          className="w-44 transition-transform duration-700 group-hover:rotate-[160deg]"
        />
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold">Make your own pizza</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        A blank canvas of dough. Build it from scratch, your rules.
      </p>
      <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition-transform group-hover:scale-105">
        Start building <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
