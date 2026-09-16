import { Category } from "./products";

export const mealCategories: Category[] = [
  {
    id: "pasta-gnocchi",
    name: "Pasta & Gnocchi",
    slug: "pasta-gnocchi",
    tagline: "Pasta shapes and gnocchi",
    description:
      "Spaghetti, penne, and other pasta shapes, plus potato and vegetable gnocchi. Compare dry, frozen, and gluten-free options.",
    heroImage: "/assets/ads/gnocchi-recipe.jpg",
    products: [
      {
        id: "spaghetti",
        name: "Spaghetti",
        description:
          "Bronze-cut spaghetti with a rough surface that holds sauce.",
        image: "/assets/Pasta/Tuscanini Bronze Cut Spaghetti Comp copy.png",
        categoryId: "pasta-gnocchi",
        details:
          "Bronze dies give this spaghetti a textured surface. The pasta is slow-dried.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "fettuccine",
        name: "Fettuccine",
        description:
          "Broad, flat ribbons of bronze-cut pasta for creamy or tomato-based sauces.",
        image: "/assets/Pasta/Tuscanini Bronze Cut Fettuccine Comp copy.png",
        categoryId: "pasta-gnocchi",
        details:
          "Wide pasta ribbons with a textured surface. Serve with Alfredo, Bolognese, or butter-based sauces.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "penne",
        name: "Penne",
        description:
          "Diagonally cut tubes with ridged surfaces that trap sauce inside and out. A versatile pasta for baked dishes and hearty sauces.",
        image: "/assets/Pasta/Tuscanini Bronze Cut Penne Rigate Comp copy.png",
        categoryId: "pasta-gnocchi",
        details:
          "Bronze-cut penne with ridges and angled ends. Use in pasta bakes, arrabbiata, or vegetable sauces.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rigatoni",
        name: "Rigatoni",
        description:
          "Large, ridged pasta tubes for chunky sauces and baked pasta dishes.",
        image: "/assets/Pasta/730323.png",
        categoryId: "pasta-gnocchi",
        details:
          "Wide tubes hold meat or vegetable sauces. Also suited to creamy pasta bakes.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "elbows",
        name: "Elbows",
        description:
          "Curved pasta tubes for mac and cheese, pasta salads, and soups.",
        image: "/assets/Pasta/730324.png",
        categoryId: "pasta-gnocchi",
        details:
          "Elbow-shaped pasta for creamy sauces, salads, or soup.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "fusilli",
        name: "Fusilli",
        description:
          "Corkscrew-shaped pasta for warm dishes or pasta salads.",
        image: "/assets/Pasta/Tuscanini Bronze Cut Fusili Comp copy.png",
        categoryId: "pasta-gnocchi",
        details:
          "The spirals hold sauce between their turns. Serve warm or in a cold pasta salad.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "oven-ready-lasagna",
        name: "Oven Ready Lasagna",
        description:
          "No-boil lasagna sheets ready to layer straight into the pan.",
        image: "/assets/Pasta/730326.png",
        categoryId: "pasta-gnocchi",
        details:
          "These lasagna sheets absorb moisture from the sauce while baking, so no separate boiling is needed.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "cauliflower-gnocchi",
        name: "Cauliflower Gnocchi",
        description:
          "Potato gnocchi made with cauliflower.",
        image: "/assets/Pasta/Tuscanini Cauliflower Gnocci Mockup.png",
        categoryId: "pasta-gnocchi",
        details:
          "Shelf-stable gnocchi made with potatoes and cauliflower. Follow the package directions for cooking.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "mini-gnocchi",
        name: "Mini Gnocchi",
        description:
          "Small potato gnocchi for soups, salads, and pan-cooked dishes.",
        image: "/assets/Gnocchi/Tuscanini-Mi-ni-Gnocchi-16oz-730312.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our Mini Gnocchi are small, tender potato dumplings crafted in Italy using traditional methods. Their petite size makes them ideal for adding hearty substance to soups, tossing into salads, or quickly sautéing with butter and sage.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "potato-gnocchi",
        name: "Potato Gnocchi",
        description:
          "Classic Italian potato gnocchi made with real potatoes for a soft, pillowy texture. A comforting staple ready in minutes.",
        image: "/assets/Pasta/Tuscanini Classic Gnocci Mockup.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our shelf-stable Potato Gnocchi are made with premium Italian potatoes and flour, delivering the same soft, melt-in-your-mouth texture as homemade. Simply boil until they float and toss with your favorite sauce for an authentic Italian meal.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "gluten-free-potato-gnocchi",
        name: "Gluten Free Potato Gnocchi",
        description:
          "Gluten-free potato gnocchi.",
        image: "/assets/Pasta/Tuscanini Gluten Free Gnocci Mockup.png",
        categoryId: "pasta-gnocchi",
        details:
          "Gnocchi made with potatoes and gluten-free flour. See the packaging for ingredients and cooking directions.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "pizza",
    name: "Pizza",
    slug: "pizza",
    tagline: "Frozen pizza",
    description:
      "Frozen pizzas in Margherita, cheese, mushroom, and other varieties, including the Reserve range.",
    heroImage: "/assets/ads/pizza-banner.jpg",
    products: [
      {
        id: "four-cheese-pizza",
        name: "Four Cheese Pizza",
        description:
          "A generous blend of four Italian cheeses melted over a crispy crust with savory tomato sauce. Rich, gooey, and irresistible.",
        image: "/assets/Pizza/730100.png",
        categoryId: "pizza",
        details:
          "Our Four Cheese Pizza layers mozzarella, fontina, gorgonzola, and Parmigiano-Reggiano over a perfectly baked Italian crust with traditional tomato sauce. Each slice delivers a harmonious medley of creamy, tangy, and sharp flavors.",
        size: "14.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "classico-margherita-pizza",
        name: "Classico Margherita Pizza",
        description:
          "The timeless Neapolitan classic with tomato sauce, fresh mozzarella, and fragrant basil on a golden crust.",
        image: "/assets/Pizza/730101.png",
        categoryId: "pizza",
        details:
          "Our Classico Margherita honors the original Neapolitan recipe with San Marzano-style tomato sauce, creamy mozzarella, and aromatic basil on a crispy Italian crust. Simple perfection that lets each premium ingredient shine.",
        size: "14.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "mushroom-pizza",
        name: "Mushroom Pizza",
        description:
          "Earthy, savory mushrooms scattered over melted mozzarella and rich tomato sauce. A pizza for mushroom lovers everywhere.",
        image: "/assets/Pizza/730102.png",
        categoryId: "pizza",
        details:
          "Our Mushroom Pizza features a generous topping of sliced mushrooms over mozzarella and Italian tomato sauce on a golden crust. The earthy depth of the mushrooms pairs beautifully with the tangy sauce for a satisfying vegetarian pizza.",
        size: "14.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "grilled-vegetable-pizza",
        name: "Grilled Vegetable Pizza",
        description:
          "A colorful medley of flame-grilled vegetables atop melted cheese and a crisp Italian crust. Garden-fresh flavor in every bite.",
        image: "/assets/Pizza/730103.png",
        categoryId: "pizza",
        details:
          "Our Grilled Vegetable Pizza showcases a vibrant mix of char-grilled peppers, zucchini, eggplant, and onions over mozzarella and tomato sauce. The smoky grilled flavor adds depth to this hearty vegetarian pizza crafted in Italy.",
        size: "15 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "personal-pie-thin-crust-pizza",
        name: "Personal Pie Thin Crust Pizza",
        description:
          "A perfectly portioned thin-crust pizza for one, with a satisfying crunch and classic Italian toppings.",
        image: "/assets/Pizza/730115.png",
        categoryId: "pizza",
        details:
          "Our Personal Pie Thin Crust Pizza delivers all the flavor of a full-sized pizza in a perfectly portioned individual serving. The ultra-thin, crispy crust is topped with tomato sauce and melted mozzarella for a quick and satisfying meal.",
        size: "8.3 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "bianca-white-thin-crust-pizza",
        name: "Bianca White Thin Crust Pizza",
        description:
          "A sauce-free thin crust pizza with creamy white cheeses and aromatic herbs. Elegant simplicity on a crispy base.",
        image: "/assets/Pizza/Tuscanini-Bianca-White-Pizza.png",
        categoryId: "pizza",
        details:
          "White pizza with a blend of cheeses and herbs on a thin crust, without tomato sauce.",
        size: "7.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "creamy-ricotta-cheddar-thin-crust-pizza",
        name: "Creamy Ricotta and Cheddar Thin Crust Pizza",
        description:
          "Thin-crust pizza with ricotta and cheddar.",
        image: "/assets/Pizza/Tuscanini-Creamy-ricotta.png",
        categoryId: "pizza",
        details:
          "Our Creamy Ricotta and Cheddar Thin Crust Pizza pairs velvety ricotta with melted cheddar on an ultra-thin, crispy Italian crust. The combination of mild creaminess and sharp tang creates a cheese lover's dream in every slice.",
        size: "8.5 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "reserve-margherita-pizza",
        name: "Reserve Margherita Pizza",
        description:
          "Margherita pizza with hand-stretched dough, tomato sauce, and mozzarella.",
        image: "/assets/Pizza/730126.png",
        categoryId: "pizza",
        details:
          "The Reserve Margherita has hand-stretched dough, San Marzano-style tomato sauce, and mozzarella.",
        size: "16.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "reserve-supermargherita-pizza",
        name: "Reserve Supermargherita Pizza",
        description:
          "Margherita pizza with extra mozzarella, cherry tomatoes, and basil.",
        image: "/assets/Pizza/730127.png",
        categoryId: "pizza",
        details:
          "The Reserve Supermargherita adds extra mozzarella, cherry tomatoes, and basil to hand-stretched dough and tomato sauce.",
        size: "17.28 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "mini-margherita-calzones",
        name: "Mini Margherita Calzones",
        description:
          "Bite-sized calzones stuffed with mozzarella and tomato sauce. Perfect as appetizers or a fun snack.",
        image: "/assets/Frozen/Mini Calzones/730128.png",
        categoryId: "pizza",
        details:
          "Our Mini Margherita Calzones wrap golden Italian dough around a filling of melted mozzarella and savory tomato sauce. These perfectly portioned pockets of pizza flavor are ideal for appetizers, parties, or anytime snacking.",
        size: "8.47 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "mini-mushroom-pizza-calzones",
        name: "Mini Mushroom Pizza Calzones",
        description:
          "Savory mini calzones filled with mushrooms, mozzarella, and rich tomato sauce. An earthy, cheesy handheld treat.",
        image: "/assets/Frozen/Mini Calzones/730129.png",
        categoryId: "pizza",
        details:
          "Our Mini Mushroom Pizza Calzones encase a delicious filling of sautéed mushrooms, melted mozzarella, and tomato sauce inside crispy Italian dough. These handheld bites bring all the flavors of a mushroom pizza in a fun, portable format.",
        size: "8.47 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "reserve-bbq-pulled-brisket-pizza",
        name: "Reserve BBQ Pulled Brisket Meat Pizza",
        description:
          "Tender pulled brisket with smoky BBQ sauce on hand-stretched dough. A bold fusion of Italian craft and American flavor.",
        image: "/assets/Pizza/730500.png",
        categoryId: "pizza",
        details:
          "Pulled brisket and smoky barbecue sauce on hand-stretched pizza dough.",
        size: "13.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "reserve-bbq-ground-beef-pizza",
        name: "Reserve BBQ Ground Beef Meat Pizza",
        description:
          "Seasoned ground beef with tangy BBQ sauce on hand-stretched dough. Hearty, smoky, and satisfying.",
        image: "/assets/Pizza/730501.png",
        categoryId: "pizza",
        details:
          "Our Reserve BBQ Ground Beef Pizza tops hand-stretched Italian dough with seasoned ground beef and a tangy BBQ sauce. The result is a hearty, flavor-packed pizza that combines Italian artistry with bold, smoky barbecue character.",
        size: "13.2 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "gelato",
    name: "Gelato & Sorbetto",
    slug: "gelato",
    tagline: "Gelato and sorbetto",
    description:
      "Italian gelato and sorbetto. See the available flavors and pack sizes below.",
    heroImage: "/assets/Gelato/730521-vanilla-gelato.png",
    products: [
      {
        id: "dairy-chocolate-gelato",
        name: "Dairy Chocolate Gelato",
        description:
          "Rich, velvety Italian chocolate gelato with an intense cocoa flavor. Creamier and denser than ordinary ice cream.",
        image: "/assets/Gelato/730520-chocolate-gelato.png",
        categoryId: "gelato",
        details:
          "Chocolate gelato made with cocoa. A smooth, creamy frozen dessert.",
        size: "1 pt",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "dairy-vanilla-gelato",
        name: "Dairy Vanilla Gelato",
        description:
          "Classic Italian vanilla gelato with a pure, creamy flavor and silky smooth texture. Simple elegance in every scoop.",
        image: "/assets/Gelato/730521-vanilla-gelato.png",
        categoryId: "gelato",
        details:
          "Our Dairy Vanilla Gelato showcases the beauty of simplicity, crafted with real vanilla and premium Italian dairy. The slow-churned process creates a dense, creamy texture that lets the warm, aromatic vanilla flavor take center stage.",
        size: "1 pt",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "dairy-hazelnut-gelato",
        name: "Dairy Hazelnut Gelato",
        description:
          "Luscious hazelnut gelato made with roasted Italian hazelnuts. A beloved flavor straight from the gelaterias of Piedmont.",
        image: "/assets/Gelato/730522-hazelnut-gelato.png",
        categoryId: "gelato",
        details:
          "Our Dairy Hazelnut Gelato celebrates the prized hazelnuts of Piedmont, roasted to perfection and blended into a luxuriously smooth, nutty gelato. Each scoop delivers the toasty, buttery richness that makes this flavor an Italian gelateria staple.",
        size: "1 pt",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "dairy-strawberry-banana-gelato",
        name: "Dairy Strawberry Banana Gelato",
        description:
          "A refreshing blend of sweet strawberries and ripe bananas in creamy Italian gelato. Bright, fruity, and irresistible.",
        image: "/assets/Gelato/730523-strawberry-banana-gelato.png",
        categoryId: "gelato",
        details:
          "Our Dairy Strawberry Banana Gelato combines the sweetness of ripe strawberries with the mellow creaminess of banana in a smooth, luscious gelato base. This fruity combination is crafted in Italy for a refreshing, naturally flavored frozen treat.",
        size: "1 pt",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "parve-vanilla-gelato",
        name: "Parve Vanilla Gelato",
        description:
          "Dairy-free vanilla gelato.",
        image: "/assets/Gelato/730531-vanilla-gelato-p.png",
        categoryId: "gelato",
        details:
          "Our Parve Vanilla Gelato delivers all the creamy, aromatic pleasure of traditional vanilla gelato without any dairy. Crafted in Italy with premium ingredients, it offers a luscious frozen dessert that fits seamlessly into dairy-free and parve meals.",
        size: "1 pt",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "parve-chocolate-gelato",
        name: "Parve Chocolate Gelato",
        description:
          "Dairy-free chocolate gelato with a rich cocoa flavor.",
        image: "/assets/Gelato/730530-chocolate-gelato-p.png",
        categoryId: "gelato",
        details:
          "Chocolate gelato made without dairy. See the packaging for ingredients and certification.",
        size: "1 pt",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "parve-lemon-sorbet",
        name: "Parve Lemon Sorbet",
        description:
          "Bright, tangy Italian lemon sorbetto made with real Sicilian lemons. A refreshing palate cleanser and dairy-free delight.",
        image: "/assets/Gelato/Sorbetto/730533-lemon-sorbetto.png",
        categoryId: "gelato",
        details:
          "Lemon sorbet made with Sicilian lemons. Serve on its own or between courses.",
        size: "1 pt",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "strawberry-sorbet",
        name: "Strawberry Sorbet",
        description:
          "A vibrant, fruity Italian strawberry sorbetto bursting with the flavor of sun-ripened strawberries. Naturally dairy-free and refreshingly sweet.",
        image: "/assets/Gelato/Sorbetto/730532-strawberry-sorbetto.png",
        categoryId: "gelato",
        details:
          "Our Strawberry Sorbet is crafted from ripe Italian strawberries for a naturally sweet, intensely fruity frozen treat. Dairy-free and refreshing, it captures the essence of summer in every scoop.",
        size: "1 pt",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "cheese",
    name: "Cheese",
    slug: "cheese",
    tagline: "Italian cheese",
    description:
      "Italian cheeses for cooking, grating, and serving. See individual products for varieties and pack sizes.",
    heroImage: "/assets/Parmesan Cheese/730170.png",
    products: [
      {
        id: "parmesan-cheese-wedge-5oz",
        name: "Parmesan Cheese Wedge 5.29oz",
        description:
          "A hand-cut wedge of authentic Italian Parmesan cheese, aged for rich, complex flavor. A timeless Italian staple for grating, shaving, and snacking.",
        image: "/assets/Parmesan Cheese/730170.png",
        categoryId: "cheese",
        details:
          "Our Parmesan Cheese Wedge is crafted in Italy using traditional methods, aged to develop a deep, nutty complexity and granular texture. Perfect for grating over pasta, shaving onto salads, or enjoying on its own with a drizzle of balsamic.",
        size: "5.29 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "parmesan-cheese-wedge-8oz",
        name: "Parmesan Cheese Wedge 8.8oz",
        description:
          "A generous wedge of premium Italian Parmesan cheese for families and cooking enthusiasts. Rich, nutty, and endlessly versatile.",
        image: "/assets/Parmesan Cheese/730171.png",
        categoryId: "cheese",
        details:
          "A larger Parmesan wedge for grating over pasta, risotto, and soup, or serving sliced.",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
];
