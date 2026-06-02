import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/** Brand rule: Inter, weight 400 only. */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Listen Future Founder Program",
  description:
    "A cohort program for exceptional talent at the beginning of their founding journey. When anyone can build, knowing what to build is everything.",
  openGraph: {
    title: "Listen Future Founder Program",
    description:
      "A cohort program for exceptional talent at the beginning of their founding journey.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f4eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Light mode only for now. The dark tokens remain in globals.css and the
    // ThemeToggle component is kept, so dark mode can be re-enabled later.
    <html lang="en" className={inter.variable} data-theme="light">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
