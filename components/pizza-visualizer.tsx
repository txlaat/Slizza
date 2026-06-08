"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const doughImg = "/assets/pizza-dough.png";

// deterministic scatter positions
const POSITIONS = Array.from({ length: 14 }, (_, i) => {
  const angle = (i * 137.5 * Math.PI) / 180;
  const r = 8 + (i / 14) * 30;
  return {
    top: 50 + Math.sin(angle) * r,
    left: 50 + Math.cos(angle) * r,
  };
});

const EMOJI: Record<string, string> = {
  "veg-jalapeno": "🌶️",
};

const MEAT_IMAGES: Record<string, string> = {
  "meat-sausage": "/assets/meat-sausage.png",
  "meat-pastrami": "/assets/meat-pastrami.png",
  "meat-salami": "/assets/meat-salami.png",
  "meat-fried-chicken": "/assets/meat-fried-chicken.png",
  "meat-grilled-chicken": "/assets/meat-grilled-chicken.png",
  "meat-smoked-turkey": "/assets/meat-smoked-turkey.png",
};

const VEG_IMAGES: Record<string, string> = {
  "veg-mushroom": "/assets/veg-mushroom.png",
  "veg-pepper": "/assets/veg-pepper.png",
  "veg-onion": "/assets/veg-onion.png",
  "veg-olive": "/assets/veg-olive.png",
  "veg-tomato": "/assets/veg-tomato.png",
  "veg-pineapple": "/assets/veg-pineapple.png",
  "veg-corn": "/assets/veg-corn.png",
};

const SAUCE_IMAGES: Record<string, string> = {
  "sauce-tomato": "/assets/sauce-tomato.png",
  "sauce-bbq": "/assets/sauce-bbq.png",
  "sauce-ranch": "/assets/sauce-ranch.png",
  "sauce-ketchup": "/assets/sauce-ketchup.png",
};

const CHEESE_IMAGES: Record<string, string> = {
  "cheese-mozz": "/assets/cheese-mozz-real.png",
  "cheese-cheddar": "/assets/cheese-cheddar-real.png",
  "cheese-turkey": "/assets/cheese-turkey-real.png",
  "cheese-kiri": "/assets/cheese-kiri-real.png",
};

const CHEESE_BLEND_MODES: Record<string, string> = {
  "cheese-mozz": "normal",
  "cheese-cheddar": "normal",
  "cheese-turkey": "normal",
  "cheese-kiri": "normal",
};



interface PizzaVisualizerProps {
  selected: string[];
  className?: string;
  isBaking?: boolean;
}

export function PizzaVisualizer({ selected, className, isBaking }: PizzaVisualizerProps) {
  const visualToppings = useMemo(() => selected.filter((id) => EMOJI[id]), [selected]);

  const hasThinCrust = selected.includes("crust-thin");
  const sauceId = selected.find((id) => id.startsWith("sauce-"));
  const cheeses = selected.filter((id) => id.startsWith("cheese-"));
  const meats = selected.filter((id) => id.startsWith("meat-"));
  const veggies = selected.filter((id) => id.startsWith("veg-"));

  return (
    <div className={cn("relative h-full w-full", !isBaking && "animate-slizaa-spin", className)}>
      {/* Dough or Base Sauce Image */}
      <img
        src={sauceId && SAUCE_IMAGES[sauceId] ? SAUCE_IMAGES[sauceId] : doughImg}
        alt="Your pizza base"
        width={1024}
        height={1024}
        className={cn(
          "h-full w-full object-contain drop-shadow-pizza transition-transform duration-500",
          hasThinCrust ? "scale-90" : "scale-100"
        )}
      />

      {/* Cheese Layers */}
      {cheeses.map((cheeseId, layerIndex) => (
        CHEESE_IMAGES[cheeseId] && (
          <img
            key={cheeseId}
            src={CHEESE_IMAGES[cheeseId]}
            alt={cheeseId}
            width={1024}
            height={1024}
            className={cn(
              "absolute inset-0 h-full w-full object-contain drop-shadow-sm transition-transform duration-500",
              hasThinCrust ? "scale-90" : "scale-100"
            )}
            style={{
              zIndex: 10 + layerIndex,
              mixBlendMode: (CHEESE_BLEND_MODES[cheeseId] as React.CSSProperties["mixBlendMode"]) || "normal"
            }}
          />
        )
      ))}

      {/* Meat Layers */}
      {meats.map((meatId, layerIndex) => (
        MEAT_IMAGES[meatId] && (
          <img
            key={meatId}
            src={MEAT_IMAGES[meatId]}
            alt={meatId}
            width={1024}
            height={1024}
            className={cn(
              "absolute inset-0 h-full w-full object-contain drop-shadow-sm transition-transform duration-500",
              hasThinCrust ? "scale-90" : "scale-100"
            )}
            style={{ zIndex: 20 + layerIndex }}
          />
        )
      ))}

      {/* Veg Layers */}
      {veggies.map((vegId, layerIndex) => (
        VEG_IMAGES[vegId] && (
          <img
            key={vegId}
            src={VEG_IMAGES[vegId]}
            alt={vegId}
            width={1024}
            height={1024}
            className={cn(
              "absolute inset-0 h-full w-full object-contain drop-shadow-sm transition-transform duration-500",
              hasThinCrust ? "scale-90" : "scale-100"
            )}
            style={{ zIndex: 30 + layerIndex }}
          />
        )
      ))}

      {/* Other Toppings (Extras, Jalapeno) */}
      <AnimatePresence>
        {visualToppings.map((id, idx) => {
          const pos = POSITIONS[idx % POSITIONS.length];
          // Scale down toppings slightly if thin crust to fit the smaller dough
          const scaleMultiplier = hasThinCrust ? 0.9 : 1;
          const adjustedTop = 50 + (pos.top - 50) * scaleMultiplier;
          const adjustedLeft = 50 + (pos.left - 50) * scaleMultiplier;

          return (
            <motion.span
              key={id + idx} // Using idx to allow multiple of same topping if needed later, or just id if unique
              initial={{ scale: 0, y: -40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
              style={{ top: `${adjustedTop}%`, left: `${adjustedLeft}%`, zIndex: 30 + idx }}
            >
              {EMOJI[id]}
            </motion.span>
          );
        })}
      </AnimatePresence>

      {isBaking && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.5] }}
          transition={{ duration: 2.8, times: [0, 0.7, 1] }}
          className="absolute inset-0 rounded-full bg-ember/40 blur-md pointer-events-none"
        />
      )}
    </div>
  );
}
