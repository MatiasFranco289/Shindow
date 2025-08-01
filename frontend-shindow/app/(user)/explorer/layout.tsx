"use client";
import { ExplorerProvider } from "@/components/explorerProvider";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ExplorerProvider>{children}</ExplorerProvider>;
}
