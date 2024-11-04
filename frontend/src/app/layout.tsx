import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import localFont from "next/font/local";
import React, { Suspense } from "react";
import "./globals.css";
import Providers from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LoadingSkeleton } from "@/components/status";
import { ViewTransitions } from "next-view-transitions";

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
            <Providers>
              {children}
              <SpeedInsights />
            </Providers>
          </main>
          <Toaster />
        </body>
      </html>
    </ViewTransitions>
  );
}
