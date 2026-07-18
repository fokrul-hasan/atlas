import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Serif_Bengali } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-bengali",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Fokrul Hasan",
  description: "Curious · Reader · Thinker — a personal library, not a portfolio.",
};

// Runs before paint so the page never flashes light mode before
// switching to the dark default.
const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'dark';
      document.body && document.body.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${notoBengali.variable}`}>
      <body data-theme="dark" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
