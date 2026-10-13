import type { Metadata } from "next";
import "./globals.css";
import Header from "@/src/components/header";
import Footer from "@/src/components/footer";
export const metadata: Metadata = {
  title: {
    default: "Sutainbuyant — Онлайн дэлгүүр",
    template: "%s | Sutainbuyant",
  },
  description: "Бараагаа хялбар хайж, сагсанд нэмээд найдвартай захиалаарай.",
  metadataBase: new URL("https://job.sutainbuyant.com"),
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body>
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
