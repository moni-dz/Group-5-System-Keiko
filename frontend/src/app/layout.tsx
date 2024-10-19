import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { ViewTransitions } from "next-view-transitions";
import Providers from "./providers";

const gauPopMagic: NextFontWithVariable = localFont({
  src: "../public/GAU_pop_magic.woff2",
  display: "swap",
  variable: "--font-gau-pop-magic",
});

export const metadata: Metadata = {
  title: "Keiko",
  description: "CS121 Flashcards App",
};

interface RootProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootProps>) {
  return (
    <ViewTransitions>
      <html lang="en" className={gauPopMagic.variable}>
        <body className="antialiased">
          <main>
            <Providers>{children}</Providers>
          </main>
          <Toaster />
        </body>
      </html>
    </ViewTransitions>
  );
}
