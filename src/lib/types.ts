export type Category = {
  id: number | string;
  name: string;
  slug?: string;
  image?: string | null;
  description?: string | null;
};
export type Tag = { id: number | string; name: string; slug?: string };
export type ProductImage = {
  url?: string;
  thumbnail?: string;
  preview?: string;
  image_url?: string;
};

export type Product = {
  id: number | string;
  name?: string;
  title?: string;
  slug?: string;
  description?: string | null;
  price?: number | string;
  sale_price?: number | string | null;

  image?: string | ProductImage | null;
  image_url?: string | null;
  images?: Array<string | ProductImage> | null;

  category?: Category | null;
  category_id?: number | string;
  tags?: Tag[];
  stock?: number | null;
  quantity?: number | null;

  [key: string]: unknown;
};
export type OrderItem = { product_id: number | string; quantity: number };
export type Order = {
  id: number | string;
  status?: string;
  total?: number | string;
  total_amount?: number | string;
  created_at?: string;
  items?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};
export type User = {
  id?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
};
export type ApiList<T> =
  | {
      data?: T[];
      items?: T[];
      results?: T[];
      meta?: Record<string, unknown>;
      links?: Record<string, unknown>;
    }
  | T[];
