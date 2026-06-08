"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Check, Flame as FlameIcon, Plus } from "lucide-react";
import {
  CRUSTS,
  SAUCES,
  CHEESES,
  MEATS,
  VEGGIES,
  EXTRAS,
  TOPPING_MAP,
  toppingPrice,
  type Topping,
} from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { Flame } from "@/components/animated-fx";
import { cn } from "@/lib/utils";
import { PizzaVisualizer } from "@/components/pizza-visualizer";
const doughImg = "/assets/pizza-dough.png";


const BASE_PRICE = 8;

const EMOJI: Record<string, string> = {
  "meat-sausage": "🌭",
  "meat-pastrami": "🥩",
  "meat-mixed-chicken": "🍗",
  "meat-mixed-meats": "🥓",
  "meat-super-supreme": "🍖",
  "meat-crispy-chicken": "🍗",
  "meat-chicken-ranch": "🍗",
  "meat-smoked-mixed": "🥓",
  "veg-mushroom": "🍄",
  "veg-pepper": "🫑",
  "veg-onion": "🧅",
  "veg-olive": "🫒",
  "veg-tomato": "🍅",
  "veg-jalapeno": "🌶️",
  "extra-chili": "🌶️",
  "extra-garlic": "🧄",
};

// deterministic scatter positions
const POSITIONS = Array.from({ length: 14 }, (_, i) => {
  const angle = (i * 137.5 * Math.PI) / 180;
  const r = 8 + (i / 14) * 30;
  return {
    top: 50 + Math.sin(angle) * r,
    left: 50 + Math.cos(angle) * r,
  };
});

const SINGLE = [
  { key: "crust", label: "Choose your dough", options: CRUSTS },
  { key: "sauce", label: "Pick a sauce", options: SAUCES },
] as const;

const MULTI = [
  { key: "cheese", label: "Cheeses", options: CHEESES },
  { key: "meat", label: "Meats", options: MEATS },
  { key: "veggie", label: "Veggies", options: VEGGIES },
  { key: "extra", label: "Extras", options: EXTRAS },
] as const;

export default function BuildPage() {
  const { push } = useRouter();
  const { addItem } = useCart();
  const [selected, setSelected] = useState<string[]>(["crust-classic", "sauce-tomato"]);
  const [baking, setBaking] = useState(false);

  const total = useMemo(() => BASE_PRICE + toppingPrice(selected), [selected]);

  const visualToppings = useMemo(
    () => selected.filter((id) => EMOJI[id]),
    [selected],
  );

  function setSingle(groupIds: string[], id: string) {
    setSelected((prev) => [...prev.filter((p) => !groupIds.includes(p)), id]);
  }
  function toggleMulti(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function sendToOven() {
    const hasTopping = selected.some(
      (id) => TOPPING_MAP[id]?.group !== "crust" && TOPPING_MAP[id]?.group !== "sauce",
    );
    if (!hasTopping) {
      toast.error("Add at least one topping", {
        description: "A little cheese never hurt anyone.",
      });
      return;
    }
    setBaking(true);
    window.setTimeout(() => {
      addItem({
        pizzaId: "custom",
        name: "Your Custom Pizza",
        image: doughImg,
        basePrice: BASE_PRICE,
        toppings: [...selected],
      });
      toast.success("Your custom pizza is baked!", { description: "Added to your cart." });
      push("/cart" );
    }, 3200);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
          <FlameIcon className="h-4 w-4 text-primary" /> From the dough up
        </span>
        <h1 className="mt-4 font-display text-5xl font-extrabold">Make your own pizza</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Stack it your way. Watch your toppings land, then send it to the fire.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* Live preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-[2.5rem] border border-border bg-card p-8 shadow-soft">
            <div className="relative h-full w-full">
              <PizzaVisualizer selected={selected} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your build
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {selected.map((id) => TOPPING_MAP[id]?.name).filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        {/* Builder controls */}
        <div className="space-y-7">
          {SINGLE.map((group) => {
            const ids = group.options.map((o) => o.id);
            return (
              <Section key={group.key} label={group.label}>
                {group.options.map((opt) => (
                  <OptionChip
                    key={opt.id}
                    opt={opt}
                    active={selected.includes(opt.id)}
                    onClick={() => setSingle(ids, opt.id)}
                  />
                ))}
              </Section>
            );
          })}
          {MULTI.map((group) => (
            <Section key={group.key} label={group.label}>
              {group.options.map((opt) => (
                <OptionChip
                  key={opt.id}
                  opt={opt}
                  multi
                  active={selected.includes(opt.id)}
                  onClick={() => toggleMulti(opt.id)}
                />
              ))}
            </Section>
          ))}

          <div className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-border bg-card/95 p-4 shadow-warm backdrop-blur">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-display text-3xl font-extrabold text-primary">
                ${total.toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              onClick={sendToOven}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-ember px-7 py-4 text-base font-semibold text-primary-foreground shadow-warm transition-transform hover:scale-105"
            >
              <FlameIcon className="h-5 w-5" /> Send to oven
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>{baking && <OvenOverlay toppings={selected} />}</AnimatePresence>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">{label}</h2>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function OptionChip({
  opt,
  active,
  multi,
  onClick,
}: {
  opt: Topping;
  active: boolean;
  multi?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary/10 font-semibold"
          : "border-border hover:bg-secondary",
      )}
    >
      {multi && (
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border",
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40",
          )}
        >
          {active ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 opacity-40" />}
        </span>
      )}
      <span>{opt.name}</span>
      {opt.price > 0 && (
        <span className={cn("text-xs", active ? "text-primary" : "text-muted-foreground")}>
          +${opt.price.toFixed(2)}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Oven baking overlay                                                 */
/* ------------------------------------------------------------------ */

function OvenOverlay({ toppings }: { toppings: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-charcoal/95 backdrop-blur"
    >
      {/* oven mouth */}
      <div className="relative flex h-72 w-[22rem] items-end justify-center overflow-hidden rounded-t-[3rem] bg-gradient-oven shadow-warm sm:w-[30rem]">
        {/* flames inside */}
        <div className="absolute bottom-0 flex items-end gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Flame key={i} className="w-10" />
          ))}
        </div>

        {/* pizza slides in, then bakes */}
        <motion.div
          initial={{ y: -260, rotate: -20, scale: 0.9 }}
          animate={{
            y: [-260, -10, -10, -10],
            rotate: [-20, 0, 0, 0],
            scale: [0.9, 1, 1, 1.02],
          }}
          transition={{ duration: 2.8, times: [0, 0.35, 0.7, 1], ease: "easeOut" }}
          className="relative z-10 mb-6"
        >
          <div className="relative h-40 w-40">
            <PizzaVisualizer selected={toppings} isBaking />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center text-background"
      >
        <h2 className="font-display text-3xl font-extrabold">Into the fire…</h2>
        <p className="mt-2 text-background/70">Baking your masterpiece at 450°C</p>
      </motion.div>
    </motion.div>
  );
}
