import { Category, Product } from "./products";

export const mealCategories: Category[] = [
  {
    id: "pasta-gnocchi",
    name: "Pasta & Gnocchi",
    slug: "pasta-gnocchi",
    tagline: "Bronze-Cut Perfection",
    description:
      "Traditional Italian pasta, bronze-die cut and slow-dried for the perfect al dente texture, alongside authentic potato gnocchi in classic and modern varieties.",
    heroImage: "/assets/ads/gnocchi-recipe.jpg",
    products: [
      {
        id: "spaghetti",
        name: "Spaghetti",
        description:
          "Classic Italian spaghetti, bronze-die cut for a rough texture that clings beautifully to sauces. A timeless staple of the Italian table.",
        image: "/assets/Pasta/Tuscanini Bronze Cut Spaghetti Comp copy.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our Spaghetti is crafted using traditional bronze dies that create a rough, porous surface ideal for holding sauce. Slow-dried at low temperatures to preserve flavor and ensure the perfect al dente bite every time.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "fettuccine",
        name: "Fettuccine",
        description:
          "Broad, flat ribbons of bronze-cut pasta perfect for rich, creamy sauces. A cornerstone of Roman cuisine.",
        image: "/assets/Pasta/Tuscanini Bronze Cut Fettuccine Comp copy.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our Fettuccine features wide, elegant ribbons with a textured surface from bronze-die extrusion. Slow-dried to lock in authentic flavor, these noodles are the ideal partner for Alfredo, Bolognese, and butter-based sauces.",
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
          "Our Penne is bronze-die cut with distinctive ridges and angled ends that capture sauce in every bite. Slow-dried for superior texture, it excels in baked pasta dishes, arrabbiata, and chunky vegetable sauces.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "rigatoni",
        name: "Rigatoni",
        description:
          "Large ridged tubes built to hold the boldest sauces. A favorite for hearty, rustic Italian dishes.",
        image: "/assets/Pasta/730323.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our Rigatoni features wide, ridged tubes with a generous cavity that holds chunky meat sauces, creamy bakes, and robust vegetable ragus. Bronze-die cut and slow-dried for an authentic Italian texture that stands up to the heartiest preparations.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "elbows",
        name: "Elbows",
        description:
          "Curved, ridged pasta tubes perfect for mac and cheese, salads, and soups. A family-friendly Italian classic.",
        image: "/assets/Pasta/730324.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our Elbow pasta combines the beloved curved shape with the superior texture of bronze-die cutting. Slow-dried for the perfect bite, these elbows are ideal for creamy mac and cheese, pasta salads, and comforting soups.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "fusilli",
        name: "Fusilli",
        description:
          "Corkscrew-shaped pasta with a spiral design that captures sauce in every twist. Delightful in both hot and cold dishes.",
        image: "/assets/Pasta/Tuscanini Bronze Cut Fusili Comp copy.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our Fusilli features tightly wound spirals created with bronze dies for maximum sauce adhesion. Slow-dried to preserve its springy texture, this versatile shape is equally at home in warm pasta dishes and chilled summer salads.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "oven-ready-lasagna",
        name: "Oven Ready Lasagna",
        description:
          "No-boil lasagna sheets ready to layer straight into the pan. Perfectly thin and tender after baking.",
        image: "/assets/Pasta/730326.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our Oven Ready Lasagna sheets eliminate the boiling step without sacrificing quality. Made from premium Italian durum wheat and slow-dried, they absorb moisture from your sauce as they bake, emerging perfectly tender with an authentic homemade texture.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "cauliflower-gnocchi",
        name: "Cauliflower Gnocchi",
        description:
          "Light, pillowy gnocchi made with real cauliflower for a modern twist on the Italian classic. A delicious lower-carb alternative.",
        image: "/assets/Pasta/Tuscanini Cauliflower Gnocci Mockup.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our shelf-stable Cauliflower Gnocchi blends premium Italian potatoes with real cauliflower for a lighter take on traditional gnocchi. Each dumpling is soft and pillowy, ready to pan-fry, boil, or bake with your favorite sauce.",
        size: "16 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "mini-gnocchi",
        name: "Mini Gnocchi",
        description:
          "Petite potato gnocchi perfect for soups, salads, and quick sautés. Bite-sized comfort in every spoonful.",
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
          "All the pillowy goodness of traditional gnocchi, crafted without gluten. Made with real Italian potatoes for an inclusive Italian dining experience.",
        image: "/assets/Pasta/Tuscanini Gluten Free Gnocci Mockup.png",
        categoryId: "pasta-gnocchi",
        details:
          "Our Gluten Free Potato Gnocchi prove that dietary restrictions need not compromise flavor or texture. Made with premium Italian potatoes and gluten-free flour, these tender dumplings deliver the same authentic experience as our classic variety.",
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
    tagline: "Straight From the Italian Pizzeria",
    description:
      "Authentic Italian frozen pizzas crafted with premium ingredients, from classic Margherita to our exclusive Reserve collection with hand-stretched dough and San Marzano-style sauce.",
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
          "Our Bianca White Pizza skips the tomato sauce in favor of a luscious blend of creamy Italian cheeses on an ultra-thin, crispy crust. Finished with aromatic herbs, it is a sophisticated take on the classic white pizza tradition.",
        size: "7.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "creamy-ricotta-cheddar-thin-crust-pizza",
        name: "Creamy Ricotta and Cheddar Thin Crust Pizza",
        description:
          "A decadent thin crust pizza blending creamy ricotta with sharp cheddar for a rich, indulgent cheese experience.",
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
          "Our premium Margherita with hand-stretched dough, San Marzano-style sauce, and fresh mozzarella. The pinnacle of pizza perfection.",
        image: "/assets/Pizza/730126.png",
        categoryId: "pizza",
        details:
          "The Reserve Margherita elevates our classic with hand-stretched dough, premium San Marzano-style tomato sauce, and fresh Italian mozzarella. Every element is crafted to deliver an authentic Neapolitan pizzeria experience at home.",
        size: "16.2 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "reserve-supermargherita-pizza",
        name: "Reserve Supermargherita Pizza",
        description:
          "An elevated Margherita loaded with extra mozzarella, cherry tomatoes, and fresh basil on hand-stretched dough. Our most indulgent pizza.",
        image: "/assets/Pizza/730127.png",
        categoryId: "pizza",
        details:
          "The Reserve Supermargherita takes our beloved Margherita to new heights with an extra-generous layer of fresh mozzarella, sweet cherry tomatoes, and fragrant basil on hand-stretched dough with San Marzano-style sauce. A truly premium pizza experience.",
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
          "Our Reserve BBQ Pulled Brisket Pizza brings together slow-cooked, tender brisket and smoky BBQ sauce on our premium hand-stretched Italian dough. This bold creation marries Italian pizza craftsmanship with rich, smoky American barbecue flavors.",
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
    id: "frozen-meals",
    name: "Frozen & Ready Meals",
    slug: "frozen-meals",
    tagline: "Italian Comfort, Ready in Minutes",
    description:
      "From crispy breaded appetizers to hearty ready-to-eat pasta dishes, frozen gnocchi, and artisan ravioli — authentic Italian comfort food ready for your table in minutes.",
    heroImage: "/assets/Frozen/Mozzarella Sticks/730140.png",
    products: [
      {
        id: "breaded-mozzarella-sticks",
        name: "Breaded Mozzarella Sticks",
        description:
          "Golden, crispy breaded mozzarella sticks with a stretchy, melted cheese center. The ultimate crowd-pleasing appetizer.",
        image: "/assets/Frozen/Mozzarella Sticks/730140.png",
        categoryId: "frozen-meals",
        details:
          "Our Breaded Mozzarella Sticks feature creamy Italian mozzarella coated in seasoned breadcrumbs and fried to golden perfection. Bake or air-fry for a crispy outside and an irresistibly gooey, stretchy center.",
        size: "7 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "family-pack-breaded-mozzarella-sticks",
        name: "Family Pack Breaded Mozzarella Sticks",
        description:
          "Our beloved mozzarella sticks in a generous family-sized pack. Enough crispy, cheesy goodness for the whole table.",
        image: "/assets/Frozen/Mozzarella Sticks/730141.png",
        categoryId: "frozen-meals",
        details:
          "The Family Pack of our Breaded Mozzarella Sticks brings over twice as many golden, crispy cheese sticks to share. Perfect for game nights, parties, or whenever the family craves an authentic Italian appetizer.",
        size: "15 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "breaded-eggplant-cutlets",
        name: "Breaded Eggplant Cutlets",
        description:
          "Tender eggplant slices in a crispy Italian breadcrumb coating. A versatile vegetarian favorite ready to bake or fry.",
        image: "/assets/Frozen/Mozzarella Sticks/730142.png",
        categoryId: "frozen-meals",
        details:
          "Our Breaded Eggplant Cutlets take tender slices of eggplant and coat them in seasoned Italian breadcrumbs for a satisfying crunch. Serve as a side, stack into eggplant Parmesan, or enjoy on their own with marinara sauce.",
        size: "10 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "battered-zucchini-blossoms",
        name: "Battered Zucchini Blossoms",
        description:
          "Delicate zucchini blossoms in a light, crispy batter. A cherished Italian delicacy brought straight to your freezer.",
        image: "/assets/Zucchini Blossoms/730156-Zucchini-Battered-Blossoms.png",
        categoryId: "frozen-meals",
        details:
          "Our Battered Zucchini Blossoms capture one of Italy's most prized seasonal treats in a convenient frozen format. Each blossom is encased in a light, airy batter that fries to a delicate golden crisp, revealing the tender flower within.",
        size: "10 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "mac-and-cheese",
        name: "Mac and Cheese",
        description:
          "Creamy, cheesy Italian-style macaroni and cheese made with premium aged cheeses. Comfort food elevated to Italian standards.",
        image: "/assets/Frozen/Meals/730030.png",
        categoryId: "frozen-meals",
        details:
          "Our Mac and Cheese brings Italian flair to the ultimate comfort food, featuring tender pasta coated in a rich, velvety sauce of premium aged cheeses. Ready in minutes, it delivers the warmth and satisfaction of a homemade meal.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "truffle-mac-and-cheese",
        name: "Truffle Mac and Cheese",
        description:
          "Luxurious mac and cheese infused with real Italian truffle. An indulgent twist on the beloved classic.",
        image: "/assets/Frozen/Meals/730031.png",
        categoryId: "frozen-meals",
        details:
          "Our Truffle Mac and Cheese elevates the classic with the intoxicating aroma and earthy depth of real Italian truffle. Premium aged cheeses and tender pasta combine with truffle for a sophisticated, indulgent dish that is ready in minutes.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "fettuccini-alfredo",
        name: "Fettuccini Alfredo",
        description:
          "Silky fettuccine ribbons in a rich, buttery Alfredo sauce. A Roman classic ready to enjoy in minutes.",
        image: "/assets/Frozen/Meals/730032.png",
        categoryId: "frozen-meals",
        details:
          "Our Fettuccini Alfredo features broad pasta ribbons enveloped in a luxuriously creamy, buttery Alfredo sauce made with premium Italian cheeses. This beloved Roman dish is ready to heat and serve for an authentic Italian dining experience at home.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "lasagna",
        name: "Lasagna",
        description:
          "Layers of tender pasta, rich meat sauce, creamy béchamel, and melted cheese. A hearty Italian classic straight from Italy.",
        image: "/assets/Frozen/Meals/730033.png",
        categoryId: "frozen-meals",
        details:
          "Our Lasagna stacks layers of tender pasta sheets with savory sauce, velvety béchamel, and melted Italian cheeses. Crafted in Italy using traditional methods, it delivers the depth and comfort of a homemade Sunday lasagna in a convenient frozen format.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "cheese-tortelloni-mushroom-alfredo",
        name: "Cheese Tortelloni with Mushroom Alfredo",
        description:
          "Plump cheese-filled tortelloni in a rich mushroom Alfredo sauce. A decadent Italian pasta dish ready in minutes.",
        image: "/assets/Frozen/Meals/730034.png",
        categoryId: "frozen-meals",
        details:
          "Our Cheese Tortelloni with Mushroom Alfredo pairs tender, cheese-stuffed pasta pillows with a luscious sauce of sautéed mushrooms and creamy Alfredo. Each bite delivers a harmonious blend of earthy mushroom flavor and rich Italian cheese.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "spinach-tortelloni-basil-pesto",
        name: "Spinach Tortelloni with Basil Pesto",
        description:
          "Delicate spinach-filled tortelloni tossed in vibrant basil pesto. A fresh, herbaceous Italian meal ready to heat and serve.",
        image: "/assets/Frozen/Meals/730035.png",
        categoryId: "frozen-meals",
        details:
          "Our Spinach Tortelloni with Basil Pesto combines tender pasta filled with seasoned spinach and ricotta with a bright, aromatic basil pesto sauce. This vibrant dish brings the fresh flavors of the Italian garden to your table in minutes.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "frozen-potato-gnocchi",
        name: "Frozen Potato Gnocchi",
        description:
          "Soft, pillowy frozen potato gnocchi ready to cook straight from the freezer. Authentic Italian comfort at its simplest.",
        image: "/assets/Pasta/Tuscanini Classic Gnocci Mockup.png",
        categoryId: "frozen-meals",
        details:
          "Our Frozen Potato Gnocchi are flash-frozen at peak freshness to preserve their soft, cloud-like texture. Made with real Italian potatoes, they cook in minutes from frozen and pair beautifully with any sauce from pesto to marinara.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "frozen-gluten-free-potato-gnocchi",
        name: "Frozen Gluten Free Potato Gnocchi",
        description:
          "Gluten-free frozen gnocchi with the same tender, pillowy texture as the original. Inclusive Italian comfort food.",
        image: "/assets/Pasta/Tuscanini Gluten Free Gnocci Mockup.png",
        categoryId: "frozen-meals",
        details:
          "Our Frozen Gluten Free Potato Gnocchi deliver the same cloud-like softness as our classic variety, crafted without gluten so everyone can enjoy authentic Italian gnocchi. Flash-frozen for convenience and ready to cook in minutes.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "frozen-potato-gnocchi-spinach",
        name: "Frozen Potato Gnocchi with Spinach",
        description:
          "Tender potato gnocchi blended with vibrant spinach for added flavor and color. A nutritious twist on the Italian classic.",
        image: "/assets/Pasta/Tuscanini Spinach Gnocci Mockup.png",
        categoryId: "frozen-meals",
        details:
          "Our Frozen Potato Gnocchi with Spinach fold real spinach into our classic potato dough, adding a mild, earthy flavor and beautiful green hue. Flash-frozen for freshness, they are a delicious way to add greens to your Italian meals.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "frozen-cauliflower-gnocchi",
        name: "Frozen Cauliflower Gnocchi",
        description:
          "Light and tender frozen cauliflower gnocchi for a lower-carb Italian indulgence. Ready to cook from frozen.",
        image: "/assets/Pasta/Tuscanini Cauliflower Gnocci Mockup.png",
        categoryId: "frozen-meals",
        details:
          "Our Frozen Cauliflower Gnocchi blend real cauliflower with potato for a lighter take on traditional gnocchi. Flash-frozen to lock in freshness and flavor, they offer a delicious way to enjoy Italian comfort food with fewer carbs.",
        size: "17.6 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "cheese-ravioli",
        name: "Cheese Ravioli",
        description:
          "Classic Italian ravioli generously filled with a blend of premium Italian cheeses. A beloved pasta tradition in every bite.",
        image: "/assets/Frozen/Ravioli/730061.png",
        categoryId: "frozen-meals",
        details:
          "Our Cheese Ravioli feature delicate pasta parcels stuffed with a rich blend of Italian cheeses including ricotta and Parmigiano-Reggiano. Flash-frozen to preserve freshness, they cook to tender perfection in just minutes.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "ricotta-spinach-ravioli",
        name: "Ricotta & Spinach Ravioli",
        description:
          "Tender ravioli filled with creamy ricotta and fresh spinach. A classic Italian combination that never goes out of style.",
        image: "/assets/Frozen/Ravioli/730062.png",
        categoryId: "frozen-meals",
        details:
          "Our Ricotta & Spinach Ravioli pair silky ricotta cheese with tender spinach in delicate pasta pockets. This timeless Italian filling delivers a perfect balance of creamy richness and fresh, earthy greens in every bite.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "mushroom-ravioli",
        name: "Mushroom Ravioli",
        description:
          "Ravioli stuffed with a savory blend of Italian mushrooms for deep, earthy flavor. A gourmet treat ready in minutes.",
        image: "/assets/Frozen/Ravioli/730063.png",
        categoryId: "frozen-meals",
        details:
          "Our Mushroom Ravioli encase a rich, savory filling of blended Italian mushrooms in thin, tender pasta. The deep, earthy umami flavor of the mushrooms makes these ravioli a sophisticated meal with minimal effort.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "pizza-ravioli",
        name: "Pizza Ravioli",
        description:
          "Fun, pizza-flavored ravioli filled with mozzarella and tomato sauce. All the joy of pizza wrapped in pasta.",
        image: "/assets/Frozen/Ravioli/730064.png",
        categoryId: "frozen-meals",
        details:
          "Our Pizza Ravioli bring the beloved flavors of Italian pizza into a fun ravioli format. Each pasta pocket is filled with melty mozzarella and zesty tomato sauce, delivering a playful fusion that kids and adults alike will love.",
        size: "12 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "gelato",
    name: "Gelato & Sorbetto",
    slug: "gelato",
    tagline: "Artisan Italian Frozen Desserts",
    description:
      "Authentic Italian gelato and sorbetto crafted with traditional methods. Creamier than ice cream, richer in flavor, and made with premium Italian ingredients.",
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
          "Our Dairy Chocolate Gelato is crafted using traditional Italian methods with premium cocoa for a deeply rich, velvety smooth chocolate experience. Churned slowly with less air than ice cream, it delivers an intensely flavorful and luxuriously creamy dessert.",
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
          "Dairy-free vanilla gelato with the same creamy richness as our dairy version. A parve indulgence for everyone to enjoy.",
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
          "Rich, dairy-free Italian chocolate gelato with an intense cocoa flavor. All the indulgence of traditional gelato in a parve format.",
        image: "/assets/Gelato/730530-chocolate-gelato-p.png",
        categoryId: "gelato",
        details:
          "Our Parve Chocolate Gelato delivers a deeply rich, velvety chocolate experience without any dairy. Crafted in Italy with premium cocoa, it offers a luscious frozen dessert that fits seamlessly into dairy-free and parve meals.",
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
          "Our Parve Lemon Sorbet captures the vibrant zest of Sicilian lemons in a smooth, refreshing frozen treat. Naturally dairy-free and light, it serves as a perfect palate cleanser between courses or a bright, guilt-free dessert on its own.",
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
    tagline: "Authentic Italian Fromage",
    description:
      "Premium Italian cheeses crafted with centuries of tradition. From aged Parmigiano to fresh varieties, our cheese collection brings the dairy artistry of Italy to your table.",
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
          "The larger format of our Parmesan Cheese Wedge ensures you always have this essential Italian ingredient on hand. Aged in Italy for a deep, complex flavor that elevates pasta, risotto, soups, and charcuterie boards.",
        size: "8.8 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
];
