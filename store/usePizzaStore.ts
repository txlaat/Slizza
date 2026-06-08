import { create } from 'zustand';

// بنحدد شكل البيانات بتاعتنا (لو شغال بـ JS بس، تقدر تتجاهل الـ interface ده)
interface PizzaState {
  base: string;          // نوع العجينة
  sauce: string;         // نوع الصلصة
  cheese: boolean;       // في جبنة ولا لأ؟
  toppings: string[];    // الإضافات (بيبروني، خضار، إلخ)
  isBaking: boolean;     // هل البيتزا دخلت الفرن؟ (عشان نشغل أنيميشن النهاية)
  
  // الدوال اللي هتغير البيانات دي
  setBase: (base: string) => void;
  setSauce: (sauce: string) => void;
  toggleCheese: () => void;
  addTopping: (topping: string) => void;
  removeTopping: (topping: string) => void;
  setBaking: (status: boolean) => void;
}

export const usePizzaStore = create<PizzaState>((set) => ({
  // القيم الافتراضية أول ما اليوزر يفتح الموقع
  base: 'thin',
  sauce: 'tomato',
  cheese: true,
  toppings: [],
  isBaking: false,

  // الأوامر اللي هتتنفذ لما اليوزر يدوس على زراير الموقع
  setBase: (base) => set({ base }),
  setSauce: (sauce) => set({ sauce }),
  toggleCheese: () => set((state) => ({ cheese: !state.cheese })),
  addTopping: (topping) =>
    set((state) => ({
      toppings: state.toppings.includes(topping)
        ? state.toppings 
        : [...state.toppings, topping],
    })),
  removeTopping: (topping) =>
    set((state) => ({
      toppings: state.toppings.filter((t) => t !== topping),
    })),
  setBaking: (status) => set({ isBaking: status }),
}));