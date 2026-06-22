import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "../providers/providers";
import "../index.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "eManage - Hệ thống Quản lý Bán hàng",
  description: "Hệ thống quản lý bán hàng đa chi nhánh chuyên nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
