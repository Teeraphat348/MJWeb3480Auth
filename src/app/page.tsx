import { auth } from "@/auth";
import { AuthButtons } from "./auth-buttons";
import ProductExplorerClient from "./ProductExplorerClient";

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);
  const userName = session?.user?.name;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 relative">
      <div className="absolute top-6 right-6 md:right-10 z-10 flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100">
        <AuthButtons isLoggedIn={isLoggedIn} userName={userName} />
      </div>

      <div className="max-w-5xl mx-auto pt-4">
        <header className="mb-8 border-b border-emerald-100 pb-6">
          <h1 className="text-3xl font-extrabold text-emerald-800 tracking-tight">Product Explorer</h1>
          <p className="text-slate-500 mt-1">ระบบค้นหาและจัดการข้อมูลสินค้าออนไลน์</p>
        </header>

        {/* ส่ง prop isLoggedIn ไปให้ Client Component */}
        <ProductExplorerClient isLoggedIn={isLoggedIn} />
      </div>
    </main>
  );
}