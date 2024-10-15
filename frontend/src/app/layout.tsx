import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import localFont from 'next/font/local'; const gauPopMagic = localFont({
  src: './GAU_pop_magic.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CS121 Flashcards App",
  description: "flashcards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="en" className={gauPopMagic.className}>      <body className="antialiased">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
