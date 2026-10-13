import Link from "next/link";
import { ArrowRight, BadgeCheck, Truck, ShieldCheck } from "lucide-react";
import { endpoints, unwrap } from "@/src/lib/api";
import type { Category, Product } from "@/src/lib/types";
import ProductGrid from "@/src/components/product-grid";
import { productImage } from "@/src/lib/utils";

export const dynamic = "force-dynamic";
async function getHomeData() {
  try {
    const [c, p] = await Promise.all([
      endpoints.categories(),
      endpoints.products("sort=newest&per_page=8"),
    ]);
    return {
      categories: unwrap<Category>(c),
      products: unwrap<Product>(p),
      error: "",
    };
  } catch (e) {
    return {
      categories: [],
      products: [],
      error: e instanceof Error ? e.message : "API-тай холбогдож чадсангүй.",
    };
  }
}
export default async function HomePage() {
  const { categories, products, error } = await getHomeData();
  return (
    <div className="container-shell">
      <section className="relative mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 px-6 py-12 text-white sm:mt-8 sm:px-12 sm:py-16 lg:px-16">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-indigo-100">
            <BadgeCheck size={14} /> Хялбар. Найдвартай. Нэг дор.
          </span>
          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Өдөр тутмын хэрэгцээ,
            <br />
            <span className="text-indigo-300">нэг дороос.</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-indigo-100 sm:text-base">
            Хайж буй бараагаа олоод, сагсандаа нэмээд, хэдхэн алхмаар
            захиалаарай.
          </p>
          <Link
            href="/products"
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-indigo-950 transition hover:bg-indigo-50"
          >
            Дэлгүүр хэсэх <ArrowRight size={17} />
          </Link>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[40px] border-white/5 sm:right-0 sm:h-96 sm:w-96"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-2xl"
        />
      </section>
      <section className="py-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-indigo-600">
              Ангиллаар хайх
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Бүтээгдэхүүний ангилал
            </h2>
          </div>
          <Link href="/products" className="text-sm font-bold text-indigo-600">
            Бүгдийг үзэх →
          </Link>
        </div>
        {categories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_id=${cat.id}`}
                className="group flex min-h-24 items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-soft"
              >
                <span className="font-bold text-slate-700 group-hover:text-indigo-600">
                  {cat.name}
                </span>
                <ArrowRight
                  size={16}
                  className="text-slate-300 group-hover:text-indigo-600"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            {error
              ? `Ангилал ачааллахад алдаа гарлаа: ${error}`
              : "Одоогоор ангилал алга."}
          </div>
        )}
      </section>
      <section className="pb-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-indigo-600">
              Шинээр нэмэгдсэн
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Шинэ бүтээгдэхүүн
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="text-sm font-bold text-indigo-600"
          >
            Бүх бараа →
          </Link>
        </div>
        {error && !products.length ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            <strong>API холболт амжилтгүй.</strong>
            <p className="mt-1">{error}</p>
            <p className="mt-2">
              API ажиллаж байгаа эсэх, .env тохиргоо болон endpoint-ийн response
              бүтцийг шалгана уу.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
      <section className="grid gap-3 py-8 sm:grid-cols-3">
        {[
          {
            icon: Truck,
            title: "Хүргэлтийн мэдээлэл",
            desc: "Checkout дээр хүргэлтийн хаягаа оруулна.",
          },
          {
            icon: ShieldCheck,
            title: "Аюулгүй хэрэглээ",
            desc: "Захиалгын мэдээлэл таны бүртгэлтэй холбоотой.",
          },
          {
            icon: BadgeCheck,
            title: "Ил тод захиалга",
            desc: "Захиалгын явцаа өөрийн бүртгэлээс харна.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon size={19} />
            </span>
            <div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-1 text-sm leading-5 text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
