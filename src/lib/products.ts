import { z } from "zod";

export const CATEGORIES = [
  "beauty", "fragrances", "furniture", "groceries",
  "home-decoration", "kitchen-accessories", "laptops",
  "mens-shirts", "mens-shoes", "mens-watches",
  "mobile-accessories", "motorcycle", "skin-care",
  "smartphones", "sports-accessories", "sunglasses",
  "tablets", "tops", "vehicle", "womens-bags",
  "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches",
] as const;

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(2, "กรุณากรอกชื่อสินค้า"),
  price: z.number({ error: "กรุณากรอกราคา" }).min(0, "ราคาต้องไม่ติดลบ"),
  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.enum(CATEGORIES, { error: "กรุณาเลือกหมวดหมู่" }),
  description: z.string().trim().optional(),
  image: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
});

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;

export const ProductDraftSchema = ProductSchema.omit({ id: true });
export type ProductDraft = z.infer<typeof ProductDraftSchema>;

const API_BASE = "https://dummyjson.com";

export const SORT_FIELDS = ["title", "price", "stock"] as const;

export const SearchQuerySchema = z.object({
  q: z.string().trim(),
  category: z.string().optional(),
  limit: z
    .number({ error: "กรุณากรอกจำนวนรายการ" })
    .int("จำนวนรายการต้องเป็นจำนวนเต็ม")
    .min(1, "อย่างน้อย 1 รายการ")
    .max(30, "ไม่เกิน 30 รายการ"),
  sortBy: z.enum(SORT_FIELDS),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const defaultQuery: SearchQuery = {
  q: "",
  category: "",
  limit: 10,
  sortBy: "title",
};

export function buildProductUrl(query: SearchQuery): string {
  const params = new URLSearchParams();
  params.set("q", query.q);
  params.set("limit", String(query.limit));
  params.set("sortBy", query.sortBy);
  params.set("order", "asc");

  if (query.category && query.category !== "") {
    return `${API_BASE}/products/category/${query.category}?${params.toString()}`;
  }

  return `${API_BASE}/products/search?${params.toString()}`;
}

export async function fetchProducts(
  query: SearchQuery
): Promise<ProductList> {
  const response = await fetch(buildProductUrl(query));

  if (!response.ok) {
    throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status} ${response.statusText} `);
  }

  const data = await response.json();
  const result = ProductListSchema.safeParse(data);

  if (!result.success) {
    throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
  }

  return result.data;
}

export type StoredProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const initialProducts: StoredProduct[] = [
  {
    id: "p001",
    name: "Mechanical Keyboard",
    price: 2590,
    description: "คีย์บอร์ด Mechanical สำหรับทำงานและเล่นเกม",
  },
  {
    id: "p002",
    name: "Wireless Mouse",
    price: 1290,
    description: "เมาส์ไร้สาย น้ำหนักเบา",
  },
  {
    id: "p003",
    name: "USB-C Hub",
    price: 1890,
    description: "USB-C Hub พร้อม HDMI และ Card Reader",
  },
];

declare global {
  var demoProducts: StoredProduct[] | undefined;
}

const storedProducts =
  globalThis.demoProducts ?? structuredClone(initialProducts);

if (process.env.NODE_ENV !== "production") {
  globalThis.demoProducts = storedProducts;
}

export function getProducts() {
  return storedProducts;
}

export function getProduct(id: string) {
  return storedProducts.find((product) => product.id === id);
}

export function updateProduct(
  id: string,
  values: Pick<StoredProduct, "name" | "price" | "description">,
) {
  const product = getProduct(id);
  if (!product) {
    throw new Error("Product not found");
  }
  product.name = values.name;
  product.price = values.price;
  product.description = values.description;
}

export function deleteProduct(id: string) {
  const index = storedProducts.findIndex((product) => product.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  storedProducts.splice(index, 1);
}