import Link from "next/link";
import { MdClose } from "react-icons/md";
import { useExplorer } from "./explorerProvider";
import { MouseEvent, useRef } from "react";

export default function HelpMenu() {
  const { isHelpMenuOpen, setHelpMenuOpen } = useExplorer();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const controls = [
    {
      control: "Left click:",
      text: "Select a resource",
    },
    {
      control: "Double left click over a directory:",
      text: "Enter a directory",
    },
    {
      control: "CTRL + Left click:",
      text: "Select multiple resources",
    },
    {
      control: "Right click:",
      text: "Open the context menu",
    },
    {
      control: "Drag over one or multiple files:",
      text: "Upload files",
    },
  ];

  const onClose = () => {
    setHelpMenuOpen(false);
  };

  const onOverlayClick = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const controlRow = (control: string, text: string, key: string) => {
    return (
      <div
        className="flex flex-col items-center md:flex-row justify-between 
        md:my-1 my-7 text-nowrap"
        key={key}
      >
        <p className="font-semibold mr-2 text-nowrap">{control}</p>
        <p>{text}</p>
      </div>
    );
  };

  return (
    isHelpMenuOpen && (
      <div
        className="fixed top-0 left-0 w-screen h-screen z-50 flex justify-center 
        items-center bg-black/20"
        onClick={(e) => {
          onOverlayClick(e);
        }}
      >
        <div
          className="bg-custom-green-150 w-3/6 md:w-[600px] rounded-xl p-4 relative min-w-fit"
          ref={menuRef}
        >
          <div
            className="absolute top-0 right-0 p-4 cursor-pointer text-white/80 hover:text-white duration-200"
            onClick={onClose}
          >
            <MdClose className="text-xl " />
          </div>

          <div>
            <h2 className="w-full text-center text-xl font-semibold mb-10">
              Controls
            </h2>

            {controls.map((control, index) => {
              return controlRow(
                control.control,
                control.text,
                `control_${index}`
              );
            })}
          </div>
        </div>
      </div>
    )
  );
}
