import { Category } from "./products";

export const snackCategories: Category[] = [
  {
    id: "crackers-breadsticks",
    name: "Crackers & Breadsticks",
    slug: "crackers-breadsticks",
    tagline: "Crackers, crostini, and breadsticks",
    description:
      "Parchment crackers, spelt crostini, and grissini breadsticks. Serve with cheese, dips, or antipasto.",
    heroImage: "/assets/Crackers/730330.png",
    products: [
      // Parchment Crackers
      {
        id: "original-parchment-crackers",
        name: "Original Parchment Crackers",
        description:
          "Thin, crisp parchment crackers. Serve with cheese, spreads, or on their own.",
        image: "/assets/Crackers/730330.png",
        categoryId: "crackers-breadsticks",
        details:
          "",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "oregano-parchment-crackers",
        name: "Oregano Parchment Crackers",
        description:
          "Fragrant oregano-seasoned parchment crackers with a herbaceous Italian character. Thin, crispy, and bursting with Mediterranean flavor.",
        image: "/assets/Crackers/730331.png",
        categoryId: "crackers-breadsticks",
        details:
          "Infused with aromatic Italian oregano, these parchment crackers deliver a savory herb flavor in every bite. Their paper-thin crispness and bold seasoning make them a standout addition to any antipasto spread.",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rosemary-parchment-crackers",
        name: "Rosemary Parchment Crackers",
        description:
          "Fragrant rosemary-infused parchment crackers with an earthy, aromatic profile. A refined Italian snack for discerning palates.",
        image: "/assets/Crackers/730332.png",
        categoryId: "crackers-breadsticks",
        details:
          "Fresh rosemary lends its woodsy, pine-like aroma to these ultra-thin parchment crackers.",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "truffle-parchment-crackers",
        name: "Truffle Parchment Crackers",
        description:
          "Truffle-flavored parchment crackers.",
        image: "/assets/Crackers/730333.png",
        categoryId: "crackers-breadsticks",
        details:
          "Thin parchment crackers with truffle flavor. Serve with cheese or appetizers.",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      // Spelt Crostini
      {
        id: "spelt-sea-salt-crostini-crackers",
        name: "Spelt Sea Salt Crostini Crackers",
        description:
          "Crunchy spelt crostini seasoned with sea salt.",
        image: "/assets/Crackers/730560.png",
        categoryId: "crackers-breadsticks",
        details:
          "",
        size: "6.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-rosemary-crostini-crackers",
        name: "Spelt Rosemary Crostini Crackers",
        description:
          "Aromatic rosemary spelt crostini with a rustic Italian character. Hearty, crunchy, and full of herbal flavor.",
        image: "/assets/Crackers/730561.png",
        categoryId: "crackers-breadsticks",
        details:
          "",
        size: "6.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-truffle-crostini-crackers",
        name: "Spelt Truffle Crostini Crackers",
        description:
          "Truffle-flavored spelt crostini.",
        image: "/assets/Crackers/730562.png",
        categoryId: "crackers-breadsticks",
        details:
          "",
        size: "6.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-sea-salt-crostini-multipack",
        name: "Spelt Sea Salt Crostini Multipack",
        description:
          "Individually wrapped portions of our spelt sea salt crostini.",
        image: "/assets/Crackers/730565.png",
        categoryId: "crackers-breadsticks",
        details:
          "Spelt sea salt crostini in six individually sealed snack bags.",
        size: "6 x 1.41 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-rosemary-crostini-multipack",
        name: "Spelt Rosemary Crostini Multipack",
        description:
          "Individually portioned packs of rosemary spelt crostini for easy snacking. Aromatic, crunchy, and always fresh.",
        image: "/assets/Crackers/730566.png",
        categoryId: "crackers-breadsticks",
        details:
          "Enjoy the herbal fragrance of rosemary spelt crostini anywhere with these convenient snack-sized portions. Six individually wrapped bags per box ensure every serving delivers the same fresh-from-the-oven crunch.",
        size: "6 x 1.41 oz",
        kosher: true,
        madeInItaly: true,
      },
      // Grissini
      {
        id: "sea-salt-grissini",
        name: "Sea Salt Grissini",
        description:
          "Italian grissini breadsticks with sea salt.",
        image: "/assets/Crackers/730570.png",
        categoryId: "crackers-breadsticks",
        details:
          "",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rosemary-grissini",
        name: "Rosemary Grissini",
        description:
          "Fragrant rosemary-studded Italian grissini breadsticks. Thin, crunchy, and wonderfully aromatic.",
        image: "/assets/Crackers/730571.png",
        categoryId: "crackers-breadsticks",
        details:
          "",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sesame-grissini",
        name: "Sesame Grissini",
        description:
          "Nutty sesame-coated Italian grissini breadsticks with a golden, toasty crunch. A timeless Italian snack.",
        image: "/assets/Crackers/730572.png",
        categoryId: "crackers-breadsticks",
        details:
          "",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "potato-chips",
    name: "Potato Chips",
    slug: "potato-chips",
    tagline: "Potato chips",
    description:
      "Potato chips cooked in olive oil, available in full-size and snack bags.",
    heroImage: "/assets/Chips/Tuscanini-Potato-Chips-with-Olive-Oil-Classic-4.6oz-730340.png",
    products: [
      {
        id: "classic-olive-oil-potato-chips",
        name: "Classic Olive Oil Potato Chips",
        description:
          "Italian potato chips cooked in extra virgin olive oil.",
        image: "/assets/Chips/Tuscanini-Potato-Chips-with-Olive-Oil-Classic-4.6oz-730340.png",
        categoryId: "potato-chips",
        details:
          "Potato chips cooked in extra virgin olive oil for a crisp, savory snack.",
        size: "4.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rosemary-olive-oil-potato-chips",
        name: "Rosemary Olive Oil Potato Chips",
        description:
          "Italian potato chips with rosemary, cooked in extra virgin olive oil.",
        image: "/assets/Chips/Tuscanini-Potato-Chips-with-Olive-Oil-Rosemary-4.6oz-730341.png",
        categoryId: "potato-chips",
        details:
          "",
        size: "4.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rippled-olive-oil-potato-chips",
        name: "Rippled Olive Oil Potato Chips",
        description:
          "Thick-cut rippled potato chips cooked in Italian extra virgin olive oil. Extra crunchy ridges for maximum flavor.",
        image: "/assets/Chips/Tuscanini-Potato-Chips-with-Olive-Oil-Rippled-4.6oz-730342-web.png",
        categoryId: "potato-chips",
        details:
          "Our rippled chips feature deep ridges that deliver an extra-satisfying crunch and hold onto every bit of olive oil flavor.",
        size: "4.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "classic-potato-chips-snack-bag",
        name: "Classic Potato Chips Snack Bag",
        description:
          "A snack bag of our classic olive oil potato chips.",
        image: "/assets/Chips/Tuscanini-Classic-Potato-Chips-1oz-730350.png",
        categoryId: "potato-chips",
        details:
          "",
        size: "1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rippled-potato-chips-snack-bag",
        name: "Rippled Potato Chips Snack Bag",
        description:
          "A snack bag of our rippled olive oil potato chips.",
        image: "/assets/Chips/Tuscanini-Rippled-Potato-Chips-1oz-730351.png",
        categoryId: "potato-chips",
        details:
          "Rippled olive oil potato chips in a single-serve bag.",
        size: "1 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "chestnuts",
    name: "Chestnuts",
    slug: "chestnuts",
    tagline: "Roasted chestnuts",
    description:
      "Roasted chestnuts in several flavors, ready to eat from the pouch.",
    heroImage: "/assets/Chestnuts/Tuscanini Chestnuts_Original.png",
    products: [
      {
        id: "roasted-chestnuts",
        name: "Roasted Chestnuts",
        description:
          "Italian roasted chestnuts, ready to eat from the pouch.",
        image: "/assets/Chestnuts/Tuscanini Chestnuts_Original.png",
        categoryId: "chestnuts",
        details:
          "Our Italian roasted chestnuts are peeled, roasted, and vacuum-sealed to lock in their natural sweetness and creamy texture. Enjoy them as a nourishing snack, or add them to stuffings, salads, and desserts.",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "roasted-chestnuts-salt-black-pepper",
        name: "Roasted Chestnuts with Salt & Black Pepper",
        description:
          "Italian roasted chestnuts with a savory twist of sea salt and cracked black pepper. A bold, satisfying snack.",
        image: "/assets/Chestnuts/Tuscanini Chestnuts_Salt & Pepper.png",
        categoryId: "chestnuts",
        details:
          "We take our tender Italian chestnuts and season them with a balanced blend of sea salt and freshly cracked black pepper. The result is a savory, warming snack that combines natural chestnut sweetness with a peppery kick.",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "cinnamon-chestnuts",
        name: "Cinnamon Chestnuts",
        description:
          "Warm cinnamon-dusted Italian roasted chestnuts with a sweet, cozy flavor. A delightful autumn-inspired treat.",
        image: "/assets/Chestnuts/730462.png",
        categoryId: "chestnuts",
        details:
          "",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "biscotti",
    name: "Biscotti",
    slug: "biscotti",
    tagline: "Traditional Italian Cookies",
    description:
      "Semi-soft Italian biscotti. Serve with coffee or tea, or eat on their own.",
    heroImage: "/assets/Biscotti/730575.png",
    products: [
      {
        id: "almond-biscotti",
        name: "Almond Biscotti",
        description:
          "Classic Italian almond biscotti with a semi-soft, tender crumb. Studded with whole almonds and subtly sweet.",
        image: "/assets/Biscotti/730575.png",
        categoryId: "biscotti",
        details:
          "",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-orange-biscotti",
        name: "Chocolate Orange Biscotti",
        description:
          "Rich chocolate biscotti brightened with zesty orange. A decadent Italian cookie with a citrus twist.",
        image: "/assets/Biscotti/730576.png",
        categoryId: "biscotti",
        details:
          "The classic Italian pairing of dark chocolate and bright citrus orange comes together in these semi-soft biscotti. Each bite delivers a harmonious balance of rich cocoa depth and refreshing orange zest.",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "cranberry-biscotti",
        name: "Cranberry Biscotti",
        description:
          "Semi-soft Italian biscotti dotted with tart, jewel-toned cranberries. A fruity twist on the classic cookie.",
        image: "/assets/Biscotti/730577.png",
        categoryId: "biscotti",
        details:
          "",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "pistachio-apricot-biscotti",
        name: "Pistachio Apricot Biscotti",
        description:
          "Elegant biscotti loaded with green pistachios and sweet apricot pieces. A Mediterranean-inspired flavor combination.",
        image: "/assets/Biscotti/730578.png",
        categoryId: "biscotti",
        details:
          "Semi-soft biscotti with pistachios and dried apricots.",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "blueberry-lemon-biscotti",
        name: "Blueberry Lemon Biscotti",
        description:
          "Bright and cheerful biscotti bursting with blueberries and fresh lemon zest. A refreshingly fruity Italian cookie.",
        image: "/assets/Biscotti/730579.png",
        categoryId: "biscotti",
        details:
          "",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "fruit-spreads",
    name: "Fruit Spreads",
    slug: "fruit-spreads",
    tagline: "Fruit spreads",
    description:
      "Fruit spreads for toast, pastries, and desserts. Choose from the flavors below.",
    heroImage: "/assets/Jam/730270.png",
    products: [
      {
        id: "apricot-fruit-spread-preserves",
        name: "Apricot Fruit Spread Preserves",
        description:
          "Apricot preserves.",
        image: "/assets/Jam/730270.png",
        categoryId: "fruit-spreads",
        details:
          "Our Apricot Fruit Spread captures the golden sweetness of Italian apricots at the peak of ripeness. Made with no artificial flavors or colors, it spreads beautifully on toast, croissants, or as a filling for Italian pastries.",
        size: "11.64 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "lemon-ginger-fruit-spread-preserves",
        name: "Lemon Ginger Fruit Spread Preserves",
        description:
          "A zesty and warming blend of Sicilian lemons and spicy ginger. A uniquely vibrant Italian preserve.",
        image: "/assets/Jam/730271-PRIMARY-SHOT.png",
        categoryId: "fruit-spreads",
        details:
          "",
        size: "11.64 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "strawberry-fruit-spread-preserves",
        name: "Strawberry Fruit Spread Preserves",
        description:
          "Strawberry preserves.",
        image: "/assets/Jam/730273.png",
        categoryId: "fruit-spreads",
        details:
          "",
        size: "11.64 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "forest-fruits-fruit-spread-preserves",
        name: "Forest Fruits Fruit Spread Preserves",
        description:
          "A rich medley of wild Italian berries — blackberry, blueberry, and raspberry — blended into a deeply flavored preserve.",
        image: "/assets/Jam/730274.png",
        categoryId: "fruit-spreads",
        details:
          "This lush fruit spread combines the wild flavors of Italian forest berries into one deeply satisfying preserve. The natural sweetness and complex berry character make it a versatile companion for both sweet and savory creations.",
        size: "11.64 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "raspberry-fruit-spread-preserves",
        name: "Raspberry Fruit Spread Preserves",
        description:
          "Tangy raspberry preserves.",
        image: "/assets/Jam/730275.png",
        categoryId: "fruit-spreads",
        details:
          "",
        size: "11.64 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "tuna-seafood",
    name: "Tuna & Seafood",
    slug: "tuna-seafood",
    tagline: "Tuna in cans and jars",
    description:
      "Tuna packed in olive oil or water, including ventresca belly cuts. Available in cans and glass jars.",
    heroImage: "/assets/ads/tuna-parallax.jpg",
    products: [
      {
        id: "solid-light-tuna-olive-oil-small-jar",
        name: "Solid Light Tuna in Olive Oil - Small Jar",
        description:
          "Solid light tuna in olive oil, in a glass jar.",
        image: "/assets/Tuna/Tuscanini tuna in Olive Oil.png",
        categoryId: "tuna-seafood",
        details:
          "Solid light tuna packed in olive oil in a glass jar. Use in salads, pasta, or antipasto.",
        size: "5.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "solid-light-tuna-olive-oil-chili-peppers-can",
        name: "Solid Light Tuna in Olive Oil with Chili Peppers - Can",
        description:
          "Italian tuna in olive oil with a spicy chili pepper kick. Bold, fiery flavor in a convenient can.",
        image: "/assets/Tuna/730420.png",
        categoryId: "tuna-seafood",
        details:
          "",
        size: "5.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tuna-solid-light-olive-oil-can",
        name: "Tuna Solid Light in Olive Oil - Can",
        description:
          "Italian solid light tuna packed in olive oil.",
        image: "/assets/Tuna/Tuscanini Yellowfin Tuna in Olive Oil.jpg",
        categoryId: "tuna-seafood",
        details:
          "",
        size: "5.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tuna-solid-light-water-can",
        name: "Tuna Solid Light in Water - Can",
        description:
          "Solid light tuna packed in water.",
        image: "/assets/Tuna/Tuscanini Tuna in Water.png",
        categoryId: "tuna-seafood",
        details:
          "",
        size: "5.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tuna-fillet-olive-oil-tall-jar",
        name: "Tuna Fillet in Olive Oil - Tall Jar",
        description:
          "Tuna fillets in olive oil in a tall glass jar.",
        image: "/assets/Tuna/Tusc_Tuna_Fillet_Final.png",
        categoryId: "tuna-seafood",
        details:
          "",
        size: "6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tuna-ventresca-olive-oil-tall-jar",
        name: "Tuna Ventresca in Olive Oil - Tall Jar",
        description:
          "Tuna belly (ventresca) packed in olive oil in a tall glass jar.",
        image: "/assets/Tuna/Tuscanini Ventresca Tuna.jpg",
        categoryId: "tuna-seafood",
        details:
          "",
        size: "6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "solid-light-tuna-olive-oil-three-pack",
        name: "Solid Light Tuna in Olive Oil - Three Pack",
        description:
          "A three-pack of our solid light tuna in olive oil.",
        image: "/assets/Tuna/730430.png",
        categoryId: "tuna-seafood",
        details:
          "",
        size: "3 x 2.82 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "solid-light-tuna-olive-oil-chili-peppers-three-pack",
        name: "Solid Light Tuna in Olive Oil with Chili Peppers - Three Pack",
        description:
          "A three-pack of our spicy chili pepper tuna in olive oil. Bold Italian flavor, always within reach.",
        image: "/assets/Tuna/730431.png",
        categoryId: "tuna-seafood",
        details:
          "Three cans of our fiery chili pepper tuna in olive oil, ready to add a kick of Italian heat to any meal.",
        size: "3 x 2.82 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
];
