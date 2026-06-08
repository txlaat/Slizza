
import Link from 'next/link';
import { Pizza } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-charcoal text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-ember text-primary-foreground">
              <Pizza className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl font-extrabold">slizaa</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Wood-fired pizza with a bit of theatre. Built fresh, fired hot, delivered fast.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-cheese">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            <li><Link href="/menu" className="hover:text-background">Signature Menu</Link></li>
            <li><Link href="/build" className="hover:text-background">Make Your Own</Link></li>
            <li><Link href="/cart" className="hover:text-background">Your Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-cheese">
            Find Us
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            <li>Open daily · 11am – 11pm</li>
            <li>12 Forno Street, Flavortown</li>
            <li>hello@slizaa.pizza</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 py-5 text-center text-xs text-background/50">
        © {new Date().getFullYear()} Slizaa. Made with extra cheese.
      </div>
    </footer>
  );
}
