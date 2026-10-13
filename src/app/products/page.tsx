"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { endpoints, unwrap } from "@/src/lib/api";
import type { Category, Product, Tag } from "@/src/lib/types";
import ProductGrid from "@/src/components/product-grid";
import { errorMessage } from "@/src/lib/utils";
export default function ProductsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category_id") || "");
  const [tag, setTag] = useState(params.get("tag_id") || "");
  const [min, setMin] = useState(params.get("min_price") || "");
  const [max, setMax] = useState(params.get("max_price") || "");
  const [sort, setSort] = useState(params.get("sort") || "newest");
  const [page, setPage] = useState(Number(params.get("page") || 1));
  const [perPage] = useState(12);
  useEffect(() => {
    Promise.all([endpoints.categories(), endpoints.tags()])
      .then(([c, t]) => {
        setCategories(unwrap<Category>(c));
        setTags(unwrap<Tag>(t));
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const q = new URLSearchParams();
    if (search.trim()) q.set("search", search.trim());
    if (category) q.set("category_id", category);
    if (tag) q.set("tag_id", tag);
    if (min) q.set("min_price", min);
    if (max) q.set("max_price", max);
    q.set("sort", sort);
    q.set("page", String(page));
    q.set("per_page", String(perPage));
    router.replace(`/products?${q.toString()}`, { scroll: false });
    endpoints
      .products(q.toString())
      .then((r) => {
        if (active) setProducts(unwrap<Product>(r));
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [search, category, tag, min, max, sort, page, perPage, router]);
  function reset() {
    setSearch("");
    setCategory("");
    setTag("");
    setMin("");
    setMax("");
    setSort("newest");
    setPage(1);
  }
  return (
    <div className="container-shell py-8">
      <div className="mb-7">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-indigo-600">
          Каталог
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">
          Бүх бүтээгдэхүүн
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Хайлтаа нарийвчилж, өөрт хэрэгтэй бараагаа олоорой.
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-extrabold">Шүүлтүүр</h2>
            <SlidersHorizontal size={17} className="text-slate-400" />
          </div>
          <label className="form-label">
            Хайх
            <div className="relative w-full">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                name="search"
                className="field w-full !pl-10"
                placeholder="Бүтээгдэхүүн хайх..."
              />
            </div>
          </label>
          <label className="form-label mt-4">
            Ангилал
            <select
              className="field mt-1"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Бүх ангилал</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-label mt-4">
            Таг
            <select
              className="field mt-1"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Бүх таг</option>
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="form-label">
              Үнэ ₮-өөс
              <input
                className="field mt-1"
                inputMode="numeric"
                type="number"
                min="0"
                value={min}
                onChange={(e) => {
                  setMin(e.target.value);
                  setPage(1);
                }}
                placeholder="0"
              />
            </label>
            <label className="form-label">
              Үнэ ₮ хүртэл
              <input
                className="field mt-1"
                inputMode="numeric"
                type="number"
                min="0"
                value={max}
                onChange={(e) => {
                  setMax(e.target.value);
                  setPage(1);
                }}
                placeholder="Дээд"
              />
            </label>
          </div>
          <label className="form-label mt-4">
            Эрэмбэлэх
            <select
              className="field mt-1"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Шинэ нь эхэнд</option>
              <option value="price_asc">Үнэ: багаас их</option>
              <option value="price_desc">Үнэ: ихээс бага</option>
              <option value="name">Нэрээр</option>
            </select>
          </label>
          <button className="btn-secondary mt-4 w-full gap-2" onClick={reset}>
            <X size={16} /> Шүүлтүүр цэвэрлэх
          </button>
        </aside>
        <section>
          <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
            <span>
              {loading ? "Бараа ачааллаж байна..." : `${products.length} бараа`}
            </span>
            <span>Хуудас {page}</span>
          </div>
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
              {error}
              <button
                className="ml-3 font-bold underline"
                onClick={() => setPage(page)}
              >
                Дахин оролдох
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4">
                    <div className="skeleton h-4 rounded" />
                    <div className="skeleton mt-3 h-4 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
          <div className="mt-7 flex justify-center gap-2">
            <button
              disabled={page <= 1 || loading}
              className="btn-secondary disabled:opacity-40"
              onClick={() => {
                setPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Өмнөх
            </button>
            <span className="grid min-h-11 min-w-11 place-items-center rounded-xl bg-indigo-600 px-3 font-bold text-white">
              {page}
            </span>
            <button
              disabled={products.length < perPage || loading}
              className="btn-secondary disabled:opacity-40"
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Дараах
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
