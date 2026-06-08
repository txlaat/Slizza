const pizzaPepperoni = "/assets/pizza-hero.png";
const pizzaMargherita = "/assets/pizza-margherita.png";
const pizzaFourCheese = "/assets/pizza-fourcheese.png";
const pizzaBbq = "/assets/pizza-bbq.png";
const pizzaVeggie = "/assets/pizza-veggie.png";

export type OptionGroup = "crust" | "sauce" | "cheese" | "meat" | "veggie" | "extra";

export interface Topping {
  id: string;
  name: string;
  price: number;
  group: OptionGroup;
}

export interface Pizza {
  id: string;
  name: string;
  tagline: string;
  description: string;
  basePrice: number;
  image: string;
  /** default topping ids applied to this signature pizza */
  defaultToppings: string[];
}

export const CRUSTS: Topping[] = [
  { id: "crust-classic", name: "Thick (سميك 30cm)", price: 0, group: "crust" },
  { id: "crust-thin", name: "Thin (رفيع 30cm)", price: 0, group: "crust" },
];

export const SAUCES: Topping[] = [
  { id: "sauce-tomato", name: "Classic Tomato", price: 0, group: "sauce" },
  { id: "sauce-bbq", name: "Smoky BBQ", price: 1, group: "sauce" },
  { id: "sauce-ranch", name: "Ranch", price: 1.5, group: "sauce" },
  { id: "sauce-ketchup", name: "Ketchup", price: 1, group: "sauce" },
];

export const CHEESES: Topping[] = [
  { id: "cheese-mozz", name: "Mozzarella (موزاريلا)", price: 0, group: "cheese" },
  { id: "cheese-cheddar", name: "Cheddar (شيدر)", price: 1, group: "cheese" },
  { id: "cheese-turkey", name: "Turkey (تركي)", price: 1.5, group: "cheese" },
  { id: "cheese-kiri", name: "Kiri (كيري)", price: 1.5, group: "cheese" },
];

export const MEATS: Topping[] = [
  { id: "meat-sausage", name: "Sausage (سجق)", price: 2.5, group: "meat" },
  { id: "meat-salami", name: "Salami (سلامي)", price: 2.5, group: "meat" },
  { id: "meat-pastrami", name: "Pastrami (بسطرمة)", price: 2.5, group: "meat" },
  { id: "meat-fried-chicken", name: "Fried Chicken (فراخ مقليه)", price: 3, group: "meat" },
  { id: "meat-grilled-chicken", name: "Grilled Chicken (فراخ جريل)", price: 3, group: "meat" },
  { id: "meat-smoked-turkey", name: "Smoked Turkey (رومي مدخن)", price: 3, group: "meat" },
];

export const VEGGIES: Topping[] = [
  { id: "veg-mushroom", name: "Mushrooms (مشروم)", price: 1, group: "veggie" },
  { id: "veg-pepper", name: "Green Peppers (فلفل أخضر)", price: 0.5, group: "veggie" },
  { id: "veg-onion", name: "Onions (بصل)", price: 0.5, group: "veggie" },
  { id: "veg-olive", name: "Black Olives (زيتون أسود)", price: 1, group: "veggie" },
  { id: "veg-tomato", name: "Tomatoes (طماطم)", price: 0.5, group: "veggie" },
  { id: "veg-jalapeno", name: "Jalapeños (هالابينو)", price: 1, group: "veggie" },
  { id: "veg-pineapple", name: "Pineapple (أناناس)", price: 1.5, group: "veggie" },
  { id: "veg-corn", name: "Sweet Corn (ذرة حلوة)", price: 1, group: "veggie" },
];

export const EXTRAS: Topping[] = [
  { id: "extra-cheese", name: "Extra Cheese (إكسترا جبنة)", price: 1, group: "extra" },
  { id: "extra-stuffed-crust", name: "Stuffed Crust (أطراف محشية)", price: 2, group: "extra" },
  { id: "extra-garlic-bread", name: "Garlic Bread (خبز بالثوم)", price: 2.5, group: "extra" },
];

export const ALL_TOPPINGS: Topping[] = [
  ...CRUSTS,
  ...SAUCES,
  ...CHEESES,
  ...MEATS,
  ...VEGGIES,
  ...EXTRAS,
];

export const TOPPING_MAP: Record<string, Topping> = Object.fromEntries(
  ALL_TOPPINGS.map((t) => [t.id, t]),
);

export const PIZZAS: Pizza[] = [
  {
    id: "pepperoni",
    name: "Pepperoni Inferno",
    tagline: "House favourite",
    description: "A blazing layer of pepperoni over bubbling mozzarella and fresh basil.",
    basePrice: 12,
    image: pizzaPepperoni,
    defaultToppings: ["crust-classic", "sauce-tomato", "cheese-mozz", "meat-salami", "veg-jalapeno"],
  },
  {
    id: "margherita",
    name: "Margherita Classica",
    tagline: "Timeless",
    description: "Fresh mozzarella, San Marzano tomato and hand-torn basil. Simplicity perfected.",
    basePrice: 10,
    image: pizzaMargherita,
    defaultToppings: ["crust-classic", "sauce-tomato", "cheese-mozz", "veg-tomato"],
  },
  {
    id: "fourcheese",
    name: "Quattro Formaggi",
    tagline: "Extra melty",
    description: "Mozzarella, cheddar, parmesan and feta melted to golden perfection.",
    basePrice: 13,
    image: pizzaFourCheese,
    defaultToppings: ["crust-classic", "sauce-tomato", "cheese-mozz", "cheese-cheddar", "cheese-turkey"],
  },
  {
    id: "bbq",
    name: "Smoky BBQ Chicken",
    tagline: "Crowd pleaser",
    description: "Grilled chicken, red onion and a smoky BBQ drizzle over melted cheese.",
    basePrice: 14,
    image: pizzaBbq,
    defaultToppings: ["crust-classic", "sauce-bbq", "cheese-mozz", "meat-grilled-chicken", "veg-onion"],
  },
  {
    id: "veggie",
    name: "Garden Supreme",
    tagline: "Loaded veg",
    description: "Peppers, mushrooms, olives, onion and cherry tomato piled high.",
    basePrice: 12,
    image: pizzaVeggie,
    defaultToppings: ["crust-thin", "sauce-tomato", "cheese-mozz", "veg-pepper", "veg-mushroom", "veg-olive", "veg-onion", "veg-tomato"],
  },
];

export const PIZZA_MAP: Record<string, Pizza> = Object.fromEntries(
  PIZZAS.map((p) => [p.id, p]),
);

export function toppingPrice(ids: string[]): number {
  return ids.reduce((sum, id) => sum + (TOPPING_MAP[id]?.price ?? 0), 0);
}
