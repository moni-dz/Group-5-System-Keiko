import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

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
    <html lang="en">
      <body className="antialiased">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
