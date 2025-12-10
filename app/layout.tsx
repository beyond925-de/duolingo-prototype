import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beyond925 - Berufe spielerisch entdecken",
  description:
    "Interaktive Plattform zur spielerischen Entdeckung von Ausbildungsberufen und Karrieremöglichkeiten.",
  icons: {
    icon: "/beyond-logo.png",
    shortcut: "/beyond-logo.png",
    apple: "/beyond-logo.png",
  },
  openGraph: {
    title: "Beyond925 - Berufe spielerisch entdecken",
    description:
      "Interaktive Plattform zur spielerischen Entdeckung von Ausbildungsberufen und Karrieremöglichkeiten.",
    images: [
      {
        url: "/beyond-logo.png",
        width: 1200,
        height: 630,
        alt: "Beyond925 Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond925 - Berufe spielerisch entdecken",
    description:
      "Interaktive Plattform zur spielerischen Entdeckung von Ausbildungsberufen und Karrieremöglichkeiten.",
    images: ["/beyond-logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster theme="light" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
