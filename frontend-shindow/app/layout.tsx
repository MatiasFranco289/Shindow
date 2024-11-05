import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DonationBtn from "@/components/donationBtn";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Shindow",
  description: "SSH graphic environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <DonationBtn />
        {children}
      </body>
    </html>
  );
}
