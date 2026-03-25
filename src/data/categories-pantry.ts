import { Category, Product } from "./products";

export const pantryCategories: Category[] = [
  {
    id: "olive-oil-vinegars",
    name: "Olive Oil & Vinegars",
    slug: "olive-oil-vinegars",
    tagline: "Liquid Gold from Ancient Groves",
    description:
      "From cold-pressed extra virgin olive oil to aged balsamic vinegar of Modena, our collection captures centuries of Italian tradition in every bottle.",
    heroImage: "/assets/Olive Oil/Tuscanini-Olive-Oil-Extra-Light-1L-730400.png",
    products: [
      {
        id: "extra-light-olive-oil-1l",
        name: "Extra Light Olive Oil 1L",
        description:
          "A delicately refined olive oil with a mild, neutral flavor perfect for high-heat cooking and baking. Versatile enough for every kitchen task.",
        image: "/assets/Olive Oil/Tuscanini-Olive-Oil-Extra-Light-1L-730400.png",
        categoryId: "olive-oil-vinegars",
        details:
          "Our Extra Light Olive Oil is crafted from premium Italian olives and refined for a light taste and higher smoke point. Ideal for frying, sautéing, and recipes where a subtle oil flavor is desired.",
        size: "33.8 oz (1L)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "extra-light-olive-oil-2l",
        name: "Extra Light Olive Oil 2L",
        description:
          "The same refined, mild olive oil in a generous two-liter bottle for everyday cooking needs. Perfect for busy kitchens that go through oil quickly.",
        image: "/assets/Olive Oil/Tuscanini-Olive-Oil-Extra-Light-2L-730410.png",
        categoryId: "olive-oil-vinegars",
        details:
          "A larger format of our popular Extra Light Olive Oil, offering exceptional value without compromising on Italian quality. Its neutral profile makes it the go-to choice for high-heat cooking and baking.",
        size: "67.6 oz (2L)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "extra-light-olive-oil-3l",
        name: "Extra Light Olive Oil 3L",
        description:
          "Our largest extra light olive oil for households and entertaining enthusiasts who demand quality in every dish. An Italian pantry staple in a value-sized bottle.",
        image: "/assets/Olive Oil/Tuscanini-Olive-Oil-Extra-Light-3L-730415.png",
        categoryId: "olive-oil-vinegars",
        details:
          "The three-liter bottle of our Extra Light Olive Oil ensures you always have premium Italian oil on hand. With its clean, mild flavor and high smoke point, it's the workhorse of any serious kitchen.",
        size: "101.4 oz (3L)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "evoo-750ml",
        name: "Extra Virgin Olive Oil",
        description:
          "Cold-pressed extra virgin olive oil with a robust, peppery finish and golden-green hue. The cornerstone of authentic Italian cooking.",
        image: "/assets/Olive Oil/730406 Large.png",
        categoryId: "olive-oil-vinegars",
        details:
          "Our Extra Virgin Olive Oil is cold-pressed from hand-harvested Italian olives, preserving the full depth of flavor and natural antioxidants. Its fruity aroma and peppery finish make it ideal for drizzling, dipping, and finishing dishes.",
        size: "750ml",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "evoo-garlic-250ml",
        name: "Extra Virgin Olive Oil with Garlic",
        description:
          "Premium extra virgin olive oil naturally infused with aromatic Italian garlic. Adds instant depth to pasta, bruschetta, and roasted vegetables.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Our garlic-infused EVOO combines cold-pressed Italian olive oil with the bold, savory essence of fresh garlic. A single drizzle transforms simple dishes into flavorful Italian creations.",
        size: "250ml",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "evoo-lemon-250ml",
        name: "Extra Virgin Olive Oil with Lemon",
        description:
          "Bright and zesty extra virgin olive oil infused with fresh Sicilian lemons. A vibrant finishing oil for seafood, salads, and grilled dishes.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Sun-ripened Sicilian lemons lend their bright citrus essence to our cold-pressed extra virgin olive oil. The result is a lively, aromatic oil that elevates fish, vegetables, and desserts alike.",
        size: "250ml",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "evoo-black-truffle-250ml",
        name: "Extra Virgin Olive Oil with Black Truffle",
        description:
          "Luxurious extra virgin olive oil infused with prized Italian black truffles. An indulgent finishing oil with an earthy, intoxicating aroma.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Our truffle-infused EVOO marries the richness of cold-pressed Italian olive oil with the unmistakable earthy depth of black truffles. A few drops elevate pasta, risotto, eggs, and popcorn to gourmet status.",
        size: "250ml",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "balsamic-vinegar-modena-8oz",
        name: "Balsamic Vinegar of Modena",
        description:
          "Aged balsamic vinegar from Modena with a rich, complex sweetness and velvety texture. A timeless Italian condiment.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Crafted in Modena using traditional methods, our Balsamic Vinegar offers a harmonious balance of sweetness and acidity. Aged to develop its signature dark color and syrupy consistency, it's perfect for dressings, marinades, and finishing drizzles.",
        size: "8.45 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "balsamic-vinegar-modena-500ml",
        name: "Balsamic Vinegar of Modena 500ml",
        description:
          "A generous bottle of our authentic Modena balsamic vinegar for those who use this Italian essential every day. Rich, nuanced, and endlessly versatile.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "The larger format of our Balsamic Vinegar of Modena ensures you never run out of this kitchen staple. Its complex sweetness and silky body enhance everything from caprese salads to roasted meats and even strawberries.",
        size: "16.9 oz (500ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "balsamic-glaze-modena",
        name: "Balsamic Vinegar Glaze of Modena",
        description:
          "A thick, syrupy reduction of balsamic vinegar perfect for drizzling over salads, grilled meats, and fresh fruit. Beautiful presentation and intense flavor.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Our Balsamic Glaze is slow-reduced from authentic Modena balsamic vinegar into a luxuriously thick, sweet-tangy syrup. Its easy-squeeze bottle makes artful plating effortless for both home cooks and professional chefs.",
        size: "8.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "balsamic-vinegar-spray",
        name: "Balsamic Vinegar Spray",
        description:
          "Authentic Modena balsamic vinegar in a convenient spray bottle for effortless, even drizzling. Perfect for salads, grilled meats, and finishing touches.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Our Balsamic Vinegar Spray puts the rich, complex flavor of Modena balsamic vinegar at your fingertips. The fine mist spray delivers an even coating with minimal effort — ideal for salads, appetizers, and artful plating.",
        size: "8.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "caramel-balsamic-glaze-modena",
        name: "Caramel Balsamic Vinegar Glaze of Modena",
        description:
          "A luscious caramel-infused balsamic glaze with a sweet, buttery depth. An indulgent finishing touch for desserts, cheeses, and roasted meats.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Our Caramel Balsamic Glaze blends the rich complexity of Modena balsamic vinegar with smooth, buttery caramel for a luxuriously sweet drizzle. Stunning over vanilla gelato, aged cheeses, roasted pears, and grilled meats.",
        size: "8.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "raspberry-balsamic-glaze-modena",
        name: "Raspberry Balsamic Vinegar Glaze of Modena",
        description:
          "A fruity, tangy balsamic glaze infused with bright Italian raspberries. A vibrant finishing drizzle for salads, desserts, and cheese boards.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Our Raspberry Balsamic Glaze marries the depth of Modena balsamic with the bright, tangy sweetness of Italian raspberries. Its jewel-toned color and fruity character make it a stunning addition to salads, goat cheese, and fresh fruit.",
        size: "8.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "red-cooking-wine",
        name: "Red Cooking Wine",
        description:
          "Full-bodied Italian red cooking wine that adds depth and richness to sauces, braises, and stews. An essential ingredient in classic Italian recipes.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Our Red Cooking Wine is made from quality Italian grapes, selected for their ability to enhance savory dishes. It deglazes pans beautifully and adds complex, wine-rich flavor to ragùs, osso buco, and hearty sauces.",
        size: "16.9 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "white-cooking-wine",
        name: "White Cooking Wine",
        description:
          "A crisp Italian white cooking wine that brings brightness and acidity to seafood, risotto, and cream sauces. Light and aromatic.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Made from select Italian white grapes, our White Cooking Wine adds a clean, bright acidity to your cooking. Perfect for deglazing, steaming mussels, enriching risottos, and lightening cream-based sauces.",
        size: "16.9 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "organic-apple-cider-vinegar",
        name: "Organic Apple Cider Vinegar",
        description:
          "Organic, unfiltered apple cider vinegar with a tangy, crisp flavor. Made in Italy from premium organic apples.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Our Organic Apple Cider Vinegar is crafted from Italian organic apples using traditional fermentation. Its sharp, fruity acidity is ideal for salad dressings, marinades, and health-conscious recipes.",
        size: "16.9 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "red-wine-vinegar",
        name: "Red Wine Vinegar",
        description:
          "Bold and robust Italian red wine vinegar with a sharp, fruity character. A staple for vinaigrettes and Mediterranean cooking.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Fermented from quality Italian red wine, our Red Wine Vinegar brings a robust tang and deep ruby color to dressings, marinades, and sauces. An indispensable ingredient in any Italian pantry.",
        size: "16.9 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "white-wine-vinegar",
        name: "White Wine Vinegar",
        description:
          "Clean, bright Italian white wine vinegar with a subtle grape undertone. Ideal for light dressings, pickling, and delicate sauces.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Made from Italian white wine, this vinegar offers a clean, crisp acidity that complements seafood, salads, and lighter dishes. Its subtle flavor won't overpower delicate ingredients.",
        size: "16.9 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "lemon-juice-6oz",
        name: "Lemon Juice",
        description:
          "Pure squeezed lemon juice from sun-ripened Sicilian lemons. Bright, tart, and ready to add a burst of citrus to any dish.",
        image: "",
        categoryId: "olive-oil-vinegars",
        details:
          "Our Lemon Juice is pressed from the finest Sicilian lemons, capturing their vibrant acidity and fragrant zest. Keep it on hand for dressings, seafood, cocktails, and baking.",
        size: "6.7 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "lemon-juice-16oz",
        name: "Lemon Juice Large",
        description:
          "A larger bottle of pure Sicilian lemon juice for kitchens that can't get enough citrus. Same bright, authentic flavor in a value size.",
        image: "/assets/Peppers/730286.png",
        categoryId: "olive-oil-vinegars",
        details:
          "The larger format of our Sicilian Lemon Juice is perfect for avid cooks and entertainers. Pure, tart, and intensely flavorful — a versatile ingredient that brightens everything it touches.",
        size: "16.9 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "olives-condiments",
    name: "Olives & Condiments",
    slug: "olives-condiments",
    tagline: "Mediterranean Treasures",
    description:
      "Hand-picked Italian olives and authentic condiments that transform every dish into a Mediterranean masterpiece.",
    heroImage: "/assets/Olive/Tuscanini-Italian-Olive-Trio-Platter-730185.png",
    products: [
      {
        id: "pitted-green-castelvetrano",
        name: "Pitted Green Castelvetrano Olives",
        description:
          "Buttery, mild Castelvetrano olives from Sicily, carefully pitted for effortless snacking. Their bright green color and sweet flavor make them a crowd favorite.",
        image: "/assets/Olive/730190.png",
        categoryId: "olives-condiments",
        details:
          "Harvested in the Castelvetrano region of Sicily, these prized olives are known for their firm, meaty texture and distinctively mild, buttery taste. Pitted for convenience, they're perfect for antipasti platters, salads, and snacking.",
        size: "10.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "green-cerignola",
        name: "Green Cerignola Olives",
        description:
          "Large, plump Cerignola olives from Puglia with a crisp bite and subtly sweet flavor. A showstopper on any olive board.",
        image: "/assets/Olive/730191-PRIMARY-SHOT.png",
        categoryId: "olives-condiments",
        details:
          "Cerignola olives from Puglia are among the largest olive varieties in the world. Their firm flesh, mild brininess, and elegant appearance make them a favorite for entertaining and Italian appetizer spreads.",
        size: "10.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "pitted-kalamata",
        name: "Pitted Kalamata Olives",
        description:
          "Rich, fruity Kalamata olives with a deep purple hue, pitted for easy enjoyment. A classic Mediterranean staple with bold flavor.",
        image: "/assets/Olive/730192.png",
        categoryId: "olives-condiments",
        details:
          "Our Kalamata olives deliver an intense, wine-like fruitiness with a smooth, meaty texture. Pitted for convenience, they're ideal for Greek salads, pasta dishes, tapenade, and charcuterie boards.",
        size: "10.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sweet-sicilian-castelvetrano",
        name: "Sweet Sicilian Castelvetrano",
        description:
          "Generously sized Sicilian Castelvetrano olives in a larger jar, marinated for a sweeter, more complex flavor profile.",
        image: "/assets/Olive/Tuscanini-Sweet-Sicilian-Castelvetrano-Olives-730180.png",
        categoryId: "olives-condiments",
        details:
          "These sweet Sicilian Castelvetrano olives are gently marinated to enhance their natural buttery sweetness. The larger jar ensures you have plenty for gatherings, cooking, and everyday snacking.",
        size: "14.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "kalamata-olives-14oz",
        name: "Kalamata Olives",
        description:
          "Premium Kalamata olives in a larger jar, perfect for families and olive lovers. Deep, rich flavor with a satisfying meaty texture.",
        image: "/assets/Olive/Tuscanini-Kalamata-Olives-730181.png",
        categoryId: "olives-condiments",
        details:
          "Our larger Kalamata olive jar brings the bold, fruity character of these beloved olives to your table in generous quantity. Ideal for cooking, entertaining, or keeping stocked in your Mediterranean pantry.",
        size: "14.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "pitted-bella-italia-mix",
        name: "Pitted Bella Italia Mix Olives",
        description:
          "A colorful medley of premium Italian olive varieties, pitted and ready to enjoy. A taste of Italy in every handful.",
        image: "/assets/Olive/Tuscanini-Bella-Italia-Mix-Pitted-Olivs-730182.png",
        categoryId: "olives-condiments",
        details:
          "Our Bella Italia Mix brings together a curated selection of Italy's finest olive varieties in one convenient jar. Each olive is pitted for effortless enjoyment, making this mix perfect for antipasti, salads, and cocktail hour.",
        size: "7.8 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "pitted-olives-crushed-garlic",
        name: "Pitted Olives with Crushed Garlic",
        description:
          "Savory Italian olives marinated with crushed garlic for an irresistible flavor combination. Bold, aromatic, and ready to serve.",
        image: "/assets/Olive/730183 - Pitted Olives w-Crushed Garlic.jpg",
        categoryId: "olives-condiments",
        details:
          "Our pitted olives are infused with crushed Italian garlic, creating a deeply savory and aromatic snack. They add instant Mediterranean flair to pasta, pizza, and appetizer platters.",
        size: "8.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "cracked-marinated-olives",
        name: "Cracked Marinated Olives",
        description:
          "Traditional cracked olives marinated in herbs and olive oil. The cracking allows the marinade to penetrate for maximum flavor.",
        image: "/assets/Olive/730184 -Cracked Marinated Olives.jpg",
        categoryId: "olives-condiments",
        details:
          "Following an age-old Mediterranean technique, these olives are gently cracked before marinating in aromatic herbs and extra virgin olive oil. The result is a deeply flavorful olive that bursts with every bite.",
        size: "7.8 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "italian-olives-trio-platter",
        name: "Italian Olives Trio Platter",
        description:
          "Three varieties of premium Italian olives presented in an elegant divided platter. The perfect ready-to-serve appetizer for any occasion.",
        image: "/assets/Olive/Tuscanini-Italian-Olive-Trio-Platter-730185.png",
        categoryId: "olives-condiments",
        details:
          "Our Trio Platter features three distinct Italian olive varieties, each in its own compartment for a beautiful presentation. Simply open and serve for an instant, elegant appetizer that impresses every time.",
        size: "12.7 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spicy-pimiento-stuffed-olives",
        name: "Spicy Pimiento Stuffed Olives",
        description:
          "Plump Italian olives stuffed with fiery pimiento peppers for a spicy kick. A bold twist on the classic stuffed olive.",
        image: "/assets/Olive/Tuscanini-Spicy-Stuffed-Pimento-olives-8.5oz-730187.png",
        categoryId: "olives-condiments",
        details:
          "These Italian olives are hand-stuffed with spicy pimiento peppers, delivering a satisfying heat balanced by the olive's natural brininess. Perfect for martinis, appetizer boards, and adding punch to salads.",
        size: "8.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "calabrian-chili-peppers",
        name: "Calabrian Chili Peppers in Oil",
        description:
          "Fiery Calabrian chili peppers preserved in olive oil, bringing the bold heat of Southern Italy to your kitchen. Smoky, fruity, and intensely flavorful.",
        image: "/assets/Peppers/730438.png",
        categoryId: "olives-condiments",
        details:
          "Sourced from Calabria, the spice capital of Italy, these whole chili peppers are preserved in olive oil to maintain their vibrant heat and fruity complexity. Add them to pasta, pizza, sandwiches, and marinades for authentic Southern Italian fire.",
        size: "9.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chopped-calabrian-chili-peppers",
        name: "Chopped Calabrian Chili Peppers in Oil",
        description:
          "Finely chopped Calabrian chili peppers in olive oil, ready to stir into any dish for an instant burst of smoky heat.",
        image: "/assets/Peppers/730443.png",
        categoryId: "olives-condiments",
        details:
          "Pre-chopped for ultimate convenience, our Calabrian Chili Peppers in Oil deliver the same authentic Southern Italian heat in a ready-to-use format. Spoon them into sauces, spread on sandwiches, or mix into dips for effortless flavor.",
        size: "10.9 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sun-dried-tomatoes",
        name: "Sun Dried Tomatoes",
        description:
          "Intensely flavored Italian sun-dried tomatoes, plump and tender with concentrated sweetness. A Mediterranean pantry essential.",
        image: "",
        categoryId: "olives-condiments",
        details:
          "Our sun-dried tomatoes are slowly dried under the Italian sun to concentrate their natural sweetness and umami depth. Rehydrate them for pasta and salads, or enjoy them straight from the jar on antipasti platters.",
        size: "10.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "calabrian-chili-hot-pepper-jam",
        name: "Calabrian Chili Hot Pepper Jam",
        description:
          "A sweet and spicy jam made from Calabrian chili peppers, perfect for glazing, spreading, and pairing with cheese. Addictively delicious.",
        image: "",
        categoryId: "olives-condiments",
        details:
          "Our Hot Pepper Jam balances the smoky heat of Calabrian chilies with a touch of sweetness for a versatile condiment. Spread it on crostini with fresh cheese, glaze meats, or stir into sauces for a sweet-heat kick.",
        size: "4.59 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "capers-in-brine",
        name: "Capers in Brine",
        description:
          "Tiny, tangy Italian capers preserved in brine for a burst of Mediterranean flavor. A classic ingredient in Italian and French cuisine.",
        image: "",
        categoryId: "olives-condiments",
        details:
          "Our Capers in Brine are hand-picked in Italy and preserved in a delicate brine that maintains their firm texture and sharp, tangy flavor. Add them to pasta puttanesca, chicken piccata, salads, and smoked salmon for an authentic Mediterranean touch.",
        size: "4.59 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "original-pitted-olives-pouch",
        name: "Original Pitted Olives Pouch",
        description:
          "Convenient single-serve pouches of premium pitted Italian olives. A healthy, flavorful snack for on-the-go enjoyment.",
        image: "/assets/Olive/Pouches/olive_origin.jpg",
        categoryId: "olives-condiments",
        details:
          "Our Original Pitted Olives Pouches put premium Italian olives in a perfectly portioned, grab-and-go format. Each pouch is sealed for freshness, making them ideal for lunchboxes, travel, and healthy snacking anytime.",
        size: "1.06 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spicy-pitted-olives-pouch",
        name: "Spicy Pitted Olives Pouch",
        description:
          "Single-serve pouches of spicy seasoned Italian olives. Bold, fiery flavor in a convenient on-the-go format.",
        image: "/assets/Olive/Pouches/olive_spicy.jpg",
        categoryId: "olives-condiments",
        details:
          "Our Spicy Pitted Olives Pouches deliver a kick of heat in every bite. Premium Italian olives are seasoned with a fiery spice blend and packed in convenient single-serve pouches for bold snacking anywhere.",
        size: "1.06 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "garlic-pitted-olives-pouch",
        name: "Garlic Pitted Olives Pouch",
        description:
          "Single-serve pouches of garlic-seasoned Italian olives. Savory, aromatic, and perfectly portable.",
        image: "/assets/Olive/Pouches/olive_garlic.jpg",
        categoryId: "olives-condiments",
        details:
          "Our Garlic Pitted Olives Pouches combine premium Italian olives with the bold, savory flavor of garlic in convenient single-serve packs. A delicious, wholesome snack that satisfies on the go.",
        size: "1.06 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tomato-savory-jam",
        name: "Tomato Savory Jam",
        description:
          "A sweet and savory Italian jam made from ripe tomatoes. A versatile condiment that pairs beautifully with cheese, crostini, and grilled meats.",
        image: "",
        categoryId: "olives-condiments",
        details:
          "Our Tomato Savory Jam transforms ripe Italian tomatoes into a sophisticated sweet-savory spread. Its unique flavor profile makes it a standout accompaniment for aged cheeses, charcuterie boards, crostini, and grilled meats.",
        size: "12.17 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "truffle-ketchup",
        name: "Truffle Ketchup",
        description:
          "A gourmet twist on a classic condiment, blending ripe Italian tomatoes with luxurious black truffle. Elevates burgers, fries, and everything in between.",
        image: "",
        categoryId: "olives-condiments",
        details:
          "Our Truffle Ketchup combines the familiar tang of premium tomato ketchup with the earthy sophistication of Italian black truffles. It transforms everyday favorites into gourmet experiences — try it with fries, burgers, or as a dipping sauce.",
        size: "10 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "sauces-tomatoes",
    name: "Sauces & Tomato Products",
    slug: "sauces-tomatoes",
    tagline: "The Soul of Italian Cooking",
    description:
      "From our signature pasta sauces to premium canned tomatoes and concentrated paste, these are the building blocks of authentic Italian cuisine.",
    heroImage: "/assets/Sauces/Tuscanini Peeled Tomato Sauce Comp 4 copy.png",
    products: [
      {
        id: "traditional-pizza-sauce",
        name: "Traditional Pizza Sauce",
        description:
          "A classic Italian pizza sauce made from vine-ripened tomatoes with aromatic herbs and a touch of garlic. Ready to spread on your favorite dough.",
        image: "/assets/Sauces/730205 Traditional Pizza Sauce.jpg",
        categoryId: "sauces-tomatoes",
        details:
          "Our Traditional Pizza Sauce is slow-cooked from premium Italian tomatoes with oregano, basil, and garlic for an authentic pizzeria flavor. Its perfectly seasoned, spreadable consistency makes homemade pizza night effortless and delicious.",
        size: "24 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "napoletana-pasta-sauce",
        name: "Napoletana Pasta Sauce",
        description:
          "A rich, slow-simmered Neapolitan-style pasta sauce with the deep, sweet flavor of San Marzano-style tomatoes. The taste of Naples in every spoonful.",
        image: "/assets/Sauces/730206 Napoletana Pasta Sauce.jpg",
        categoryId: "sauces-tomatoes",
        details:
          "Inspired by the Napoletana tradition, this sauce is slow-cooked from ripe Italian tomatoes with onion, garlic, and fresh basil. Its robust flavor and silky texture coat pasta beautifully, making every weeknight dinner feel like Sunday supper in Naples.",
        size: "24 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "classic-marinara-sauce",
        name: "Classic Marinara Sauce",
        description:
          "A timeless Italian marinara made with ripe tomatoes, garlic, and fresh basil. Simple, pure, and bursting with flavor.",
        image: "/assets/Sauces/730207 Classic Marinara Sauce.jpg",
        categoryId: "sauces-tomatoes",
        details:
          "Our Classic Marinara captures the essence of Italian home cooking — ripe tomatoes, fragrant garlic, and fresh basil simmered to perfection. Its versatile flavor makes it ideal for pasta, dipping, layering in lasagna, and more.",
        size: "24 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "zesty-marinara-sauce",
        name: "Zesty Marinara Sauce",
        description:
          "Our classic marinara kicked up with a lively blend of spices and a hint of heat. Bold, vibrant, and full of character.",
        image: "/assets/Sauces/730208 Zesty Marinara Sauce.jpg",
        categoryId: "sauces-tomatoes",
        details:
          "For those who like a little fire, our Zesty Marinara adds red pepper flakes and extra garlic to our beloved marinara base. The result is a spirited sauce that brings excitement to pasta, eggplant parmigiana, and pizza alike.",
        size: "24 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tomato-sauce-box",
        name: "Tomato Sauce Box",
        description:
          "Smooth, strained Italian tomato sauce in a convenient carton. A versatile base for countless Italian recipes.",
        image: "/assets/Sauces/Tuscanini Tomato Sauce Carton_730210.png",
        categoryId: "sauces-tomatoes",
        details:
          "Our Tomato Sauce is made from ripe Italian tomatoes, strained to a smooth, pourable consistency. Packaged in a convenient carton, it's the perfect starting point for homemade pasta sauces, soups, and braises.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tomato-paste-tube",
        name: "Tomato Paste Tube",
        description:
          "Concentrated Italian tomato paste in a resealable tube for easy, waste-free use. Adds deep, rich tomato intensity to any dish.",
        image: "/assets/Sauces/Tuscanini Tomato Paste Tube_730211.png",
        categoryId: "sauces-tomatoes",
        details:
          "Our double-concentrated Tomato Paste is made from sun-ripened Italian tomatoes and packaged in a convenient squeezable tube. Use a small amount to build depth in sauces, stews, and soups — the resealable tube keeps the rest fresh.",
        size: "7.05 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "organic-tomato-paste-tube",
        name: "Organic Tomato Paste Tube",
        description:
          "Certified organic concentrated tomato paste made from Italian organic tomatoes. Pure, rich, and sustainably produced.",
        image: "",
        categoryId: "sauces-tomatoes",
        details:
          "Made exclusively from certified organic Italian tomatoes, our Organic Tomato Paste delivers the same deep, concentrated flavor with the assurance of organic farming practices. Squeezable tube format for zero waste.",
        size: "4.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tomato-paste-basil-tube",
        name: "Tomato Paste with Basil Tube",
        description:
          "Italian tomato paste infused with fragrant basil in a convenient tube. A shortcut to rich, herbaceous tomato flavor.",
        image: "",
        categoryId: "sauces-tomatoes",
        details:
          "Our Tomato Paste with Basil combines concentrated Italian tomatoes with aromatic fresh basil for an instant flavor boost. The squeezable tube makes it easy to add just the right amount to sauces, soups, and braises.",
        size: "4.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tomato-puree",
        name: "Tomato Puree",
        description:
          "Velvety smooth Italian tomato puree made from vine-ripened tomatoes. The ideal base for silky sauces and soups.",
        image: "",
        categoryId: "sauces-tomatoes",
        details:
          "Our Tomato Puree is crafted from premium Italian tomatoes, blended to a smooth, luscious consistency. It provides a clean tomato flavor and uniform texture that forms the perfect foundation for pasta sauces, bisques, and braised dishes.",
        size: "24.7 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "crushed-tomatoes-24oz",
        name: "Crushed Tomatoes 24.7oz",
        description:
          "Coarsely crushed Italian tomatoes with a hearty, rustic texture. Perfect for chunky sauces, chili, and baked dishes.",
        image: "/assets/Sauces/Tuscanini-Crushed-Tomatoes-730212.png",
        categoryId: "sauces-tomatoes",
        details:
          "Our Crushed Tomatoes are coarsely processed to retain a satisfying rustic texture with plenty of tomato flavor. They're the go-to choice for hearty pasta sauces, shakshuka, chili, and any recipe that benefits from chunky tomato goodness.",
        size: "24.7 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "diced-tomatoes-24oz",
        name: "Diced Tomatoes 24.3oz",
        description:
          "Uniformly diced Italian tomatoes that hold their shape in cooking. Ideal for sauces, stews, and casseroles.",
        image: "",
        categoryId: "sauces-tomatoes",
        details:
          "Our Diced Tomatoes are cut to a consistent size from ripe Italian tomatoes, ensuring even cooking and a pleasing texture in finished dishes. They're perfect for chunky sauces, soups, and Mediterranean-style stews.",
        size: "24.3 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "peeled-tomatoes",
        name: "Peeled Tomatoes",
        description:
          "Whole peeled Italian tomatoes, hand-selected for ripeness and packed at peak flavor. The gold standard for homemade sauces.",
        image: "",
        categoryId: "sauces-tomatoes",
        details:
          "Our Whole Peeled Tomatoes are carefully selected and peeled at the height of ripeness, preserving their sweet, vibrant flavor. Crush them by hand for a rustic sauce or blend them smooth — the choice is yours.",
        size: "14.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "diced-tomatoes-14oz",
        name: "Diced Tomatoes 14.1oz",
        description:
          "Perfectly diced Italian tomatoes in a convenient smaller can. Great for quick sauces, side dishes, and recipes that call for a measured amount.",
        image: "",
        categoryId: "sauces-tomatoes",
        details:
          "The smaller format of our Diced Tomatoes is ideal for quick weeknight meals, single-batch sauces, and recipes where you need just the right amount. Same premium Italian quality in a more compact size.",
        size: "14.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "whole-cherry-tomatoes",
        name: "Whole Cherry Tomatoes",
        description:
          "Sweet, whole Italian cherry tomatoes preserved at peak ripeness. Bursting with concentrated sweetness and bright acidity.",
        image: "",
        categoryId: "sauces-tomatoes",
        details:
          "Our Whole Cherry Tomatoes are picked at the peak of sweetness and packed whole to preserve their jewel-like shape and intense flavor. They're stunning in pasta, roasted in the oven, or tossed into quick pan sauces.",
        size: "14.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "crushed-tomatoes-14oz",
        name: "Crushed Tomatoes 14.1oz",
        description:
          "Rustic crushed Italian tomatoes in a handy smaller can. Perfect for personal-sized batches of sauce and quick meals.",
        image: "",
        categoryId: "sauces-tomatoes",
        details:
          "All the hearty, chunky goodness of our crushed tomatoes in a convenient smaller format. Ideal for quick pasta sauces for one or two, pizza topping, and recipes that don't require a full large can.",
        size: "14.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "tomato-juice",
        name: "Tomato Juice",
        description:
          "Pure Italian tomato juice made from sun-ripened tomatoes. Refreshing on its own or as a base for cocktails and cooking.",
        image: "",
        categoryId: "sauces-tomatoes",
        details:
          "Our Tomato Juice is pressed from premium Italian tomatoes for a pure, vibrant flavor. Enjoy it chilled as a refreshing beverage, use it as a base for Bloody Marys, or incorporate it into soups and sauces for added depth.",
        size: "33.8 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "seasonings-truffles",
    name: "Seasonings & Truffles",
    slug: "seasonings-truffles",
    tagline: "The Finishing Touch",
    description:
      "Premium Mediterranean sea salts, artisan spice grinders, and luxurious Italian truffle products to elevate every dish.",
    heroImage: "",
    products: [
      {
        id: "coarse-mediterranean-sea-salt",
        name: "Coarse Mediterranean Sea Salt",
        description:
          "Naturally harvested coarse sea salt from the Mediterranean, perfect for salt mills, finishing, and brining. Pure and mineral-rich.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Coarse Mediterranean Sea Salt is harvested from pristine Mediterranean waters using traditional methods. Its large, crunchy crystals dissolve slowly, making it ideal for grinding, roasting, and adding a satisfying crunch to finished dishes.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "fine-mediterranean-sea-salt",
        name: "Fine Mediterranean Sea Salt",
        description:
          "Finely ground Mediterranean sea salt for everyday cooking and baking. Dissolves quickly and seasons evenly.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Milled to a fine, free-flowing grain, our Fine Mediterranean Sea Salt is the everyday workhorse of any kitchen. It dissolves instantly and distributes evenly, making it perfect for seasoning during cooking and baking.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sea-salt-flakes",
        name: "Sea Salt Flakes",
        description:
          "Delicate, pyramid-shaped sea salt flakes that add a beautiful crunch and clean salinity as a finishing touch. A chef's favorite.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Sea Salt Flakes form naturally into delicate, crunchy pyramids that melt on the tongue with a burst of pure saltiness. Pinch them over steaks, chocolate, salads, and baked goods for an elevated finishing touch.",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "smoked-sea-salt-flakes",
        name: "Smoked Sea Salt Flakes",
        description:
          "Naturally smoked sea salt flakes with a deep, woodsy aroma. Adds instant smokiness and crunch to grilled meats, vegetables, and more.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Smoked Sea Salt Flakes are naturally smoked over wood to infuse each delicate crystal with a rich, smoky depth. Sprinkle them over grilled steaks, roasted vegetables, eggs, or even caramel for a sophisticated smoky finish.",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "kosher-salt-bulk",
        name: "Kosher Salt Bulk",
        description:
          "Premium Italian kosher salt in a generous three-pound bag. The versatile, all-purpose salt for serious home cooks and professionals.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Kosher Salt features large, flat crystals that are easy to pinch and distribute evenly. The three-pound bulk size ensures you always have plenty on hand for seasoning, brining, and preserving.",
        size: "3 lb",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "black-pepper-grinder",
        name: "Black Pepper Spice Grinder",
        description:
          "Whole black peppercorns in a convenient built-in grinder. Freshly ground pepper with bold, aromatic heat at the twist of a wrist.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Black Pepper Grinder is filled with premium whole peppercorns that release their bold, complex flavor only when freshly ground. The adjustable ceramic grinder lets you choose from coarse to fine for any dish.",
        size: "1.76 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "peppercorn-medley-grinder",
        name: "Peppercorn Medley Spice Grinder",
        description:
          "A colorful blend of black, white, green, and pink peppercorns in an easy-grind mill. Complex, layered pepper flavor for the adventurous cook.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Peppercorn Medley combines four distinct peppercorn varieties for a multidimensional pepper experience. Each color brings its own character — from the heat of black to the floral sweetness of pink — creating a sophisticated blend.",
        size: "1.41 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "garlic-chili-grinder",
        name: "Garlic & Chili Spice Grinder",
        description:
          "A fiery blend of dried garlic and chili in a handy grinder. Adds instant savory heat to pasta, pizza, and everything in between.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Garlic & Chili Grinder delivers a bold combination of pungent garlic and spicy chili flakes at the twist of a cap. Keep it at the table for a quick flavor boost on Italian dishes, grilled meats, and snacks.",
        size: "1.06 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "garlic-grinder",
        name: "Garlic Spice Grinder",
        description:
          "Pure dried garlic granules in a convenient grinder for quick, even garlic flavor. A time-saving kitchen essential.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Garlic Spice Grinder puts the savory depth of Italian garlic at your fingertips. The adjustable grinder produces everything from fine powder to coarse granules, making it perfect for rubs, dressings, and last-minute seasoning.",
        size: "1.76 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chili-pepper-grinder",
        name: "Chili Pepper Spice Grinder",
        description:
          "Dried Italian chili peppers in a built-in grinder for freshly ground heat whenever you need it. Vibrant, fruity spice with a lingering warmth.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Chili Pepper Grinder is packed with dried Italian chili peppers that release their vibrant, fruity heat when freshly ground. Perfect for adding a controlled kick to pasta, soups, and grilled dishes.",
        size: "1.06 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "italian-medley-grinder",
        name: "Italian Medley Spice Grinder",
        description:
          "A harmonious blend of classic Italian herbs and spices in a convenient grinder. Instant Italian seasoning with a fresh-ground difference.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Italian Medley Grinder combines the essential herbs and spices of Italian cuisine into one convenient mill. Freshly ground for maximum aroma and flavor, it's the shortcut to authentic Italian seasoning on any dish.",
        size: "0.56 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "truffle-salt",
        name: "Truffle Salt",
        description:
          "Premium sea salt blended with real Italian black truffle for an indulgent finishing salt. A pinch transforms any dish into something extraordinary.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Truffle Salt marries the clean minerality of Mediterranean sea salt with the intoxicating earthy aroma of Italian black truffles. Sprinkle it over eggs, fries, popcorn, pasta, and risotto for an instant touch of luxury.",
        size: "4.23 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "black-truffle-sauce",
        name: "Black Truffle Sauce",
        description:
          "A rich, savory sauce made from Italian black truffles and mushrooms. Stir into pasta, spread on crostini, or use as a luxurious condiment.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Black Truffle Sauce blends finely chopped Italian black truffles with mushrooms and olive oil for a deeply savory, umami-rich condiment. A spoonful elevates pasta, risotto, bruschetta, and grilled meats to gourmet status.",
        size: "6.35 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sliced-black-truffle",
        name: "Sliced Black Truffle",
        description:
          "Thinly sliced Italian black truffles preserved in their natural juices. An elegant garnish and ingredient for truffle lovers.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Sliced Black Truffles are carefully cut and preserved to maintain their delicate texture and intense earthy flavor. Lay them over pasta, risotto, eggs, or carpaccio for a stunning presentation and unforgettable taste.",
        size: "1.41 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "minced-black-truffle",
        name: "Minced Black Truffle",
        description:
          "Finely minced Italian black truffles, ready to fold into sauces, butters, and dressings. Pure truffle flavor in every spoonful.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Minced Black Truffle offers the full intensity of Italian truffles in a ready-to-use format. Mix into compound butters, cream sauces, vinaigrettes, and mashed potatoes for effortless truffle indulgence.",
        size: "2.82 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "large-black-truffle-sauce",
        name: "Large Black Truffle Sauce",
        description:
          "Our signature black truffle sauce in a generous professional-sized jar. Perfect for restaurants, caterers, and devoted truffle enthusiasts.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "The large format of our Black Truffle Sauce provides exceptional value for those who use truffle products regularly. Same artisan recipe with Italian black truffles, mushrooms, and olive oil — just more to love.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "large-sliced-black-truffle",
        name: "Large Sliced Black Truffle",
        description:
          "Premium sliced Italian black truffles in a large jar for professional kitchens and serious home cooks. Luxurious and versatile.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Large Sliced Black Truffle jar provides generous portions of thinly sliced Italian truffles, ideal for high-volume use in professional kitchens or for home cooks who entertain frequently.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "large-minced-black-truffle",
        name: "Large Minced Black Truffle",
        description:
          "Finely minced Italian black truffles in a large format jar. The ultimate pantry staple for truffle-obsessed cooks and professionals.",
        image: "",
        categoryId: "seasonings-truffles",
        details:
          "Our Large Minced Black Truffle jar is the choice of professional chefs and truffle aficionados who demand both quality and quantity. Fold it generously into sauces, risottos, and butters without worrying about running out.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "flour-baking",
    name: "Flour & Baking",
    slug: "flour-baking",
    tagline: "The Foundation of Italian Cooking",
    description:
      "Premium Italian flours crafted from the finest wheat, perfect for homemade pasta, bread, pizza, and pastry. From classic all-purpose to specialty spelt and high-gluten varieties.",
    heroImage: "/assets/Flour/High gluten TUSCANINI_2,27Kg_2501013_facing.png",
    products: [
      {
        id: "all-purpose-flour-2-2lb",
        name: "All Purpose Flour 2.2LB",
        description:
          "Finely milled Italian all-purpose flour, versatile for pasta, bread, pizza dough, and pastry. The essential foundation of authentic Italian cooking.",
        image: "/assets/Flour/730306.png",
        categoryId: "flour-baking",
        details:
          "Our All Purpose Flour is milled from premium Italian wheat to a fine, consistent texture ideal for a wide range of baking applications. Whether you are making fresh pasta, pizza dough, or classic Italian breads, this flour delivers authentic results every time.",
        size: "2.2 LB (1 kg)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "all-purpose-flour-1kg",
        name: "All Purpose Flour 1KG",
        description:
          "Classic Italian all-purpose flour in a generous 1KG bag. Perfect for everyday baking, from homemade pasta to rustic loaves.",
        image: "/assets/Flour/All purpose TUSCANINI_1Kg_2501011_facing.png",
        categoryId: "flour-baking",
        details:
          "A larger format of our premium Italian all-purpose flour, providing excellent value for frequent bakers. Its balanced protein content makes it suitable for pasta, pizza, focaccia, and a wide variety of traditional Italian recipes.",
        size: "1 KG (2.2 LB)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "high-gluten-flour-5lb",
        name: "High Gluten Flour 5LB",
        description:
          "High-protein Italian flour designed for artisan bread, chewy pizza crusts, and fresh pasta. Superior elasticity and structure for professional results.",
        image: "/assets/Flour/730307-Big.png",
        categoryId: "flour-baking",
        details:
          "Our High Gluten Flour is milled from hard durum wheat with a high protein content that creates exceptional dough elasticity and strength. Ideal for Neapolitan-style pizza, sourdough bread, bagels, and fresh pasta that holds its shape perfectly.",
        size: "5 LB",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "high-gluten-flour-2-27kg",
        name: "High Gluten Flour 2.27KG",
        description:
          "Professional-grade Italian high-gluten flour in a large 2.27KG format. The preferred choice for artisan bakers and serious home cooks.",
        image: "/assets/Flour/High gluten TUSCANINI_2,27Kg_2501013_facing.png",
        categoryId: "flour-baking",
        details:
          "The large-format version of our high-gluten flour, perfect for frequent bakers who demand professional-quality results. Its high protein content delivers superior dough strength and elasticity for pizzas, breads, and fresh pasta.",
        size: "2.27 KG (5 LB)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-white-flour-5lb",
        name: "Spelt White Flour 5LB",
        description:
          "Ancient grain spelt flour with a mild, nutty flavor and naturally lighter texture. A nutritious alternative for modern Italian baking.",
        image: "/assets/Flour/730308-Big.png",
        categoryId: "flour-baking",
        details:
          "Made from ancient spelt wheat, our White Spelt Flour offers a delicate nuttiness and slightly sweeter profile compared to conventional wheat flour. Rich in fiber and nutrients, it works beautifully in pasta, pizza, focaccia, and rustic breads with a wholesome twist.",
        size: "5 LB",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spelt-white-flour-2-27kg",
        name: "Spelt White Flour 2.27KG",
        description:
          "Premium Italian spelt flour in a large 2.27KG format, perfect for bakers who love the nutty complexity of ancient grains.",
        image: "/assets/Flour/Spelt TUSCANINI_2,27Kg_2501009_facing.png",
        categoryId: "flour-baking",
        details:
          "Our large-format White Spelt Flour brings the ancient grain goodness of spelt to your kitchen in generous quantity. With its mild, nutty flavor and excellent baking properties, it is the go-to choice for health-conscious bakers who do not want to sacrifice authenticity.",
        size: "2.27 KG (5 LB)",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
];
