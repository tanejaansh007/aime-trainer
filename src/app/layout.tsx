import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AMCTrainer — AMC 8 Prep",
  description: "Adaptive AMC 8 practice with per-subject ELO ratings.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-slate-400 py-6">
          AMCTrainer · AMC 8 Prep
        </footer>
      </body>
    </html>
  );
}
