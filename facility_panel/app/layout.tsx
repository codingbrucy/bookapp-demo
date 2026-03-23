import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import { FacilityDataProvider } from "@/lib/FacilityContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import Navbar from "@/components/Navbar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "contigoU — Facility Dashboard",
  description: "Sunrise Recovery Center Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${nunito.variable} antialiased`}>
        <ThemeProvider>
          <FacilityDataProvider>
            <Navbar />
            {children}
          </FacilityDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
