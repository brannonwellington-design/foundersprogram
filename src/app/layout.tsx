import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { DevSettingsProvider } from "@/components/layout/DevSettings";

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
    <html lang="en" className={inter.variable} data-theme="light" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`}
        </Script>
      </head>
      <body>
        <DevSettingsProvider>
          <div id="app-root">
            <SmoothScroll>{children}</SmoothScroll>
          </div>
        </DevSettingsProvider>
      </body>
    </html>
  );
}
