"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  CATEGORIES,
  defaultQuery,
  fetchProducts,
  Product,
  SearchQuery,
  SORT_FIELDS,
} from "@/lib/products";

interface ProductExplorerClientProps {
  isLoggedIn?: boolean;
}

export default function ProductExplorerClient({ isLoggedIn }: ProductExplorerClientProps) {
  const [query, setQuery] = useState<SearchQuery>(defaultQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        setError(null);
        const data = await fetchProducts(query);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("เกิดข้อผิดพลาดที่ไม่ทราบ");
        }
      }
    });
  }, [query]);

  // ฟังก์ชันสำหรับปุ่มโหลดข้อมูล
  const handleReloadData = () => {
    startTransition(async () => {
      try {
        setError(null);
        const data = await fetchProducts(query);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
      }
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">ค้นหาสินค้า</h1>
        
        {/* แสดงปุ่มโหลดข้อมูลเฉพาะเมื่อเข้าสู่ระบบแล้ว */}
        {isLoggedIn && (
          <button
            onClick={handleReloadData}
            className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm bg-white"
          >
            โหลดข้อมูล
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="ค้นหาชื่อสินค้า..."
          value={query.q}
          onChange={(e) =>
            setQuery((prev) => ({
              ...prev,
              q: e.target.value,
              category: "",
            }))
          }
          className="border rounded-lg px-4 py-2 flex-1 shadow-sm"
        />

        <select
          value={query.category || ""}
          onChange={(e) =>
            setQuery((prev) => ({
              ...prev,
              category: e.target.value,
              q: "",
            }))
          }
          className="border rounded-lg px-4 py-2 shadow-sm"
        >
          <option value="">ทุกหมวดหมู่</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={query.sortBy}
          onChange={(e) =>
            setQuery((prev) => ({
              ...prev,
              sortBy: e.target.value as (typeof SORT_FIELDS)[number],
            }))
          }
          className="border rounded-lg px-4 py-2 shadow-sm"
        >
          <option value="title">เรียงตามชื่อ</option>
          <option value="price">เรียงตามราคา</option>
          <option value="stock">เรียงตามสต็อก</option>
        </select>

        <select
          value={query.limit}
          onChange={(e) =>
            setQuery((prev) => ({
              ...prev,
              limit: Number(e.target.value),
            }))
          }
          className="border rounded-lg px-4 py-2 shadow-sm"
        >
          <option value={10}>10 รายการ</option>
          <option value={20}>20 รายการ</option>
          <option value={30}>30 รายการ</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isPending && <p className="text-gray-500 mb-4">กำลังโหลดข้อมูล...</p>}

      <p className="text-sm text-gray-600 mb-4">พบสินค้าทั้งหมด {total} รายการ</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-sm flex flex-col justify-between bg-white"
          >
            <div>
              {product.thumbnail && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover rounded-md"
                    unoptimized
                  />
                </div>
              )}
              <h2 className="font-semibold text-lg mb-2 line-clamp-1">
                {product.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                หมวดหมู่: {product.category}
              </p>
            </div>
            <div>
              <p className="text-blue-600 font-bold text-lg mb-1">
                ฿{product.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mb-3">คงเหลือ: {product.stock}</p>

              {/* แสดงปุ่มแก้ไข/ลบ เฉพาะเมื่อผู้ใช้เข้าสู่ระบบแล้ว */}
              {isLoggedIn && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => alert(`แก้ไขสินค้า ID: ${product.id}`)}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium py-1.5 px-3 rounded transition"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => alert(`ลบสินค้า ID: ${product.id}`)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium py-1.5 px-3 rounded transition"
                  >
                    ลบ
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}