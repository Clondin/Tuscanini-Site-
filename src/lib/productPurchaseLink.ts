import type { Product } from "../data/products";

const frozenCategoryIds = new Set(["pizza", "gelato", "bread-frozen-appetizers"]);

/** Amazon Associates tracking ID (kaycobrands-20, created October 14, 2026). Every amazon.com link carries it. */
export const AMAZON_ASSOCIATE_TAG = "kaycobrands-20";
const amazonStoreUrl = `https://www.amazon.com/stores/Tuscanini/page/63CC7208-7FF4-4C25-B5F7-CAC5D4CA1C9A?tag=${AMAZON_ASSOCIATE_TAG}`;

// Product -> ASIN of that exact product's live amazon.com listing (brand, product and size
// checked against the Amazon product page on October 14, 2026). Where Amazon only sells a
// multipack of the same item, that listing is used. Products with no clear match are absent.
const amazonProductAsins: Record<string, string> = {
  "spaghetti": "B089B6L5HH",
  "fettuccine": "B089B6QZ34",
  "penne": "B089LV833X",
  "rigatoni": "B089LDNV1X",
  "elbows": "B089LCPXQT",
  "fusilli": "B089MBXHZ1",
  "oven-ready-lasagna": "B089MBZ6X2",
  "cauliflower-gnocchi": "B097TY8MK3",
  "mini-gnocchi": "B097VRVDJD",
  "potato-gnocchi": "B0B92LHFMS",
  "gluten-free-potato-gnocchi": "B0B92R8KQN",
  "extra-light-olive-oil-1l": "B09WGLV4ZG",
  "extra-light-olive-oil-3l": "B0FNS5DKG9",
  "evoo-750ml": "B0BBSGJSPJ",
  "evoo-garlic-250ml": "B08WYDP8T9",
  "evoo-lemon-250ml": "B0937MM13K",
  "evoo-black-truffle-250ml": "B08ZJM9YGD",
  "balsamic-vinegar-modena-8oz": "B07H37H131",
  "balsamic-vinegar-modena-500ml": "B0BVXSXDP2",
  "balsamic-glaze-modena": "B07H36QS6J",
  "balsamic-vinegar-spray": "B0DVTCSLLD",
  "raspberry-balsamic-glaze-modena": "B0DTJG6W57",
  "organic-apple-cider-vinegar": "B07MD6C67X",
  "red-wine-vinegar": "B0CQKM249S",
  "white-wine-vinegar": "B0CQKLX69R",
  "red-cooking-wine": "B0B9ZBWLRK",
  "white-cooking-wine": "B0B7KKDHVF",
  "lemon-juice-6oz": "B09TQ662VM",
  "lemon-juice-16oz": "B09TQ5FP2J",
  "pitted-green-castelvetrano": "B09V1XGRS6",
  "green-cerignola": "B09V1XN6T1",
  "original-pitted-olives-pouch": "B0HK76VVM4",
  "spicy-pitted-olives-pouch": "B0D7WGS9S9",
  "garlic-pitted-olives-pouch": "B0D7WK8BXQ",
  "calabrian-chili-peppers": "B09V3KTQCS",
  "chopped-calabrian-chili-peppers": "B0DGHL64GC",
  "sun-dried-tomatoes": "B07DKF977N",
  "calabrian-chili-hot-pepper-jam": "B0CQXW8TC1",
  "capers-in-brine": "B0DXFYCZCD",
  "tomato-savory-jam": "B0CQXXZ4HJ",
  "traditional-pizza-sauce": "B0937LBVQJ",
  "napoletana-pasta-sauce": "B093HJ7T6X",
  "classic-marinara-sauce": "B093HLMMQ3",
  "zesty-marinara-sauce": "B093HG59JC",
  "tomato-sauce-box": "B07N1RSN2Y",
  "tomato-paste-tube": "B07KYWQ22X",
  "organic-tomato-paste-tube": "B09SGPXP37",
  "crushed-tomatoes-24oz": "B08P27XTD1",
  "whole-cherry-tomatoes": "B09SGSMP8K",
  "crushed-tomatoes-14oz": "B0H2BJBL6L",
  "tomato-juice": "B083JZJKM4",
  "coarse-mediterranean-sea-salt": "B07CLF9YRR",
  "fine-mediterranean-sea-salt": "B08B9J9H3J",
  "sea-salt-flakes": "B0CR1VTMPK",
  "smoked-sea-salt-flakes": "B0CR1TKSKK",
  "kosher-salt-bulk": "B0CWLRQKRD",
  "peppercorn-medley-grinder": "B0BY9PZF7J",
  "chili-pepper-grinder": "B0BXY9NMM7",
  "black-truffle-sauce": "B0C5JTLF4C",
  "sliced-black-truffle": "B0C5FXYFFG",
  "minced-black-truffle": "B0C5JVSG5X",
  "large-black-truffle-sauce": "B0C8QDH7KT",
  "all-purpose-flour-2-2lb": "B0FLZ52TXC",
  "high-gluten-flour-5lb": "B0FLZQTYFG",
  "spelt-white-flour-5lb": "B0FLZFRDTL",
  "basil-pesto": "B0FL8X3HJM",
  "sun-dried-tomato-pesto": "B0FL9DDLXJ",
  "roasted-chestnuts": "B0BLJP59QV",
  "apricot-fruit-spread-preserves": "B08B7XFGW7",
  "lemon-ginger-fruit-spread-preserves": "B0BGTSV8G4",
  "strawberry-fruit-spread-preserves": "B08B81GJ6M",
  "raspberry-fruit-spread-preserves": "B08B887537",
  "solid-light-tuna-olive-oil-chili-peppers-can": "B0C11BFGNR",
  "tuna-solid-light-water-can": "B08YZ7DNB4",
  "tuna-fillet-olive-oil-tall-jar": "B08VZ173KH",
  "tuna-ventresca-olive-oil-tall-jar": "B08VLX9GN6",
  "solid-light-tuna-olive-oil-chili-peppers-three-pack": "B0C2VT5YWH",
  "moscato-grape-juice": "B0C4VNBW57",
  "moscato-rose-juice": "B0CPNG8FTC",
  "sparkling-lemonade": "B0BQP8NYWS",
  "sparkling-blood-orange": "B07H41FXHL",
  "italian-cola": "B08JRT7SGY",
  "diet-cola": "B08LKH2YQ9",
  "sparkling-apple-cider": "B0DYHDP6F1",
  "sparkling-bianco-grape-juice": "B0DWTBGDS3",
  "chocolate-truffle-milk": "B0F1Z34DQQ",
  "chocolate-truffle-dark": "B0F1Z4CC7G",
  "chocolate-truffle-hazelnut": "B0F1Z5JZHL",
  "chocolate-truffle-pistachio": "B0GFCK4JFP",
  "assorted-chocolate-truffles-gift-box": "B0G7SQG3M7",
  "chocolate-bar-collection": "B0FR59Q965",
  "caramel-balsamic-glaze-modena": "B0DTJF76XX",
  "peeled-tomatoes": "B0DPGHS5BG",
  "spelt-sea-salt-crostini-crackers": "B0C5YDPHLN",
  "rosemary-grissini": "B0C5N8C6WH",
  "chocolate-gianduiotti": "B0FR5CB4LL",
};

export function getAmazonProductLink(product: Pick<Product, "id">) {
  const asin = amazonProductAsins[product.id];
  if (!asin) return null;
  return { asin, href: `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}` };
}

// Product-specific destinations go to the product's own Amazon listing. Shared destinations
// keep store/site labels so visitors know what the link will open.
export function getProductPurchaseLink(product: Pick<Product, "id" | "categoryId">) {
  const direct = getAmazonProductLink(product);
  if (direct) {
    return {
      href: direct.href,
      label: "Buy on Amazon",
      amazon: true,
      sponsored: true,
    };
  }

  if (frozenCategoryIds.has(product.categoryId)) {
    return {
      href: "https://tuscaninifoods.com",
      label: "Visit Tuscanini Foods",
      amazon: false,
      sponsored: false,
    };
  }

  return {
    href: amazonStoreUrl,
    label: "Visit our Amazon store",
    amazon: true,
    sponsored: true,
  };
}
