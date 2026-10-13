import type { Product } from "@/src/lib/types";
import ProductCard from "@/src/components/product-card";
export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length)
    return (
      <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="text-lg font-bold">Бараа олдсонгүй</div>
        <p className="mt-2 text-sm text-slate-500">
          Хайлтын үг эсвэл шүүлтүүрээ өөрчлөөд үзээрэй.
        </p>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
