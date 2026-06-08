"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CRUSTS,
  SAUCES,
  CHEESES,
  MEATS,
  VEGGIES,
  EXTRAS,
  toppingPrice,
  type Topping,
} from "@/lib/menu";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  basePrice: number;
  initialToppings: string[];
  confirmLabel?: string;
  onConfirm: (toppings: string[]) => void;
}

const SINGLE_GROUPS: { label: string; options: Topping[] }[] = [
  { label: "Crust", options: CRUSTS },
  { label: "Sauce", options: SAUCES },
];

const MULTI_GROUPS: { label: string; options: Topping[] }[] = [
  { label: "Cheese", options: CHEESES },
  { label: "Meat", options: MEATS },
  { label: "Veggies", options: VEGGIES },
  { label: "Extras", options: EXTRAS },
];

export function PizzaCustomizer({
  open,
  onOpenChange,
  title,
  basePrice,
  initialToppings,
  confirmLabel = "Add to cart",
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<string[]>(initialToppings);

  // resync when a different pizza is opened
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (open) setSelected(initialToppings);
  }, [open]);

  const total = useMemo(
    () => basePrice + toppingPrice(selected),
    [basePrice, selected],
  );

  function setSingle(groupIds: string[], id: string) {
    setSelected((prev) => [...prev.filter((p) => !groupIds.includes(p)), id]);
  }

  function toggleMulti(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
          <DialogDescription>
            Tweak it your way — remove what you don&apos;t want, pile on what you do.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[55vh] space-y-6 overflow-y-auto px-6 py-5">
          {SINGLE_GROUPS.map((group) => {
            const ids = group.options.map((o) => o.id);
            return (
              <div key={group.label}>
                <GroupLabel>{group.label}</GroupLabel>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {group.options.map((opt) => {
                    const active = selected.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSingle(ids, opt.id)}
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                          active
                            ? "border-primary bg-primary/10 font-semibold"
                            : "border-border hover:bg-secondary",
                        )}
                      >
                        <span>{opt.name}</span>
                        <PriceTag price={opt.price} active={active} single />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {MULTI_GROUPS.map((group) => (
            <div key={group.label}>
              <GroupLabel>{group.label}</GroupLabel>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {group.options.map((opt) => {
                  const active = selected.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleMulti(opt.id)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                        active
                          ? "border-primary bg-primary/10 font-semibold"
                          : "border-border hover:bg-secondary",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40",
                          )}
                        >
                          {active ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Plus className="h-3 w-3 opacity-40" />
                          )}
                        </span>
                        {opt.name}
                      </span>
                      <PriceTag price={opt.price} active={active} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-row items-center justify-between border-t border-border px-6 py-4">
          <span className="font-display text-2xl font-extrabold text-primary">
            ${total.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => {
              onConfirm(selected);
              onOpenChange(false);
            }}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition-transform hover:scale-105"
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h4>
  );
}

function PriceTag({
  price,
  active,
  single,
}: {
  price: number;
  active?: boolean;
  single?: boolean;
}) {
  if (price === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        {single && active ? "included" : "free"}
      </span>
    );
  }
  return (
    <span className={cn("text-xs", active ? "text-primary" : "text-muted-foreground")}>
      +${price.toFixed(2)}
    </span>
  );
}
