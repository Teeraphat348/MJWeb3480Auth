"use client";

import { useState, useEffect } from "react";
import { fetchProducts, SearchQuery, defaultQuery, SORT_FIELDS, CATEGORIES, ProductList, Product } from "@/lib/products";

interface ProductExplorerClientProps {
  isLoggedIn: boolean;
}

export default function ProductExplorerClient({ isLoggedIn }: ProductExplorerClientProps) {
  const [query, setQuery] = useState<SearchQuery>(defaultQuery);
  const [result, setResult] = useState<ProductList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: CATEGORIES[0] || "",
    price: 0,
    stock: 0,
    thumbnail: "",
  });

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, [query]);

  const handleOpenAdd = () => {
    setFormData({ title: "", category: CATEGORIES[0] || "", price: 0, stock: 0, thumbnail: "" });
    setSelectedProduct(null);
    setModalMode("add");
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail,
    });
    setModalMode("edit");
  };

  const handleOpenDelete = (product: Product) => {
    setSelectedProduct(product);
    setModalMode("delete");
  };

  const handleSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "add" && result) {
      const newProd: Product = { id: Date.now(), ...formData };
      setResult({ ...result, total: result.total + 1, products: [newProd, ...result.products] });
    } else if (modalMode === "edit" && selectedProduct && result) {
      setResult({
        ...result,
        products: result.products.map((p) => (p.id === selectedProduct.id ? { ...p, ...formData } : p)),
      });
    } else if (modalMode === "delete" && selectedProduct && result) {
      setResult({
        ...result,
        total: result.total - 1,
        products: result.products.filter((p) => p.id !== selectedProduct.id),
      });
    }
    setModalMode(null);
  };

  return (
    <div>
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-emerald-100 flex gap-4 mb-8 flex-wrap items-center justify-between">
        <div className="flex gap-4 flex-wrap items-center flex-1">
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า..."
            value={query.q}
            onChange={(e) => setQuery({ ...query, q: e.target.value })}
            className="flex-1 min-w-[200px] border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none focus:border-emerald-500"
          />
          <select
            value={query.category}
            onChange={(e) => setQuery({ ...query, category: e.target.value, q: "" })}
            className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none focus:border-emerald-500"
          >
            <option value="">ทุกหมวดหมู่</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={query.sortBy}
            onChange={(e) => setQuery({ ...query, sortBy: e.target.value as any })}
            className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none focus:border-emerald-500"
          >
            {SORT_FIELDS.map((field) => (
              <option key={field} value={field}>เรียงตาม: {field}</option>
            ))}
          </select>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl cursor-pointer"
          >
            {loading ? "กำลังโหลด..." : "โหลดข้อมูล"}
          </button>
        </div>

        {isLoggedIn && (
          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl cursor-pointer"
          >
            + เพิ่มสินค้า
          </button>
        )}
      </div>

      {loading && <div className="text-center py-12 text-emerald-700">กำลังโหลดข้อมูล...</div>}
      {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6">{error}</div>}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {result.products.map((product) => (
            <div key={product.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex gap-4 items-center">
                <img src={product.thumbnail} alt={product.title} className="w-24 h-24 object-cover rounded-xl bg-slate-100" />
                <div className="flex-1">
                  <h2 className="font-bold text-slate-800 line-clamp-1">{product.title}</h2>
                  <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                    {product.category}
                  </span>
                  <div className="flex justify-between items-end mt-3 pt-3 border-t border-slate-100">
                    <span className="text-emerald-600 font-bold text-lg">${product.price}</span>
                    <span className="text-slate-500 text-sm">คงเหลือ {product.stock} ชิ้น</span>
                  </div>
                </div>
              </div>

              {isLoggedIn && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button onClick={() => handleOpenEdit(product)} className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer">
                    แก้ไข
                  </button>
                  <button onClick={() => handleOpenDelete(product)} className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer">
                    ลบ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{modalMode === "add" ? "เพิ่มสินค้าใหม่" : "แก้ไขข้อมูลสินค้า"}</h2>
            <form onSubmit={handleSubmitAction} className="space-y-4">
              <input type="text" placeholder="ชื่อสินค้า" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border p-2.5 rounded-xl" />
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border p-2.5 rounded-xl">
                {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="ราคา" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full border p-2.5 rounded-xl" />
                <input type="number" placeholder="จำนวนคงเหลือ" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full border p-2.5 rounded-xl" />
              </div>
              <input type="text" placeholder="URL รูปภาพ" required value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} className="w-full border p-2.5 rounded-xl" />
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalMode(null)} className="px-4 py-2 bg-slate-100 rounded-xl cursor-pointer">ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-emerald-800 text-white rounded-xl cursor-pointer">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === "delete" && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-center">
            <h2 className="text-xl font-bold mb-2">ยืนยันการลบ</h2>
            <p className="text-sm text-slate-500 mb-6">คุณต้องการลบสินค้า <strong>{selectedProduct.title}</strong> ใช่หรือไม่?</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setModalMode(null)} className="px-4 py-2 bg-slate-100 rounded-xl cursor-pointer">ยกเลิก</button>
              <button onClick={handleSubmitAction} className="px-4 py-2 bg-rose-600 text-white rounded-xl cursor-pointer">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}