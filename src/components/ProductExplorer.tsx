"use client";

import { useState, useEffect } from "react";
import { fetchProducts, SearchQuery, defaultQuery, SORT_FIELDS, CATEGORIES, ProductList } from "@/lib/products";

export default function ProductExplorerClient() {
  const [query, setQuery] = useState<SearchQuery>(defaultQuery);
  const [result, setResult] = useState<ProductList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts(query);
        setResult(data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [query]);

  return (
    <div>
      {/* ช่องค้นหาและตัวกรอง */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-emerald-100 flex gap-4 mb-8 flex-wrap items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า..."
            value={query.q}
            onChange={(e) => setQuery({ ...query, q: e.target.value })}
            className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none p-3 rounded-xl bg-slate-50/50 text-slate-800 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="w-full sm:w-auto min-w-[180px]">
          <select
            value={query.category}
            onChange={(e) => setQuery({ ...query, category: e.target.value, q: "" })}
            className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none p-3 rounded-xl bg-slate-50/50 text-slate-800 transition-all cursor-pointer"
          >
            <option value="">ทุกหมวดหมู่</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={query.sortBy}
            onChange={(e) => setQuery({ ...query, sortBy: e.target.value as any })}
            className="w-full sm:w-auto border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none p-3 rounded-xl bg-slate-50/50 text-slate-800 transition-all cursor-pointer"
          >
            {SORT_FIELDS.map((field) => (
              <option key={field} value={field}>
                เรียงตาม: {field}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="ml-3 text-emerald-700 font-medium">กำลังโหลดข้อมูล...</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {result && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium text-slate-500">
              พบสินค้าทั้งหมด <strong className="text-emerald-700">{result.total}</strong> รายการ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {result.products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex gap-4 items-center"
              >
                <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h2 className="font-bold text-base text-slate-800 line-clamp-1">{product.title}</h2>
                    </div>
                    <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex justify-between items-end mt-3 pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 block">ราคา</span>
                      <span className="text-emerald-600 font-bold text-lg">${product.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">คงเหลือ</span>
                      <span className="text-slate-700 font-medium text-sm">{product.stock} ชิ้น</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}