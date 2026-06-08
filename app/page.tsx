"use client";

import { useRef } from "react";

import Link from 'next/link';
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Flame as FlameIcon, Clock, Leaf } from "lucide-react";
const heroPizza = "/assets/pizza-hero.png";
const doughImg = "/assets/pizza-dough.png";
import { PIZZAS } from "@/lib/menu";
import { Flame, Steam } from "@/components/animated-fx";



export default function Home() {
  return (
    <>
      <Hero />
      <ScrollStory />
      <Highlights />
      <MenuPreview />
      <BuildCta />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* warm ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-cheese opacity-40 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-12 sm:px-6 md:grid-cols-2 md:pt-20">
        <div className="relative z-10 text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-soft">
            <FlameIcon className="h-4 w-4 text-primary" />
            Fired at 450°C, served in minutes
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] sm:text-7xl">
            Pizza with a
            <span className="text-gradient-ember"> little theatre.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground md:mx-0">
            Welcome to Slizaa. Pick a signature pie or build your own from the
            dough up — then watch it spin, sizzle and hit the oven.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-warm transition-transform hover:scale-105"
            >
              Order now <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/build"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Make your own
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-ember opacity-20 blur-3xl" />
            <img
              src={heroPizza}
              alt="Slizaa signature pepperoni pizza"
              width={1024}
              height={1024}
              className="animate-float w-[20rem] drop-shadow-pizza sm:w-[26rem]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center pb-8 text-sm text-muted-foreground">
        <span>Scroll to watch it fire up</span>
        <span className="mt-2 h-9 w-5 rounded-full border-2 border-muted-foreground/50">
          <span className="mx-auto mt-1.5 block h-2 w-0.5 animate-bounce rounded-full bg-muted-foreground/70" />
        </span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Apple-style scroll story                                            */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: "Hand-stretched dough",
    body: "Slow-proofed for 48 hours, then stretched by hand for that perfect chew.",
  },
  {
    title: "Layered with care",
    body: "San Marzano sauce, fresh mozzarella and toppings piled with intent.",
  },
  {
    title: "Into the fire",
    body: "90 seconds in a roaring wood-fired oven. Leopard-spotted and ready.",
  },
];

function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0.7, 1.05, 1, 0.92]);
  const pizzaY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // captions fade in/out across thirds
  const op0 = useTransform(scrollYProgress, [0.02, 0.12, 0.28, 0.36], [0, 1, 1, 0]);
  const op1 = useTransform(scrollYProgress, [0.36, 0.46, 0.6, 0.68], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.68, 0.78, 0.95, 1], [0, 1, 1, 1]);
  const captionOps = [op0, op1, op2];

  // fire rises near the end
  const fireOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const fireY = useTransform(scrollYProgress, [0.7, 1], [80, 0]);
  const glow = useTransform(scrollYProgress, [0.7, 1], [0, 0.6]);

  return (
    <section ref={ref} className="relative h-[320vh] bg-charcoal text-background">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* ember glow that grows as it enters the oven */}
        <motion.div
          style={{ opacity: glow }}
          className="pointer-events-none absolute bottom-0 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-ember blur-3xl"
        />

        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-cheese">
          From dough to fire
        </p>

        <motion.img
          src={heroPizza}
          alt="Pizza rotating into the oven"
          width={1024}
          height={1024}
          style={{ rotate, scale, y: pizzaY }}
          className="w-[18rem] drop-shadow-pizza sm:w-[24rem]"
        />

        {/* rising flames under the pizza */}
        <motion.div
          style={{ opacity: fireOpacity, y: fireY }}
          className="pointer-events-none absolute bottom-10 flex items-end gap-3"
        >
          <Flame className="h-20 w-12 opacity-80" />
          <Flame className="h-32 w-20" />
          <Flame className="h-24 w-14 opacity-90" />
          <Flame className="h-32 w-20" />
          <Flame className="h-20 w-12 opacity-80" />
        </motion.div>

        {/* stacked captions */}
        <div className="relative mt-10 h-28 w-full max-w-md px-6 text-center">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              style={{ opacity: captionOps[i] }}
              className="absolute inset-x-0"
            >
              <h2 className="font-display text-3xl font-extrabold">{step.title}</h2>
              <p className="mt-2 text-background/70">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Highlights                                                          */
/* ------------------------------------------------------------------ */

function Highlights() {
  const items = [
    { icon: FlameIcon, title: "Wood-fired", body: "Real flame, real char, every single pie." },
    { icon: Clock, title: "Made fast", body: "From order to oven in record time." },
    { icon: Leaf, title: "Fresh daily", body: "Local produce and 48-hour dough." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-card p-7 shadow-soft"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-ember text-primary-foreground">
              <it.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-bold">{it.title}</h3>
            <p className="mt-2 text-muted-foreground">{it.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Menu preview                                                        */
/* ------------------------------------------------------------------ */

function MenuPreview() {
  const featured = PIZZAS.slice(0, 3);
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-4xl font-extrabold">Fan favourites</h2>
          <p className="mt-2 text-muted-foreground">A taste of what's waiting on the menu.</p>
        </div>
        <Link
          href="/menu"
          className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
        >
          See full menu <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <Link
            key={p.id}
            href="/menu"
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1"
          >
            <div className="flex justify-center drop-shadow-pizza">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={1024}
                height={1024}
                className="w-44 transition-transform duration-700 group-hover:rotate-180"
              />
            </div>
            <h3 className="mt-4 text-xl font-bold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
            <p className="mt-3 font-display text-lg font-extrabold text-primary">
              ${p.basePrice.toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Build CTA                                                           */
/* ------------------------------------------------------------------ */

function BuildCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-ember px-8 py-14 text-center text-primary-foreground shadow-warm sm:px-16">
        <Steam className="absolute left-1/2 top-6 -translate-x-1/2 opacity-60" />
        <div className="relative mx-auto mt-20 max-w-sm drop-shadow-pizza">
          <img
            src={doughImg}
            alt="Blank pizza dough"
            loading="lazy"
            width={1024}
            height={1024}
            className="animate-slizaa-spin mx-auto w-40"
          />
        </div>
        <h2 className="mt-6 font-display text-4xl font-extrabold sm:text-5xl">
          Make your own pizza
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-primary-foreground/85">
          Start with a blank canvas of dough. Choose your base, sauce, cheese,
          meats and toppings — then send it to the fire.
        </p>
        <Link
          href="/build"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-background px-8 py-3.5 text-base font-semibold text-foreground transition-transform hover:scale-105"
        >
          Start building <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
