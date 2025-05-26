// src/data/mockProducts.ts
import type { Product } from "../interfaces/Products"; // Ensure your interface path is correct

export const mockProducts: Product[] = [
  {
    id: 1, // Book
    name: "The Burden is Light",
    description:
      "An inspiring read that explores finding peace and strength in challenging times. A beautifully written piece for your collection.",
    price: 29.99,
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    category: "Books",
    stock: 10,
  },
  {
    id: 2, // Monitor
    name: "Sleek Computer Monitor",
    description:
      "Experience stunning visuals with this high-resolution widescreen monitor. Perfect for work, gaming, or entertainment.",
    price: 349.99,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    category: "Gadgets",
    stock: 20,
  },
  {
    id: 3, // T-Shirt
    name: "Classic Cotton T-Shirt",
    description:
      "A comfortable and stylish t-shirt made from 100% premium cotton. A versatile staple for any wardrobe.",
    price: 24.99,
    imageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",

    category: "Clothes",
    stock: 15,
  },
  {
    id: 4, // Sneakers
    name: "Dynamic Sports Sneakers",
    description:
      "Iconic style meets modern comfort. High-performance sneakers perfect for everyday wear and an active lifestyle.",
    price: 110.0,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    category: "Shoes",
    stock: 25,
  },
  {
    id: 5, // Jewelry
    name: "Elegant Gold Jewelry Set",
    description:
      "Add a touch of sophistication with this beautiful gold-plated necklace and matching earrings set. Ideal for special occasions.",
    price: 90.43,
    imageUrl:
      "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    // ALT URL for Jewelry (if above fails for you): "https://images.unsplash.com/photo-1599643477879-806f04573388?auto=format&fit=crop&w=600&q=80"
    category: "Jewellery",
    stock: 30,
  },
  {
    id: 6, // Mug
    name: "Artisan Ceramic Mug",
    description:
      "Enjoy your favorite beverage in this beautifully handcrafted ceramic mug. Unique design and comfortable grip.",
    price: 18.5,
    imageUrl:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
    // ALT URL for Mug (if above fails for you): "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80"
    category: "Homeware",
    stock: 40,
  },
];
