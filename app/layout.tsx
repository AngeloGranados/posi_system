import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Posi System",
  description: "Sistema de gestión de ventas para negocios de comida rápida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
  
      </body>
    </html>
  );
}
