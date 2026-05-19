export type MenuItem = {
  id: string;
  name: string;
  price: number;
  desc: string;
  image: string;
  category: "Antipasti" | "Paste" | "Pizze" | "Secondi" | "Dolci" | "Bevande";
};

export const MENU: MenuItem[] = [
  // ── Antipasti ──────────────────────────────────────────────────────────────
  {
    id: "1",
    name: "Bruschetta al Pomodoro",
    price: 9,
    desc: "Toasted ciabatta with heirloom tomatoes, fresh basil & extra-virgin olive oil",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80",
    category: "Antipasti",
  },
  {
    id: "2",
    name: "Arancini Siciliani",
    price: 12,
    desc: "Crispy saffron risotto balls stuffed with mozzarella & slow-cooked ragù",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    category: "Antipasti",
  },
  {
    id: "3",
    name: "Insalata Caprese",
    price: 13,
    desc: "Buffalo mozzarella, heirloom tomatoes, fresh basil & 12-year balsamic",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&q=80",
    category: "Antipasti",
  },

  // ── Paste ──────────────────────────────────────────────────────────────────
  {
    id: "4",
    name: "Spaghetti Carbonara",
    price: 16,
    desc: "Guanciale, egg yolk, Pecorino Romano & cracked black pepper",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80",
    category: "Paste",
  },
  {
    id: "5",
    name: "Penne Arrabbiata",
    price: 14,
    desc: "San Marzano tomatoes, Calabrian chilli, garlic & fresh parsley",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80",
    category: "Paste",
  },
  {
    id: "6",
    name: "Fettuccine Alfredo",
    price: 15,
    desc: "Hand-rolled ribbons in cultured butter & aged Parmigiano-Reggiano",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80",
    category: "Paste",
  },
  {
    id: "7",
    name: "Gnocchi al Pesto",
    price: 15,
    desc: "Handmade potato gnocchi with Ligurian basil pesto & toasted pine nuts",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    category: "Paste",
  },

  // ── Pizze ──────────────────────────────────────────────────────────────────
  {
    id: "8",
    name: "Margherita D.O.C.",
    price: 15,
    desc: "San Marzano tomato, fior di latte mozzarella & fresh basil",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
    category: "Pizze",
  },
  {
    id: "9",
    name: "Diavola",
    price: 17,
    desc: "Spicy Calabrese salami, mozzarella, chilli oil & fresh oregano",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    category: "Pizze",
  },
  {
    id: "10",
    name: "Quattro Stagioni",
    price: 18,
    desc: "Artichoke hearts, prosciutto, olives & porcini mushrooms",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    category: "Pizze",
  },

  // ── Secondi ────────────────────────────────────────────────────────────────
  {
    id: "11",
    name: "Osso Buco Milanese",
    price: 26,
    desc: "Slow-braised veal shank with gremolata & saffron risotto Milanese",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    category: "Secondi",
  },
  {
    id: "12",
    name: "Branzino al Forno",
    price: 24,
    desc: "Whole roasted sea bass with capers, cherry tomatoes & salsa verde",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80",
    category: "Secondi",
  },

  // ── Dolci ──────────────────────────────────────────────────────────────────
  {
    id: "13",
    name: "Tiramisù Classico",
    price: 9,
    desc: "Espresso-soaked ladyfingers, mascarpone cream & Valrhona cocoa",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
    category: "Dolci",
  },
  {
    id: "14",
    name: "Panna Cotta",
    price: 8,
    desc: "Silky vanilla bean cream with wild berry coulis & fresh mint",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
    category: "Dolci",
  },

  // ── Bevande ────────────────────────────────────────────────────────────────
  {
    id: "15",
    name: "Limoncello Spritz",
    price: 8,
    desc: "House limoncello, Prosecco D.O.C. & fresh lemon over ice",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
    category: "Bevande",
  },
];

export const CATEGORIES = [
  "All",
  "Antipasti",
  "Paste",
  "Pizze",
  "Secondi",
  "Dolci",
  "Bevande",
] as const;
export type Category = (typeof CATEGORIES)[number];
