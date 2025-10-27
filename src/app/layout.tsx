import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "HardWord Hex - Daily Word Puzzle Game | Play Free Online",
  description: "Play HardWord Hex - A challenging daily word puzzle game. Solve 2 unique word puzzles every day, build your winning streak, and master the Bulls & Cows guessing system. Free online word game for all ages.",
  keywords: "word puzzle, daily game, bulls and cows, word guessing, online puzzle, brain game, wordle alternative",
  authors: [{ name: "HardWord Hex" }],
  creator: "HardWord Hex",
  publisher: "HardWord Hex",
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HardWord Hex",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hardword-hex.com",
    siteName: "HardWord Hex",
    title: "HardWord Hex - Daily Word Puzzle Game",
    description: "Play daily word puzzles and build your winning streak with HardWord Hex",
    images: [
      {
        url: "https://hardword-hex.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "HardWord Hex - Daily Word Puzzle Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HardWord Hex - Daily Word Puzzle Game",
    description: "Challenge yourself with daily word puzzles and build your streak",
    creator: "@hardwordhex",
    images: ["https://hardword-hex.com/og-image.png"],
  },
  alternates: {
    canonical: "https://hardword-hex.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HardWord Hex",
    description: "A daily word puzzle game with Bulls & Cows guessing system",
    url: "https://hardword-hex.com",
    applicationCategory: "GameApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "HardWord Hex",
    },
  };

  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="HardWord Hex" />
        <meta name="application-name" content="HardWord Hex" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://hardword-hex.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
