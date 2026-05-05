import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AgentCart – AI Shopping Agent",
  description:
    "Find the perfect product in seconds. Ask anything. Get smart AI-powered recommendations powered by Google Gemini.",
  keywords: ["AI shopping", "product recommendations", "Gemini AI", "smart shopping agent"],
  openGraph: {
    title: "AgentCart – AI Shopping Agent",
    description: "AI-powered shopping intelligence. Find the perfect product instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} h-full`}
    >
      <body className="h-full antialiased bg-[#0a0a0f] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
