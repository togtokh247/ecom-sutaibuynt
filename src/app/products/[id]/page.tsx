import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { endpoints, one } from "@/src/lib/api";
import type { Product } from "@/src/lib/types";
import { money, productImage, productName, productPrice } from "@/src/lib/utils";
import ProductPurchase from "./purchase";
import ProductGrid from "@/src/components/product-grid";
export const dynamic = "force-dynamic";
async function loadProduct(id: string) {
  try {
    const raw = await endpoints.product(id);
    return { product: one<Product>(raw, "product"), raw };
  } catch {
    return { product: null, raw: null };
  }
}
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { product } = await loadProduct(params.id);
  if (!product) return { title: "Бүтээгдэхүүн олдсонгүй" };
  return {
    title: productName(product),
    description: String(
      product.description ||
        `${productName(product)} бүтээгдэхүүний дэлгэрэнгүй мэдээлэл.`
    ),
    openGraph: {
      title: productName(product),
      description: String(product.description || ""),
      images: productImage(product) ? [productImage(product)] : [],
    },
  };
}
export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const { product, raw } = await loadProduct(params.id);
  if (!product || !product.id) notFound();
  const related: Product[] = Array.isArray(raw?.related)
    ? raw.related
    : Array.isArray(raw?.data?.related)
    ? raw.data.related
    : [];
  const image = productImage(product);
  return (
    <div className="container-shell py-8">
      <div className="mb-5 text-sm text-slate-500">
        <Link href="/">Нүүр</Link> / <Link href="/products">Бараа</Link> /{" "}
        <span className="text-slate-800">{productName(product)}</span>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          {image ? (
            <img
              src={image}
              alt={productName(product)}
              className="aspect-square w-full object-contain p-5"
            />
          ) : (
            <div className="grid aspect-square place-items-center text-slate-400">
              Зураг алга
            </div>
          )}
        </div>
        <div className="self-center">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-indigo-600">
            Бүтээгдэхүүний дэлгэрэнгүй
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {productName(product)}
          </h1>
          <p className="mt-4 text-3xl font-black text-slate-950">
            {money(productPrice(product))}
          </p>
          {product.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
              {String(product.description)}
            </p>
          )}
          {product.category?.name && (
            <p className="mt-4 text-sm text-slate-500">
              Ангилал:{" "}
              <span className="font-bold text-slate-800">
                {product.category.name}
              </span>
            </p>
          )}
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span
                  key={t.id}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}
          <ProductPurchase product={product} />
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Үнэ болон захиалгын боломжийг серверийн хариугаар баталгаажуулна.
          </p>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-black">Төстэй бүтээгдэхүүн</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
