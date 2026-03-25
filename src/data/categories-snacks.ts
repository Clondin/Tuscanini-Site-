import { Category, Product } from "./products";

export const snackCategories: Category[] = [
  {
    id: "crackers-snacks",
    name: "Crackers & Snacks",
    slug: "crackers-snacks",
    tagline: "Artisan Italian Snacking",
    description:
      "From delicate parchment crackers to hearty spelt crostini and crispy grissini breadsticks — our snack collection brings the Italian aperitivo tradition to your home.",
    heroImage: "/assets/Chips/Tuscanini-Potato-Chips-with-Olive-Oil-Classic-4.6oz-730340.png",
    products: [
      // Parchment Crackers
      {
        id: "original-parchment-crackers",
        name: "Original Parchment Crackers",
        description:
          "Delicate and flaky parchment crackers with a light, crispy texture. A versatile Italian cracker perfect for pairing with cheeses, spreads, or enjoying on their own.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "Our Original Parchment Crackers are baked to a delicate crispness using traditional Italian methods. Their light, flaky texture makes them the ideal companion for artisan cheeses, charcuterie boards, and gourmet dips.",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "oregano-parchment-crackers",
        name: "Oregano Parchment Crackers",
        description:
          "Fragrant oregano-seasoned parchment crackers with a herbaceous Italian character. Thin, crispy, and bursting with Mediterranean flavor.",
        image: "",
        categoryId: "crackers-snacks",
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
        image: "",
        categoryId: "crackers-snacks",
        details:
          "Fresh rosemary lends its woodsy, pine-like aroma to these ultra-thin parchment crackers. Baked in Italy to a perfect golden crispness, they pair beautifully with soft cheeses, olive tapenade, or a glass of wine.",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "truffle-parchment-crackers",
        name: "Truffle Parchment Crackers",
        description:
          "Luxurious truffle-flavored parchment crackers with an earthy, umami-rich taste. An elegant Italian snack for special occasions.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "These indulgent parchment crackers are kissed with the unmistakable aroma of Italian truffles. Each wafer-thin cracker delivers an earthy sophistication that elevates any appetizer course or cheese pairing.",
        size: "3.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      // Spelt Snacks
      {
        id: "spelt-sea-salt-crostini-crackers",
        name: "Spelt Sea Salt Crostini Crackers",
        description:
          "Crunchy spelt crostini seasoned with natural sea salt. A wholesome Italian cracker with a satisfying nutty bite.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "Made with ancient spelt grain and a touch of sea salt, these crostini crackers offer a hearty crunch and subtle nuttiness. They are twice-baked in the Italian tradition for an irresistibly crispy texture.",
        size: "6.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-rosemary-crostini-crackers",
        name: "Spelt Rosemary Crostini Crackers",
        description:
          "Aromatic rosemary spelt crostini with a rustic Italian character. Hearty, crunchy, and full of herbal flavor.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "These spelt crostini combine the wholesome nuttiness of ancient grain with fragrant Italian rosemary. Twice-baked for a satisfying crunch, they bring rustic Italian flavor to your snacking moments.",
        size: "6.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-truffle-crostini-crackers",
        name: "Spelt Truffle Crostini Crackers",
        description:
          "Decadent truffle-infused spelt crostini with an earthy depth of flavor. A gourmet Italian snack crafted from ancient grains.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "The rich earthiness of Italian truffles meets the wholesome character of spelt in these twice-baked crostini. Each bite delivers a luxurious umami richness that pairs perfectly with aged cheeses and fine wines.",
        size: "6.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-sea-salt-crostini-multipack",
        name: "Spelt Sea Salt Crostini Multipack",
        description:
          "Convenient individually wrapped portions of our beloved spelt sea salt crostini. Perfect for lunchboxes, on-the-go snacking, and portion control.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "All the wholesome crunch of our spelt sea salt crostini in perfectly portioned snack packs. Each multipack contains six individually sealed bags, keeping every serving fresh and ready for wherever your day takes you.",
        size: "6 x 1.41 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-rosemary-crostini-multipack",
        name: "Spelt Rosemary Crostini Multipack",
        description:
          "Individually portioned packs of rosemary spelt crostini for easy snacking. Aromatic, crunchy, and always fresh.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "Enjoy the herbal fragrance of rosemary spelt crostini anywhere with these convenient snack-sized portions. Six individually wrapped bags per box ensure every serving delivers the same fresh-from-the-oven crunch.",
        size: "6 x 1.41 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sea-salt-grissini",
        name: "Sea Salt Grissini",
        description:
          "Classic Italian breadstick grissini with a delicate sea salt finish. Slim, crispy, and perfect for the aperitivo hour.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "Our Sea Salt Grissini are hand-stretched and baked in the Piedmontese tradition, yielding slender breadsticks with a satisfying snap. Lightly dusted with sea salt, they are the quintessential Italian appetizer accompaniment.",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rosemary-grissini",
        name: "Rosemary Grissini",
        description:
          "Fragrant rosemary-studded Italian grissini breadsticks. Thin, crunchy, and wonderfully aromatic.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "These aromatic grissini are infused with fresh Italian rosemary, lending a woodsy herbal note to every crispy bite. Hand-stretched and baked in the traditional style, they bring authentic Piedmontese flair to your table.",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sesame-grissini",
        name: "Sesame Grissini",
        description:
          "Nutty sesame-coated Italian grissini breadsticks with a golden, toasty crunch. A timeless Italian snack.",
        image: "",
        categoryId: "crackers-snacks",
        details:
          "Generously coated with toasted sesame seeds, these grissini offer a rich, nutty flavor and irresistible crunch. Baked in the Italian tradition, they pair beautifully with hummus, soft cheeses, or prosciutto.",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      // Chips
      {
        id: "classic-olive-oil-potato-chips",
        name: "Classic Olive Oil Potato Chips",
        description:
          "Premium Italian potato chips cooked in extra virgin olive oil for a rich, golden flavor. Simply seasoned and perfectly crispy.",
        image: "/assets/Chips/Tuscanini-Potato-Chips-with-Olive-Oil-Classic-4.6oz-730340.png",
        categoryId: "crackers-snacks",
        details:
          "Crafted from select potatoes and cooked in genuine Italian extra virgin olive oil, these chips deliver a clean, savory taste with a satisfying crunch. A simple yet elevated take on the classic potato chip.",
        size: "4.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rosemary-olive-oil-potato-chips",
        name: "Rosemary Olive Oil Potato Chips",
        description:
          "Italian potato chips infused with fragrant rosemary and cooked in extra virgin olive oil. Herbaceous, crispy, and irresistible.",
        image: "/assets/Chips/Tuscanini-Potato-Chips-with-Olive-Oil-Rosemary-4.6oz-730341.png",
        categoryId: "crackers-snacks",
        details:
          "The aromatic warmth of Italian rosemary meets the richness of extra virgin olive oil in these premium kettle-style chips. Each golden chip is packed with herbal flavor and a deeply satisfying crunch.",
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
        categoryId: "crackers-snacks",
        details:
          "Our rippled chips feature deep ridges that deliver an extra-satisfying crunch and hold onto every bit of olive oil flavor. Cooked in premium Italian extra virgin olive oil for a chip that stands above the rest.",
        size: "4.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "classic-potato-chips-snack-bag",
        name: "Classic Potato Chips Snack Bag",
        description:
          "A perfectly portioned snack bag of our classic olive oil potato chips. Ideal for lunchboxes and on-the-go enjoyment.",
        image: "/assets/Chips/Tuscanini-Classic-Potato-Chips-1oz-730350.png",
        categoryId: "crackers-snacks",
        details:
          "All the premium quality of our classic olive oil potato chips in a convenient single-serve bag. Perfect for tucking into a lunchbox, backpack, or desk drawer for an Italian snacking moment anytime.",
        size: "1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rippled-potato-chips-snack-bag",
        name: "Rippled Potato Chips Snack Bag",
        description:
          "A grab-and-go snack bag of our extra-crunchy rippled olive oil chips. Big flavor in a perfectly portioned pack.",
        image: "/assets/Chips/Tuscanini-Rippled-Potato-Chips-1oz-730351.png",
        categoryId: "crackers-snacks",
        details:
          "Enjoy the satisfying crunch of our rippled olive oil potato chips wherever you go. This single-serve bag is portioned for the perfect snack break, delivering premium Italian quality in every bite.",
        size: "1 oz",
        kosher: true,
        madeInItaly: true,
      },
      // Chestnuts
      {
        id: "roasted-chestnuts",
        name: "Roasted Chestnuts",
        description:
          "Tender, naturally sweet Italian roasted chestnuts ready to enjoy straight from the pouch. A wholesome and comforting snack.",
        image: "/assets/Chestnuts/Tuscanini Chestnuts_Original.png",
        categoryId: "crackers-snacks",
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
        categoryId: "crackers-snacks",
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
        image: "",
        categoryId: "crackers-snacks",
        details:
          "Fragrant cinnamon transforms our tender Italian chestnuts into an irresistible sweet snack. Each chestnut is gently roasted and dusted with warm cinnamon, evoking the charm of a European autumn market.",
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
      "Semi-soft biscotti baked in the traditional Italian style. Perfect for dipping in coffee, tea, or enjoying on their own as an elegant Italian treat.",
    heroImage: "",
    products: [
      {
        id: "almond-biscotti",
        name: "Almond Biscotti",
        description:
          "Classic Italian almond biscotti with a semi-soft, tender crumb. Studded with whole almonds and subtly sweet.",
        image: "",
        categoryId: "biscotti",
        details:
          "Our Almond Biscotti honor the timeless Italian original with premium whole almonds baked into a tender, semi-soft dough. Perfect for dipping in espresso or enjoying alongside an afternoon tea.",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-orange-biscotti",
        name: "Chocolate Orange Biscotti",
        description:
          "Rich chocolate biscotti brightened with zesty orange. A decadent Italian cookie with a citrus twist.",
        image: "",
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
        image: "",
        categoryId: "biscotti",
        details:
          "Plump, tart cranberries are folded into our traditional semi-soft biscotti dough, creating a beautiful contrast of sweet and tangy flavors. Their vibrant color and bright taste make them a favorite for holiday gatherings.",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "pistachio-apricot-biscotti",
        name: "Pistachio Apricot Biscotti",
        description:
          "Elegant biscotti loaded with green pistachios and sweet apricot pieces. A Mediterranean-inspired flavor combination.",
        image: "",
        categoryId: "biscotti",
        details:
          "Buttery pistachios and sun-dried apricots create a stunning Mediterranean flavor profile in these semi-soft biscotti. The nutty richness of pistachio paired with sweet, fruity apricot makes every bite a sophisticated indulgence.",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "blueberry-lemon-biscotti",
        name: "Blueberry Lemon Biscotti",
        description:
          "Bright and cheerful biscotti bursting with blueberries and fresh lemon zest. A refreshingly fruity Italian cookie.",
        image: "",
        categoryId: "biscotti",
        details:
          "Sweet blueberries and vibrant lemon zest come together in these delightful semi-soft biscotti. The sunny citrus aroma and juicy berry flavor make them a perfect pairing with your morning coffee or afternoon tea.",
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
    tagline: "Sun-Ripened Italian Preserves",
    description:
      "Luxurious fruit spread preserves made with sun-ripened Italian fruits. No artificial flavors, just pure fruit goodness in every jar.",
    heroImage: "",
    products: [
      {
        id: "apricot-fruit-spread-preserves",
        name: "Apricot Fruit Spread Preserves",
        description:
          "Velvety apricot preserves made from sun-ripened Italian apricots. Naturally sweet with a luscious, spreadable texture.",
        image: "",
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
        image: "",
        categoryId: "fruit-spreads",
        details:
          "Bright Sicilian lemons meet the warming spice of ginger in this invigorating fruit spread. It adds a lively kick to morning toast, and doubles as an elegant glaze for baked goods and savory dishes alike.",
        size: "11.64 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "strawberry-fruit-spread-preserves",
        name: "Strawberry Fruit Spread Preserves",
        description:
          "Classic strawberry preserves bursting with the flavor of ripe Italian strawberries. Sweet, fruity, and irresistibly fresh.",
        image: "",
        categoryId: "fruit-spreads",
        details:
          "Made from hand-selected Italian strawberries, this fruit spread delivers the pure, sun-kissed sweetness of summer in every spoonful. Enjoy it on fresh bread, swirled into yogurt, or as a topping for your favorite desserts.",
        size: "11.64 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "forest-fruits-fruit-spread-preserves",
        name: "Forest Fruits Fruit Spread Preserves",
        description:
          "A rich medley of wild Italian berries — blackberry, blueberry, and raspberry — blended into a deeply flavored preserve.",
        image: "",
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
          "Bright and tangy raspberry preserves with a vibrant color and bold berry flavor. Made from premium Italian raspberries.",
        image: "",
        categoryId: "fruit-spreads",
        details:
          "Our Raspberry Fruit Spread showcases the intense, tangy-sweet flavor of Italian raspberries. Its jewel-toned color and bold berry taste make it a stunning addition to breakfast tables, cheese boards, and baked creations.",
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
    tagline: "Mediterranean Catch",
    description:
      "Premium Italian tuna, sustainably sourced and packed in quality olive oil or water. From everyday cans to luxurious ventresca belly cuts in elegant glass jars.",
    heroImage: "/assets/Tuna/Tusc_Tuna_Final_for_Web.png",
    products: [
      {
        id: "solid-light-tuna-olive-oil-small-jar",
        name: "Solid Light Tuna in Olive Oil - Small Jar",
        description:
          "Premium solid light tuna packed in Italian olive oil in a convenient glass jar. Tender, flavorful, and ready to enjoy.",
        image: "/assets/Tuna/Tuscanini tuna in Olive Oil.png",
        categoryId: "tuna-seafood",
        details:
          "Our solid light tuna is carefully selected and packed in quality Italian olive oil in an elegant glass jar. The olive oil infuses the tuna with a rich, smooth flavor that elevates salads, pasta, and antipasto plates.",
        size: "5.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "solid-light-tuna-olive-oil-chili-peppers-can",
        name: "Solid Light Tuna in Olive Oil with Chili Peppers - Can",
        description:
          "Italian tuna in olive oil with a spicy chili pepper kick. Bold, fiery flavor in a convenient can.",
        image: "",
        categoryId: "tuna-seafood",
        details:
          "For those who crave a little heat, this solid light tuna is packed in olive oil with Italian chili peppers. The gentle spice complements the rich tuna perfectly, adding a Mediterranean warmth to sandwiches, pastas, and salads.",
        size: "5.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tuna-solid-light-olive-oil-can",
        name: "Tuna Solid Light in Olive Oil - Can",
        description:
          "Classic Italian solid light tuna packed in olive oil. A versatile pantry staple with premium quality and flavor.",
        image: "/assets/Tuna/Tuscanini Yellowfin Tuna in Olive Oil.jpg",
        categoryId: "tuna-seafood",
        details:
          "This everyday essential features premium solid light tuna packed in Italian olive oil for a rich, satisfying flavor. Keep a few cans on hand for quick pasta dishes, hearty salads, and satisfying sandwiches.",
        size: "5.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tuna-solid-light-water-can",
        name: "Tuna Solid Light in Water - Can",
        description:
          "Lean and protein-rich solid light tuna packed in water. Clean flavor and a lighter option for health-conscious meals.",
        image: "/assets/Tuna/Tuscanini Tuna in Water.png",
        categoryId: "tuna-seafood",
        details:
          "Our solid light tuna in water offers a lean, clean-tasting option without sacrificing quality. Packed with protein and ready to use, it is a wholesome choice for salads, wraps, and light Italian dishes.",
        size: "5.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tuna-fillet-olive-oil-tall-jar",
        name: "Tuna Fillet in Olive Oil - Tall Jar",
        description:
          "Hand-packed tuna fillets in Italian olive oil presented in an elegant tall glass jar. A premium cut for refined palates.",
        image: "/assets/Tuna/Tusc_Tuna_Fillet_Final.png",
        categoryId: "tuna-seafood",
        details:
          "These carefully hand-packed tuna fillets are immersed in premium Italian olive oil inside an elegant tall jar. The superior cut and beautiful presentation make this a centerpiece for antipasto platters and gourmet preparations.",
        size: "6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tuna-ventresca-olive-oil-tall-jar",
        name: "Tuna Ventresca in Olive Oil - Tall Jar",
        description:
          "The prized belly cut of tuna — silky, rich, and melt-in-your-mouth tender. Packed in olive oil in a stunning glass jar.",
        image: "/assets/Tuna/Tuscanini Ventresca Tuna.jpg",
        categoryId: "tuna-seafood",
        details:
          "Ventresca is the most coveted cut of tuna, taken from the belly where the flesh is richest and most tender. Our ventresca is hand-packed in Italian olive oil, delivering an unparalleled silky texture and depth of flavor.",
        size: "6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "solid-light-tuna-olive-oil-three-pack",
        name: "Solid Light Tuna in Olive Oil - Three Pack",
        description:
          "A convenient three-pack of our premium solid light tuna in olive oil. Stock your pantry with Italian quality.",
        image: "",
        categoryId: "tuna-seafood",
        details:
          "Three perfectly portioned cans of our solid light tuna in Italian olive oil, bundled for convenience and value. Always have premium Italian tuna on hand for quick weeknight meals and impromptu entertaining.",
        size: "3 x 2.82 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "solid-light-tuna-olive-oil-chili-peppers-three-pack",
        name: "Solid Light Tuna in Olive Oil with Chili Peppers - Three Pack",
        description:
          "A three-pack of our spicy chili pepper tuna in olive oil. Bold Italian flavor, always within reach.",
        image: "",
        categoryId: "tuna-seafood",
        details:
          "Three cans of our fiery chili pepper tuna in olive oil, ready to add a kick of Italian heat to any meal. A must-have pantry trio for spice lovers who appreciate premium quality and convenience.",
        size: "3 x 2.82 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "beans-legumes",
    name: "Beans & Legumes",
    slug: "beans-legumes",
    tagline: "Italian Pantry Essentials",
    description:
      "Premium Italian beans and legumes in convenient Tetra Pak packaging. Ready to use in soups, salads, and classic Italian dishes.",
    heroImage: "",
    products: [
      {
        id: "chickpeas-tetra-pak",
        name: "Chickpeas Tetra Pak",
        description:
          "Tender Italian chickpeas in convenient Tetra Pak packaging. Ready to use in hummus, salads, soups, and classic Italian recipes.",
        image: "",
        categoryId: "beans-legumes",
        details:
          "Our Italian chickpeas are packed at peak tenderness in eco-friendly Tetra Pak cartons that preserve freshness without the metallic taste of cans. Simply drain and add to your favorite dishes for instant Mediterranean flavor.",
        size: "13.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "cannellini-beans-tetra-pak",
        name: "Cannellini Beans Tetra Pak",
        description:
          "Creamy Italian cannellini beans in a convenient Tetra Pak. The essential white bean for Tuscan soups, salads, and side dishes.",
        image: "",
        categoryId: "beans-legumes",
        details:
          "These velvety cannellini beans are a cornerstone of Tuscan cuisine, prized for their creamy texture and mild, nutty flavor. Packed in Tetra Pak for freshness, they are ready to star in ribollita, minestrone, and white bean salads.",
        size: "13.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "organic-chickpeas-tetra-pak",
        name: "Organic Chickpeas Tetra Pak",
        description:
          "Certified organic Italian chickpeas in Tetra Pak packaging. Premium quality beans grown without synthetic pesticides or fertilizers.",
        image: "",
        categoryId: "beans-legumes",
        details:
          "Our organic chickpeas are grown on certified Italian farms using sustainable practices, then packed in convenient Tetra Pak cartons. Enjoy the same tender texture and rich flavor with the added assurance of organic certification.",
        size: "13.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "red-kidney-beans-tetra-pak",
        name: "Red Kidney Beans Tetra Pak",
        description:
          "Hearty Italian red kidney beans in Tetra Pak packaging. A protein-rich staple for chili, stews, and hearty salads.",
        image: "",
        categoryId: "beans-legumes",
        details:
          "These robust red kidney beans bring Italian quality to your heartiest dishes. Packed in convenient Tetra Pak cartons, they retain their firm texture and deep, earthy flavor — perfect for chili, bean salads, and rustic Italian soups.",
        size: "13.4 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
];
