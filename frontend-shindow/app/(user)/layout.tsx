"use client";
import { NavigationProvider } from "@/components/navigationProvider";
import { ToastContainer, toast } from "react-toastify";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { customToastStyles } from "@/customToastSyles";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavigationProvider>{children}</NavigationProvider>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
