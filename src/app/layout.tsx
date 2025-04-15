import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Quiz",
  description: "Quiz yourself on your books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Link
          href="/"
          className="text-3xl font-bold px-16 py-8 mt-6 inline-block rounded-lg hover:text-blue-600 transition-colors duration-300 font-serif tracking-wide"
        >
          BookQuizard
        </Link>
        {children}
      </body>
    </html>
  );
}
