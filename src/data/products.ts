import { pantryCategories } from "./categories-pantry";
import { mealCategories } from "./categories-meals";
import { snackCategories } from "./categories-snacks";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  details?: string;
  ingredients?: string;
  size?: string;
  kosher?: boolean;
  madeInItaly?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  products: Product[];
}

// NOTE: The following chip product images existed before the chips category was removed:
//   - Sun-Dried Tomato Chips: /assets/Chips/IMG_0022-2.jpg
//   - Italian Potato Chips:   /assets/Chips/IMG_0032.jpg

export const categories: Category[] = [
  {
    id: "beverages",
    name: "Beverages",
    slug: "beverages",
    tagline: "Sparkling Celebrations",
    description: "From our iconic Moscato Grape Juice to artisan sparkling lemonades and Italian sodas, Tuscanini beverages bring the effervescence of Italian celebrations to your table. Every bottle is crafted with authentic Italian ingredients for a taste that transports you to the heart of Tuscany.",
    heroImage: "/assets/Beverage/Moscato Juice/Mockups/71006931470.jpg",
    products: [
      {
        id: "moscato-grape-juice",
        name: "Moscato Sparkling Grape Juice",
        description: "Non-alcoholic sparkling Moscato grape juice in an elegant blue bottle. Made from premium Italian Moscato grapes with a delicate sweetness and fine bubbles.",
        image: "/assets/Beverage/Moscato Juice/Mockups/71006931470.jpg",
        categoryId: "beverages",
        details: "Our signature Moscato Grape Juice is crafted from premium Italian Moscato grapes, delivering a sparkling, non-alcoholic celebration in every pour. The iconic blue bottle makes it a stunning centerpiece for any gathering.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "moscato-rose-juice",
        name: "Moscato Rosé Sparkling Grape Juice",
        description: "A delicate rosé variation of our beloved Moscato, with notes of strawberry and rose petals. Non-alcoholic and elegantly sparkling.",
        image: "/assets/Beverage/Moscato Juice/Mockups/71006931471.jpg",
        categoryId: "beverages",
        details: "The rosé edition of our Moscato Sparkling Grape Juice brings a blush-pink elegance with subtle strawberry undertones. Perfect for celebrations, holidays, and special moments.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-lemonade",
        name: "Sparkling Lemonade",
        description: "Bright and refreshing Italian sparkling lemonade made with real Sicilian lemons. A crisp, effervescent thirst quencher.",
        image: "/assets/Beverage/Sparkling Beverage/Tuscanini Flavored Seltzer Water_Mockups/Tuscanini Flavored Seltzer 0.5L 1.jpg",
        categoryId: "beverages",
        details: "Made with sun-ripened Sicilian lemons, our Sparkling Lemonade captures the bright, zesty spirit of Southern Italy. Lightly sweetened and vibrantly fizzy.",
        size: "Available in 9.3 fl oz and 25.3 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-blood-orange",
        name: "Sparkling Blood Orange",
        description: "A vibrant, tangy sparkling blood orange beverage crafted from Sicilian blood oranges. Bold citrus flavor with a beautiful ruby hue.",
        image: "/assets/Beverage/Sparkling Beverage/Tuscanini Flavored Seltzer Water_Mockups/Tuscanini Flavored Seltzer 0.5L 2.jpg",
        categoryId: "beverages",
        details: "Sicilian blood oranges give this sparkling beverage its distinctive ruby color and complex citrus flavor — sweet, tangy, and boldly refreshing.",
        size: "Available in 9.3 fl oz and 25.3 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "italian-cola",
        name: "Italian Cola",
        description: "A uniquely Italian take on cola, crafted with natural flavors and a smooth, less-sweet profile that lets the spice notes shine.",
        image: "/assets/Beverage/Sparkling Beverage/Cola/Images/730382.png",
        categoryId: "beverages",
        details: "Tuscanini Italian Cola reimagines the classic with authentic Italian craftsmanship. Made with natural flavors and a balanced sweetness that distinguishes it from ordinary colas.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "flavored-seltzer",
        name: "Flavored Sparkling Water",
        description: "Lightly flavored Italian sparkling water in refreshing varieties. Zero calories, zero sweeteners — just pure sparkling refreshment.",
        image: "/assets/Beverage/Sparkling Beverage/Tuscanini Flavored Seltzer Water_Mockups/Tuscanini Flavored Seltzer 0.5L 3.jpg",
        categoryId: "beverages",
        details: "Our Flavored Sparkling Water collection offers a light, refreshing taste with no calories and no artificial sweeteners. Available in multiple crisp, natural flavors.",
        size: "16.9 fl oz (0.5L)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-soda",
        name: "Italian Soda",
        description: "Classic Italian sodas in traditional flavors. Crafted with real fruit extracts and fine Italian sparkling water.",
        image: "/assets/Beverage/Sparkling Beverage/Tuscanini Flavored Seltzer Water_Mockups/Tuscanini Flavored Seltzer 0.5L 4.jpg",
        categoryId: "beverages",
        details: "Our Italian Sodas bring the authentic café culture of Italy to your home. Made with real fruit extracts and premium Italian sparkling water.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "natural-water",
        name: "Natural Mineral Water",
        description: "Premium Italian natural mineral water sourced from pristine alpine springs. Pure, clean, and refreshing.",
        image: "/assets/Beverage/Sparkling Beverage/Tuscanini Flavored Seltzer Water_Mockups/Tuscanini Lightly Flavored Sparkling Water 8.jpg",
        categoryId: "beverages",
        details: "Sourced from protected Italian alpine springs, our Natural Mineral Water offers exceptional purity and a perfectly balanced mineral profile. Available in still and sparkling.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-apple-cider",
        name: "Sparkling Apple Cider",
        description: "A crisp and refreshing sparkling apple cider in an elegant bottle. Made from premium Italian apples with a delicate effervescence.",
        image: "",
        categoryId: "beverages",
        details: "Our Sparkling Apple Cider is crafted from select Italian apples, delivering a crisp, naturally sweet sparkle perfect for celebrations, holidays, and special gatherings.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-bianco-grape-juice",
        name: "Sparkling Bianco Grape Juice",
        description: "A golden sparkling grape juice made from premium Italian white grapes. Light, refreshing, and elegantly effervescent.",
        image: "",
        categoryId: "beverages",
        details: "Our Sparkling Bianco Grape Juice captures the bright, fruity character of Italian white grapes in a non-alcoholic sparkling format. Its golden hue and delicate bubbles make it a sophisticated choice for any occasion.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-rosato-grape-juice",
        name: "Sparkling Rosato Grape Juice",
        description: "A beautifully pink sparkling grape juice with a light, fruity character. Non-alcoholic and perfect for celebrations.",
        image: "",
        categoryId: "beverages",
        details: "Our Sparkling Rosato Grape Juice offers a delicate pink sparkle with notes of fresh berries and stone fruit. A non-alcoholic Italian celebration in every pour.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "diet-cola",
        name: "Diet Cola",
        description: "A lighter Italian cola with zero sugar and the same artisan craftsmanship. Crisp, refreshing, and guilt-free.",
        image: "",
        categoryId: "beverages",
        details: "Tuscanini Diet Cola delivers the same Italian-crafted cola experience with zero sugar. Made with natural flavors for a clean, crisp taste that satisfies without compromise.",
        size: "9.3 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "blood-orange-juice",
        name: "Blood Orange Juice",
        description: "Pure Italian blood orange juice with a rich, ruby-red color and complex citrus flavor. Not from concentrate.",
        image: "",
        categoryId: "beverages",
        details: "Our Blood Orange Juice is pressed from Sicilian blood oranges, delivering an intensely flavorful, naturally sweet juice with a stunning deep red color. Rich in vitamin C and bursting with Mediterranean sunshine.",
        size: "32 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "mandarin-juice",
        name: "Mandarin Juice",
        description: "Sweet and aromatic Italian mandarin juice with a bright, sunny flavor. A refreshing Mediterranean citrus experience.",
        image: "",
        categoryId: "beverages",
        details: "Pressed from fragrant Italian mandarins, this juice captures the sweet, aromatic essence of Mediterranean citrus. Its bright, sunny flavor makes it a delightful drink on its own or a vibrant mixer.",
        size: "32 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "pomegranate-juice",
        name: "Pomegranate Juice",
        description: "Rich, deeply flavored Italian pomegranate juice with a beautiful garnet color. Naturally sweet-tart and full of antioxidants.",
        image: "",
        categoryId: "beverages",
        details: "Our Pomegranate Juice is crafted from premium Italian pomegranates, delivering a deeply complex, sweet-tart flavor with a stunning garnet hue. Enjoy it straight, blended into smoothies, or as an elegant cocktail ingredient.",
        size: "32 fl oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "chocolate",
    name: "Chocolate",
    slug: "chocolate",
    tagline: "Italian Chocolate Excellence",
    description: "From artisan chocolate bars adorned with Italian landmarks to luxurious truffles in milk, dark, hazelnut, and pistachio varieties, our chocolate collection represents the pinnacle of Italian confectionery craft.",
    heroImage: "/assets/Chocolate Bars/pisa large 3 LARGER OPTION Topaz Gigapixel 2x scale copy.jpg",
    products: [
      {
        id: "chocolate-bar-collection",
        name: "Italian Chocolate Bar Collection",
        description: "Premium Italian chocolate bars featuring stunning artwork of Italian landmarks. Available in milk, dark, and specialty varieties.",
        image: "/assets/Chocolate Bars/pisa large 3 LARGER OPTION Topaz Gigapixel 2x scale copy.jpg",
        categoryId: "chocolate",
        details: "Each Tuscanini Chocolate Bar is a work of art — from the premium Italian chocolate inside to the beautiful packaging showcasing Italy's most iconic landmarks. Made with the finest cocoa and traditional Italian recipes.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-truffle-milk",
        name: "Milk Chocolate Truffles",
        description: "Silky milk chocolate truffles with a smooth, melt-in-your-mouth center. Handcrafted using traditional Italian methods.",
        image: "/assets/Chocolate Truffle/Screenshot 2026-01-20 at 1.40.37 PM.png",
        categoryId: "chocolate",
        details: "Our Milk Chocolate Truffles feature a velvety smooth center enrobed in premium Italian milk chocolate. Each truffle is handcrafted to deliver an indulgent Italian chocolate experience.",
        size: "5.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-truffle-dark",
        name: "Dark Chocolate Truffles",
        description: "Rich, intense dark chocolate truffles for the discerning palate. Deep cocoa flavor with a luscious ganache center.",
        image: "/assets/Chocolate Truffle/Screenshot 2026-01-20 at 1.40.37 PM.png",
        categoryId: "chocolate",
        details: "For dark chocolate lovers, our Dark Chocolate Truffles deliver an intense, sophisticated cocoa experience. A rich ganache center surrounded by premium Italian dark chocolate.",
        size: "5.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-truffle-hazelnut",
        name: "Hazelnut Chocolate Truffles",
        description: "A classic Italian combination — rich chocolate truffles blended with roasted Piedmont hazelnuts.",
        image: "/assets/Chocolate Truffle/Screenshot 2026-01-20 at 1.40.37 PM.png",
        categoryId: "chocolate",
        details: "Inspired by the beloved hazelnut-chocolate tradition of Piedmont, these truffles combine premium cocoa with roasted Italian hazelnuts for an irresistible nutty indulgence.",
        size: "5.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-truffle-pistachio",
        name: "Pistachio Chocolate Truffles",
        description: "Luxurious chocolate truffles infused with premium Sicilian pistachios. A modern Italian delicacy.",
        image: "/assets/Chocolate Truffle/Info/Pistachio/image001.png",
        categoryId: "chocolate",
        details: "Our newest truffle variety combines the buttery richness of Sicilian pistachios with smooth Italian chocolate. A luxurious treat that celebrates one of Italy's most prized ingredients.",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "assorted-chocolate-truffles-gift-box",
        name: "Assorted Chocolate Truffles Gift Box",
        description: "An elegant gift box featuring a curated selection of our finest Italian chocolate truffles. The perfect present for any chocolate lover.",
        image: "",
        categoryId: "chocolate",
        details: "Our Assorted Chocolate Truffles Gift Box brings together a beautiful selection of milk, dark, and hazelnut truffles in an elegant presentation. Handcrafted in Italy, it is the ideal gift for holidays, celebrations, and special occasions.",
        size: "6.1 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "bakery",
    name: "Bakery",
    slug: "bakery",
    tagline: "Fresh From the Italian Oven",
    description: "Authentic Italian breads and baked goods, from our double-risen focaccia made with extra virgin olive oil to traditional flatbreads and artisan bread varieties. Every product is crafted with time-honored Italian baking traditions.",
    heroImage: "/assets/Focaccia Bread/Comps/Tuscasnini Focaccia Comp 6 copy.jpg",
    products: [
      {
        id: "focaccia-bread",
        name: "Focaccia Bread",
        description: "Double-risen focaccia bread made with hand-stretched dough and extra virgin olive oil. Ready to top with your favorite ingredients.",
        image: "/assets/Focaccia Bread/Comps/Tuscasnini Focaccia Comp 6 copy.jpg",
        categoryId: "bakery",
        details: "Our Focaccia Bread is double-risen and made with hand-stretched dough enriched with extra virgin olive oil. Imported from Italy, it's the perfect canvas for your culinary creativity — ready to top and bake.",
        size: "11.3 oz (320g)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "panini-bread",
        name: "Panini Bread",
        description: "Authentic Italian panini bread, perfect for creating classic pressed sandwiches with a crisp exterior and soft interior.",
        image: "/assets/Focaccia Bread/Comps/Tuscasnini Panini Comp 3 copy.jpg",
        categoryId: "bakery",
        details: "Crafted in Italy using traditional recipes, our Panini Bread delivers the authentic texture and flavor essential for perfect Italian pressed sandwiches.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "pizza-crust",
        name: "Pizza Crust",
        description: "Pre-made Italian pizza crust with the perfect balance of crispy and chewy. Ready for your favorite toppings.",
        image: "/assets/Focaccia Bread/Comps/Tuscasnini Pizza Crust Comp 1 copy.jpg",
        categoryId: "bakery",
        details: "Our Pizza Crust brings authentic Italian pizzeria quality to your home kitchen. Made with traditional Italian flour and olive oil for the perfect crispy-yet-chewy texture.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "flatbread",
        name: "Italian Flatbread",
        description: "Thin, crispy Italian flatbread — perfect as a base for appetizers, with dips, or as an accompaniment to any meal.",
        image: "/assets/Focaccia Bread/Comps/4B020542-4B4F-4513-AE62-2B6E8F33AE5D.png",
        categoryId: "bakery",
        details: "Our Italian Flatbread is baked thin and crispy in the traditional style. Versatile and delicious, it pairs beautifully with cheeses, cured meats, or your favorite dips.",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  ...pantryCategories,
  ...mealCategories,
  ...snackCategories,
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  for (const cat of categories) {
    const product = cat.products.find((p) => p.id === id);
    if (product) return product;
  }
  return undefined;
}

export function getCategoryForProduct(productId: string): Category | undefined {
  return categories.find((cat) => cat.products.some((p) => p.id === productId));
}
