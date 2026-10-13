import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-shell py-8">
          <p className="text-sm text-slate-500">
            Бүтээгдэхүүн ачааллаж байна...
          </p>
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
