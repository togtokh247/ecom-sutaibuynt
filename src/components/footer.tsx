import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-shell grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <Link href="/" className="text-lg font-black">
            sutain<span className="text-indigo-600">buyant</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Өдөр тутмын хэрэгцээгээ нэг дороос. Хялбар хайлт, найдвартай
            захиалга, ойлгомжтой үйлчилгээ.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Дэлгүүр</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-500">
            <Link href="/products">Бүх бараа</Link>
            <Link href="/products?sort=newest">Шинэ бараа</Link>
            <Link href="/cart">Сагс</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Тусламж</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-500">
            <Link href="/orders">Миний захиалгууд</Link>
            <Link href="/profile">Профайл</Link>
            <p>Төлбөр: ₮ MNT</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Sutainbuyant. Бүх эрх хуулиар
        хамгаалагдсан.
      </div>
    </footer>
  );
}
