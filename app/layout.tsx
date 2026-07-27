import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestão Jurídica",
  description: "Sistema de gestão de clientes e processos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-gray-100">
        <div className="flex">
          <Sidebar />
          <main className="lg:ml-64 flex-1 min-h-screen w-full pt-14 lg:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}