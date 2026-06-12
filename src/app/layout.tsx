import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { DevSettingsProvider } from "@/components/layout/DevSettings";
import {
  SHARE_IMAGE,
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_SHORT,
  SITE_PATH,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/metadata";

/** Brand rule: Inter, weight 400 only. */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_PATH || "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION_SHORT,
    type: "website",
    url: SITE_PATH || "/",
    images: [
      {
        url: SHARE_IMAGE.path,
        width: SHARE_IMAGE.width,
        height: SHARE_IMAGE.height,
        alt: SHARE_IMAGE.alt,
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION_SHORT,
    images: [SHARE_IMAGE.path],
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
