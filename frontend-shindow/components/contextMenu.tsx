import React, { useState, useEffect, useRef } from "react";
import ContextMenuItem from "./contextMenuItem";
import { ContextMenuItemData, Position2D } from "@/interfaces";
import { number } from "yup";

interface ContextMenuProps {
  items: Array<ContextMenuItemData> | undefined;
  position: Position2D;
  reference: React.RefObject<HTMLUListElement>;
}

export default function ContextMenu({
  items,
  position,
  reference,
}: ContextMenuProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"; //Disables scrolling
    return () => {
      document.body.style.overflow = ""; //Enables scrolling when the component is unmounted
    };
  }, []);

  return (
    <>
      {items && (
        <ul
          className="bg-custom-green-150 sm:min-w-40 py-3 rounded-xl absolute z-20"
          style={{ top: `${position.y}px`, left: `${position.x}px` }}
          ref={reference}
        >
          {items.map((item, index) => (
            <ContextMenuItem data={item} key={index} />
          ))}
        </ul>
      )}
    </>
  );
}
