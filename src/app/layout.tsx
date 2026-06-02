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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f4eb" },
    { media: "(prefers-color-scheme: dark)", color: "#130f06" },
  ],
};

/* Set the theme before first paint to avoid a flash. Reads a saved choice,
   otherwise falls back to the OS preference. */
const noFlashTheme = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", saved || system);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
