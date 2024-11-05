"use client";
import { NavigationProvider } from "@/components/navigationProvider";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <NavigationProvider>{children}</NavigationProvider>;
}
