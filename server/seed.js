/**
 * Bulk seed data for the ecommerce database.
 *
 * Run from the server folder:   node seed.js
 *
 * Replaces the contents of: users, categories, subcategories, products,
 * carts, orders, testimonials. Categories/subcategories/carts have no
 * timestamps in their schemas, so no createdAt is written for them.
 *
 * All product images reference files that already exist in server/uploads.
 *
 * Seeded logins (passwords are bcrypt-hashed for real):
 *   admin    / Admin@123   (admin)
 *   mohamed  / User@123    (user, 2 addresses, cart with a price-changed item)
 *   sara     / User@123    (user, 1 address, normal cart)
 *   omar     / User@123    (user, 2 addresses, none default)
 *   laila    / User@123    (user, BLOCKED - login is refused)
 *   karim    / User@123    (user, no addresses - checkout asks to add one)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

// ---------------------------------------------------------------------------
// ObjectIds (fixed so relationships stay stable between re-seeds)
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Cast fixed id strings to real ObjectIds: the native driver would otherwise
// store them as plain strings and User.findById(token.id) would never match.
// ---------------------------------------------------------------------------
const isHex24 = (s) => typeof s === "string" && /^[0-9a-f]{24}$/.test(s);
function castIds(value) {
  if (value instanceof mongoose.Types.ObjectId || value instanceof Date) return value;
  if (isHex24(value)) return new mongoose.Types.ObjectId(value);
  if (Array.isArray(value)) return value.map(castIds);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = castIds(v);
    return out;
  }
  return value;
}

const C = {
  electronics: "650a000000000000000000a1",
  fashion: "650a000000000000000000a2",
  home: "650a000000000000000000a3",
  sports: "650a000000000000000000a4",
  books: "650a000000000000000000a5",
  beauty: "650a000000000000000000a6",
  seasonal: "650a000000000000000000a7", // isActive: false (hidden from store)
  movies: "650a000000000000000000a8", // isDeleted: true
};

const S = {
  laptops: "650a000000000000000000b1",
  smartphones: "650a000000000000000000b2",
  audio: "650a000000000000000000b3",
  accessories: "650a000000000000000000b4",
  gaming: "650a000000000000000000c1", // isActive: false
  mens: "650a000000000000000000b5",
  womens: "650a000000000000000000b6",
  shoes: "650a000000000000000000b7",
  hats: "650a000000000000000000c2", // isDeleted: true
  cookware: "650a000000000000000000b8",
  furniture: "650a000000000000000000b9",
  fitness: "650a000000000000000000ba",
  outdoor: "650a000000000000000000bb",
  fiction: "650a000000000000000000bc",
  nonfiction: "650a000000000000000000bd",
  skincare: "650a000000000000000000be",
  fragrance: "650a000000000000000000bf",
};

const U = {
  admin: "650c000000000000000000a1",
  mohamed: "650c000000000000000000a2",
  sara: "650c000000000000000000a3",
  omar: "650c000000000000000000a4",
  laila: "650c000000000000000000a5",
  karim: "650c000000000000000000a6",
};

const pid = (n) => `650b000000000000000000${n}`;

// real files present in server/uploads
const IMAGES = [
  "1787497488433_Screenshot 2026-08-20 180147.png",
  "1787497488448_Screenshot 2026-08-17 201245.png",
  "1787497488452_Screenshot 2026-08-08 001532.png",
  "1787499373143_Screenshot 2026-08-20 180147.png",
  "1787499373177_Screenshot 2026-08-17 201245.png",
  "1787499373181_Screenshot 2026-08-08 001532.png",
  "1787499447069_Screenshot 2026-08-20 180147.png",
  "1787499447109_Screenshot 2026-08-17 201245.png",
  "1787499447118_Screenshot 2026-08-08 001532.png",
  "1787499996090_Screenshot 2026-08-19 170206.png",
  "1787499996101_Screenshot 2026-08-17 224018.png",
  "1787499996113_Screenshot 2026-08-05 211514.png",
  "1787514842987_Screenshot 2026-08-20 180147.png",
  "1787514843017_Screenshot 2026-08-17 201245.png",
  "1787514843022_Screenshot 2026-08-08 001532.png",
  "1787514847130_Screenshot 2026-08-20 180147.png",
  "1787514847146_Screenshot 2026-08-17 201245.png",
  "1787514847149_Screenshot 2026-08-08 001532.png",
];
const img = (i, count = 2) =>
  Array.from({ length: count }, (_, k) => IMAGES[(i + k) % IMAGES.length]);

// ---------------------------------------------------------------------------
// Seed documents
// ---------------------------------------------------------------------------
const categories = [
  { _id: C.electronics, name: "Electronics", slug: "electronics", isActive: true, isDeleted: false },
  { _id: C.fashion, name: "Fashion", slug: "fashion", isActive: true, isDeleted: false },
  { _id: C.home, name: "Home & Kitchen", slug: "home-kitchen", isActive: true, isDeleted: false },
  { _id: C.sports, name: "Sports", slug: "sports", isActive: true, isDeleted: false },
  { _id: C.books, name: "Books", slug: "books", isActive: true, isDeleted: false },
  { _id: C.beauty, name: "Beauty", slug: "beauty", isActive: true, isDeleted: false },
  { _id: C.seasonal, name: "Seasonal", slug: "seasonal", isActive: false, isDeleted: false },
  { _id: C.movies, name: "Movies", slug: "movies", isActive: true, isDeleted: true },
];

const subcategories = [
  { _id: S.laptops, name: "Laptops", slug: "laptops", category: C.electronics, isActive: true, isDeleted: false },
  { _id: S.smartphones, name: "Smartphones", slug: "smartphones", category: C.electronics, isActive: true, isDeleted: false },
  { _id: S.audio, name: "Audio", slug: "audio", category: C.electronics, isActive: true, isDeleted: false },
  { _id: S.accessories, name: "Accessories", slug: "accessories", category: C.electronics, isActive: true, isDeleted: false },
  { _id: S.gaming, name: "Gaming", slug: "gaming", category: C.electronics, isActive: false, isDeleted: false },
  { _id: S.mens, name: "Mens Clothing", slug: "mens-clothing", category: C.fashion, isActive: true, isDeleted: false },
  { _id: S.womens, name: "Womens Clothing", slug: "womens-clothing", category: C.fashion, isActive: true, isDeleted: false },
  { _id: S.shoes, name: "Shoes", slug: "shoes", category: C.fashion, isActive: true, isDeleted: false },
  { _id: S.hats, name: "Hats", slug: "hats", category: C.fashion, isActive: true, isDeleted: true },
  { _id: S.cookware, name: "Cookware", slug: "cookware", category: C.home, isActive: true, isDeleted: false },
  { _id: S.furniture, name: "Furniture", slug: "furniture", category: C.home, isActive: true, isDeleted: false },
  { _id: S.fitness, name: "Fitness", slug: "fitness", category: C.sports, isActive: true, isDeleted: false },
  { _id: S.outdoor, name: "Outdoor Gear", slug: "outdoor-gear", category: C.sports, isActive: true, isDeleted: false },
  { _id: S.fiction, name: "Fiction", slug: "fiction", category: C.books, isActive: true, isDeleted: false },
  { _id: S.nonfiction, name: "Non-Fiction", slug: "non-fiction", category: C.books, isActive: true, isDeleted: false },
  { _id: S.skincare, name: "Skincare", slug: "skincare", category: C.beauty, isActive: true, isDeleted: false },
  { _id: S.fragrance, name: "Fragrance", slug: "fragrance", category: C.beauty, isActive: true, isDeleted: false },
];

let imgIndex = 0;
function product(n, name, desc, price, stock, category, subCategory, opts = {}) {
  const doc = {
    _id: pid(n),
    name,
    desc,
    price,
    stock,
    images: img(imgIndex, opts.imageCount || 2),
    category,
    subCategory,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    isActive: opts.isActive !== undefined ? opts.isActive : true,
    isDeleted: opts.isDeleted !== undefined ? opts.isDeleted : false,
    isTopSale: !!opts.top,
    isNewArrival: !!opts.new,
    createdAt: opts.date || new Date("2026-08-01"),
    updatedAt: new Date("2026-08-20"),
  };
  imgIndex += opts.imageCount || 2;
  return doc;
}

const products = [
  // Electronics
  product("01", "UltraBook Pro 14", "Thin aluminium laptop with a 14-inch retina display, 16GB RAM and all-day battery life.", 42000, 15, C.electronics, [S.laptops], { top: true, imageCount: 3 }),
  product("02", "AirLite Laptop 13", "Lightweight 13-inch laptop for students, 512GB SSD and fast charging.", 27500, 8, C.electronics, [S.laptops], { new: true }),
  product("03", "Galaxy S24 Pro", "Flagship smartphone with a 120Hz AMOLED screen and triple camera system.", 31000, 20, C.electronics, [S.smartphones], { top: true }),
  product("04", "Pixel Neo 5G", "Compact 5G phone with clean software and an excellent night camera.", 24500, 3, C.electronics, [S.smartphones], { new: true }),
  product("05", "SoundCore Headphones", "Over-ear wireless headphones with active noise cancelling and 40h battery.", 3800, 25, C.electronics, [S.audio], { top: true }),
  product("06", "BassBuds Wireless Earbuds", "True wireless earbuds with deep bass and a pocket-size charging case.", 1500, 0, C.electronics, [S.audio]), // out of stock
  product("07", "USB-C Hub 7-in-1", "HDMI, ethernet and card readers over a single USB-C port.", 750, 40, C.electronics, [S.accessories]),
  product("08", "Mechanical Keyboard RGB", "Hot-swappable mechanical keyboard with per-key RGB lighting.", 2200, 2, C.electronics, [S.accessories], { top: true }), // low stock
  product("09", "ProGaming Mouse", "26000 DPI esports mouse with 8 programmable buttons.", 1800, 12, C.electronics, [S.gaming], { isActive: false }), // hidden
  // Fashion
  product("10", "Oversized Graphic Tee", "Relaxed fit tee with a printed graphic, 100% combed cotton.", 400, 30, C.fashion, [S.mens]),
  product("11", "Slim Fit Jeans", "Stretch denim jeans with a slim silhouette and five pockets.", 1200, 18, C.fashion, [S.mens], { top: true }),
  product("12", "Summer Floral Dress", "Light flowy midi dress with a floral print and adjustable straps.", 1500, 12, C.fashion, [S.womens], { new: true }),
  product("13", "Classic Denim Jacket", "Timeless denim jacket that works over any outfit.", 1900, 5, C.fashion, [S.womens]),
  product("14", "Running Shoes X1", "Cushioned running shoes with breathable mesh upper.", 2600, 10, C.fashion, [S.shoes], { top: true, new: true }),
  product("15", "Leather Formal Shoes", "Hand-stitched genuine leather oxfords for the office.", 3400, 2, C.fashion, [S.shoes]), // low stock
  product("16", "Vintage Baseball Cap", "Washed cotton cap with an embroidered logo.", 300, 20, C.fashion, [S.hats], { isDeleted: true }), // deleted
  // Home & Kitchen
  product("17", "Nonstick Pan Set 5pc", "Five-piece granite-coated pan set, safe for all stove types.", 2800, 14, C.home, [S.cookware], { top: true }),
  product("18", "Cast Iron Skillet", "Pre-seasoned 26cm cast iron skillet that lasts generations.", 950, 22, C.home, [S.cookware]),
  product("19", "Oak Coffee Table", "Solid oak table with a lower shelf, 110x60cm.", 7500, 4, C.home, [S.furniture]),
  product("20", "Ergo Office Chair", "Mesh-back office chair with lumbar support and 4D armrests.", 5200, 0, C.home, [S.furniture], { new: true }), // out of stock
  // Sports
  product("21", "Adjustable Dumbbell 20kg", "One dumbbell, fifteen weight settings from 2 to 20kg.", 4600, 9, C.sports, [S.fitness], { top: true }),
  product("22", "Yoga Mat Pro", "6mm non-slip TPE mat with alignment lines and carry strap.", 650, 35, C.sports, [S.fitness], { new: true }),
  product("23", "Camping Tent 4-Person", "Double-layer waterproof tent that pitches in ten minutes.", 5900, 6, C.sports, [S.outdoor]),
  product("24", "Trail Backpack 40L", "Rain-cover trekking backpack with ventilated back panel.", 2200, 3, C.sports, [S.outdoor], { top: true }), // low stock
  // Books
  product("25", "The Silent Patient", "The thriller about a woman who shoots her husband and never speaks again.", 350, 50, C.books, [S.fiction], { top: true }),
  product("26", "Deep Work", "Rules for focused success in a distracted world.", 420, 45, C.books, [S.nonfiction], { new: true }),
  product("27", "Atomic Habits", "An easy and proven way to build good habits and break bad ones.", 400, 60, C.books, [S.nonfiction], { top: true }),
  product("28", "Dune Messiah", "The second book of the Dune saga, continuing Paul's journey.", 380, 25, C.books, [S.fiction]),
  product("29", "Hidden Realm Trilogy", "Fantasy box set of all three Hidden Realm novels.", 900, 18, C.books, [S.fiction], { isActive: false }), // hidden
  // Beauty
  product("30", "Glow Serum Vitamin C", "Brightening vitamin C serum with hyaluronic acid, 30ml.", 890, 28, C.beauty, [S.skincare], { top: true, new: true }),
  product("31", "Night Repair Cream", "Regenerating night cream with ceramides and peptides.", 1150, 16, C.beauty, [S.skincare]),
  product("32", "Amber Oud Perfume", "Warm unisex eau de parfum with amber, oud and vanilla, 100ml.", 4800, 7, C.beauty, [S.fragrance], { top: true }),
];

// addresses carry explicit _id subdocuments (the app edits/deletes them by id)
const addresses = {
  mohamedHome: "650d000000000000000000d1",
  mohamedWork: "650d000000000000000000d2",
  saraHome: "650d000000000000000000d3",
  omarFlat: "650d000000000000000000d4",
  omarOffice: "650d000000000000000000d5",
  lailaHome: "650d000000000000000000d6",
};

async function buildUsers() {
  const adminHash = await bcrypt.hash("Admin@123", 12);
  const userHash = await bcrypt.hash("User@123", 12);
  return [
    {
      _id: U.admin,
      name: "admin",
      email: "admin@mystore.com",
      role: "admin",
      password: adminHash,
      gender: "male",
      addresses: [],
      isBlocked: false,
      createdAt: new Date("2026-05-01T10:00:00Z"),
      updatedAt: new Date("2026-05-01T10:00:00Z"),
    },
    {
      _id: U.mohamed,
      name: "mohamed",
      email: "mohamed@example.com",
      role: "user",
      password: userHash,
      gender: "male",
      addresses: [
        { _id: addresses.mohamedHome, title: "Home", street: "12 El Nasr St", city: "Cairo", area: "Nasr City", building: "7", floor: "3", apartment: "12", notes: "Ring the bell twice", isDefault: true },
        { _id: addresses.mohamedWork, title: "Work", street: "5 Smart Village", city: "Giza", area: "Sheikh Zayed", building: "B2", floor: "1", apartment: "", notes: "Reception desk", isDefault: false },
      ],
      isBlocked: false,
      createdAt: new Date("2026-05-02T12:00:00Z"),
      updatedAt: new Date("2026-06-01T09:00:00Z"),
    },
    {
      _id: U.sara,
      name: "sara",
      email: "sara@example.com",
      role: "user",
      password: userHash,
      gender: "female",
      addresses: [
        { _id: addresses.saraHome, title: "Home", street: "8 El Geish Rd", city: "Alexandria", area: "Sidi Gaber", building: "3", floor: "2", apartment: "8", notes: "", isDefault: true },
      ],
      isBlocked: false,
      createdAt: new Date("2026-05-10T14:30:00Z"),
      updatedAt: new Date("2026-05-10T14:30:00Z"),
    },
    {
      _id: U.omar,
      name: "omar",
      role: "user",
      password: userHash,
      gender: "male",
      addresses: [
        { _id: addresses.omarFlat, title: "Flat", street: "22 Tayaran St", city: "Cairo", area: "Heliopolis", building: "10", floor: "5", apartment: "3", notes: "", isDefault: false },
        { _id: addresses.omarOffice, title: "Office", street: "1 90th St", city: "Cairo", area: "New Cairo", building: "C12", floor: "G", apartment: "", notes: "Deliver before 5pm", isDefault: false },
      ],
      isBlocked: false,
      createdAt: new Date("2026-05-15T16:00:00Z"),
      updatedAt: new Date("2026-05-15T16:00:00Z"),
    },
    {
      _id: U.laila,
      name: "laila",
      email: "laila@example.com",
      role: "user",
      password: userHash,
      gender: "female",
      addresses: [
        { _id: addresses.lailaHome, title: "Home", street: "4 El Haram St", city: "Giza", area: "Dokki", building: "18", floor: "1", apartment: "4", notes: "", isDefault: true },
      ],
      isBlocked: true, // blocked by admin - login refused, cannot order
      createdAt: new Date("2026-06-01T11:00:00Z"),
      updatedAt: new Date("2026-08-10T08:00:00Z"),
    },
    {
      _id: U.karim,
      name: "karim",
      role: "user",
      password: userHash,
      gender: "male",
      addresses: [], // no addresses yet - checkout asks him to add one
      isBlocked: false,
      createdAt: new Date("2026-07-01T09:30:00Z"),
      updatedAt: new Date("2026-07-01T09:30:00Z"),
    },
  ];
}

const carts = [
  {
    _id: "650e000000000000000000c1",
    user: U.mohamed,
    items: [
      // price matches the current product price - normal item
      { _id: "650e000000000000000000c1a", product: pid("03"), quantity: 1, price: 31000, isPriceChanged: false },
      // price 3500 vs current 3800 - shows up in the "price changed" section
      { _id: "650e000000000000000000c1b", product: pid("05"), quantity: 2, price: 3500, isPriceChanged: true },
    ],
  },
  {
    _id: "650e000000000000000000c2",
    user: U.sara,
    items: [
      { _id: "650e000000000000000000c2a", product: pid("25"), quantity: 3, price: 350, isPriceChanged: false },
    ],
  },
];

const addr = (a) => ({
  title: a.title,
  street: a.street,
  city: a.city,
  area: a.area,
  building: a.building,
  floor: a.floor,
  apartment: a.apartment,
  notes: a.notes,
});

const orders = [
  { _id: "650f00000000000000000001", user: U.mohamed, products: [{ productId: pid("25"), quantity: 2, priceAtOrderTime: 350 }, { productId: pid("27"), quantity: 1, priceAtOrderTime: 400 }], totalPrice: 1100, address: addr({ title: "Home", street: "12 El Nasr St", city: "Cairo", area: "Nasr City", building: "7", floor: "3", apartment: "12", notes: "Ring the bell twice" }), status: "received", createdAt: new Date("2026-06-15T13:00:00Z"), updatedAt: new Date("2026-06-18T13:00:00Z") },
  { _id: "650f00000000000000000002", user: U.sara, products: [{ productId: pid("17"), quantity: 1, priceAtOrderTime: 2800 }], totalPrice: 2800, address: addr({ title: "Home", street: "8 El Geish Rd", city: "Alexandria", area: "Sidi Gaber", building: "3", floor: "2", apartment: "8", notes: "" }), status: "received", createdAt: new Date("2026-06-28T10:20:00Z"), updatedAt: new Date("2026-07-01T10:20:00Z") },
  { _id: "650f00000000000000000003", user: U.omar, products: [{ productId: pid("01"), quantity: 1, priceAtOrderTime: 42000 }], totalPrice: 42000, address: addr({ title: "Office", street: "1 90th St", city: "Cairo", area: "New Cairo", building: "C12", floor: "G", apartment: "", notes: "Deliver before 5pm" }), status: "shipped", createdAt: new Date("2026-07-05T15:45:00Z"), updatedAt: new Date("2026-07-07T09:00:00Z") },
  { _id: "650f00000000000000000004", user: U.sara, products: [{ productId: pid("10"), quantity: 3, priceAtOrderTime: 400 }, { productId: pid("12"), quantity: 1, priceAtOrderTime: 1500 }], totalPrice: 2700, address: addr({ title: "Home", street: "8 El Geish Rd", city: "Alexandria", area: "Sidi Gaber", building: "3", floor: "2", apartment: "8", notes: "" }), status: "in progress", createdAt: new Date("2026-07-19T11:10:00Z"), updatedAt: new Date("2026-07-19T11:10:00Z") },
  { _id: "650f00000000000000000005", user: U.mohamed, products: [{ productId: pid("23"), quantity: 1, priceAtOrderTime: 5900 }], totalPrice: 5900, address: addr({ title: "Home", street: "12 El Nasr St", city: "Cairo", area: "Nasr City", building: "7", floor: "3", apartment: "12", notes: "Ring the bell twice" }), status: "canceled by user", createdAt: new Date("2026-07-26T18:00:00Z"), updatedAt: new Date("2026-07-27T08:00:00Z") },
  { _id: "650f00000000000000000006", user: U.omar, products: [{ productId: pid("14"), quantity: 1, priceAtOrderTime: 2600 }, { productId: pid("08"), quantity: 1, priceAtOrderTime: 2200 }], totalPrice: 4800, address: addr({ title: "Flat", street: "22 Tayaran St", city: "Cairo", area: "Heliopolis", building: "10", floor: "5", apartment: "3", notes: "" }), status: "received", createdAt: new Date("2026-08-02T12:40:00Z"), updatedAt: new Date("2026-08-05T12:40:00Z") },
  { _id: "650f00000000000000000007", user: U.sara, products: [{ productId: pid("30"), quantity: 2, priceAtOrderTime: 890 }], totalPrice: 1780, address: addr({ title: "Home", street: "8 El Geish Rd", city: "Alexandria", area: "Sidi Gaber", building: "3", floor: "2", apartment: "8", notes: "" }), status: "pending", createdAt: new Date("2026-08-09T09:05:00Z"), updatedAt: new Date("2026-08-09T09:05:00Z") },
  { _id: "650f00000000000000000008", user: U.laila, products: [{ productId: pid("32"), quantity: 1, priceAtOrderTime: 4800 }, { productId: pid("31"), quantity: 1, priceAtOrderTime: 1150 }], totalPrice: 5950, address: addr({ title: "Home", street: "4 El Haram St", city: "Giza", area: "Dokki", building: "18", floor: "1", apartment: "4", notes: "" }), status: "received", createdAt: new Date("2026-08-16T17:30:00Z"), updatedAt: new Date("2026-08-19T17:30:00Z") },
  { _id: "650f00000000000000000009", user: U.mohamed, products: [{ productId: pid("03"), quantity: 1, priceAtOrderTime: 31000 }, { productId: pid("06"), quantity: 1, priceAtOrderTime: 1500 }], totalPrice: 32500, address: addr({ title: "Work", street: "5 Smart Village", city: "Giza", area: "Sheikh Zayed", building: "B2", floor: "1", apartment: "", notes: "Reception desk" }), status: "shipped", createdAt: new Date("2026-08-23T14:15:00Z"), updatedAt: new Date("2026-08-25T10:00:00Z") },
  { _id: "650f0000000000000000000a", user: U.karim, products: [{ productId: pid("21"), quantity: 1, priceAtOrderTime: 4600 }], totalPrice: 4600, address: addr({ title: "Old Apartment", street: "9 Corniche El Nil", city: "Cairo", area: "Maadi", building: "2", floor: "6", apartment: "21", notes: "" }), status: "canceled by admin", createdAt: new Date("2026-08-30T16:00:00Z"), updatedAt: new Date("2026-08-31T09:00:00Z") },
  { _id: "650f0000000000000000000b", user: U.omar, products: [{ productId: pid("04"), quantity: 1, priceAtOrderTime: 24500 }], totalPrice: 24500, address: addr({ title: "Flat", street: "22 Tayaran St", city: "Cairo", area: "Heliopolis", building: "10", floor: "5", apartment: "3", notes: "" }), status: "refunded", createdAt: new Date("2026-09-05T13:25:00Z"), updatedAt: new Date("2026-09-07T11:00:00Z") },
  { _id: "650f0000000000000000000c", user: U.sara, products: [{ productId: pid("25"), quantity: 2, priceAtOrderTime: 350 }, { productId: pid("26"), quantity: 1, priceAtOrderTime: 420 }], totalPrice: 1120, address: addr({ title: "Home", street: "8 El Geish Rd", city: "Alexandria", area: "Sidi Gaber", building: "3", floor: "2", apartment: "8", notes: "" }), status: "in progress", createdAt: new Date("2026-09-09T10:50:00Z"), updatedAt: new Date("2026-09-09T10:50:00Z") },
];

const testimonials = [
  { _id: "6510000000000000000000a1", name: "mohamed", message: "Ordered the UltraBook Pro and it arrived in two days, exactly as described. The price change confirmation step saved me from paying the old listed price by mistake.", isApproved: true, createdAt: new Date("2026-07-02T10:00:00Z"), updatedAt: new Date("2026-07-02T10:00:00Z") },
  { _id: "6510000000000000000000a2", name: "sara", message: "The book prices are the best I found online and packaging kept everything spotless.", isApproved: true, createdAt: new Date("2026-07-20T09:30:00Z"), updatedAt: new Date("2026-07-22T09:30:00Z") },
  { _id: "6510000000000000000000a3", name: "omar", message: "Being able to save two addresses and pick one at checkout is such a time saver.", isApproved: true, createdAt: new Date("2026-08-03T12:00:00Z"), updatedAt: new Date("2026-08-04T12:00:00Z") },
  { _id: "6510000000000000000000a4", name: "laila", message: "The skincare selection is small but carefully picked. The vitamin C serum is now a staple for me.", isApproved: true, createdAt: new Date("2026-08-11T15:00:00Z"), updatedAt: new Date("2026-08-12T15:00:00Z") },
  { _id: "6510000000000000000000a5", name: "hazem", message: "Guest cart carried over to my account the moment I logged in. Seamless.", isApproved: true, createdAt: new Date("2026-08-18T08:45:00Z"), updatedAt: new Date("2026-08-18T08:45:00Z") },
  { _id: "6510000000000000000000a6", name: "nadia", message: "Cancelled an order by mistake and support had it restored within the hour. Great experience overall.", isApproved: true, createdAt: new Date("2026-08-24T19:10:00Z"), updatedAt: new Date("2026-08-25T19:10:00Z") },
  { _id: "6510000000000000000000a7", name: "tamer", message: "Kitchen gear quality exceeded the price point. The cast iron skillet seasons beautifully.", isApproved: true, createdAt: new Date("2026-09-01T11:20:00Z"), updatedAt: new Date("2026-09-01T11:20:00Z") },
  { _id: "6510000000000000000000a8", name: "anonymous", message: "Waiting for approval - the checkout flow was straightforward and the totals matched my cart to the piastre.", isApproved: false, createdAt: new Date("2026-09-08T14:00:00Z"), updatedAt: new Date("2026-09-08T14:00:00Z") },
  { _id: "6510000000000000000000a9", name: "first-timer", message: "My first online order ever and it went through without a hitch. The order status updates were clear at every step.", isApproved: false, createdAt: new Date("2026-09-09T16:30:00Z"), updatedAt: new Date("2026-09-09T16:30:00Z") },
  { _id: "6510000000000000000000aa", name: "spammer", message: "Buy cheap watches now at my totally legit website!!!", isApproved: false, createdAt: new Date("2026-09-09T20:00:00Z"), updatedAt: new Date("2026-09-09T20:00:00Z") },
];

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
async function main() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  console.log(`Connected to ${MONGO_URI}`);

  const collections = ["users", "categories", "subcategories", "products", "carts", "orders", "testimonials"];
  for (const name of collections) {
    await db.dropCollection(name).catch(() => {}); // ignore "does not exist"
  }

  const users = await buildUsers();

  await db.collection("users").insertMany(users.map(castIds));
  await db.collection("categories").insertMany(categories.map(castIds));
  await db.collection("subcategories").insertMany(subcategories.map(castIds));
  await db.collection("products").insertMany(products.map(castIds));
  await db.collection("carts").insertMany(carts.map(castIds));
  await db.collection("orders").insertMany(orders.map(castIds));
  await db.collection("testimonials").insertMany(testimonials.map(castIds));

  console.log("Seeded:");
  for (const name of collections) {
    const count = await db.collection(name).countDocuments();
    console.log(`  ${name.padEnd(14)} ${count}`);
  }
  console.log("\nLogins (username / password):");
  console.log("  admin   / Admin@123  (admin)");
  console.log("  mohamed / User@123   (cart has a price-changed item)");
  console.log("  sara    / User@123");
  console.log("  omar    / User@123   (no default address)");
  console.log("  laila   / User@123   (blocked - login refused)");
  console.log("  karim   / User@123   (no addresses yet)");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
