import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shagun – Wedding Gifting & Memories Platform",
  description: "A warm, respectful wedding gifting and memories platform for modern Indian weddings. Send blessings, contribute to milestone dreams via UPI, and capture moments with our venue disposable camera.",
  keywords: ["wedding gifts", "shagun", "indian wedding", "upi shagun", "wedding disposable camera", "wedding registry india"],
};

export const viewport: Viewport = {
  themeColor: "#881337",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ivory-100 text-gray-900 font-sans selection:bg-marigold-200 selection:text-maroon-900">
        {children}
      </body>
    </html>
  );
}

