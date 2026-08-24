import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { APP_VERSION } from "@/lib/version";
import { StoreProvider } from "@/components/StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: `Kicker Orchestrator ${APP_VERSION}`,
  description: "Kicker Orchestrator mit Spielerdatenbank, Bewertung, Tausch und Präsentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body
        className={`${inter.variable} ${jetbrains.variable} font-body antialiased selection:bg-primary-container selection:text-on-primary-container`}
        style={{ ["--font-geist" as string]: "Inter, sans-serif" }}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
