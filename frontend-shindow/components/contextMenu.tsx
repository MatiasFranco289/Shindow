import React, { useState, useEffect } from "react";
import ContextMenuItem from "./contextMenuItem";
import { ContextMenuItemData } from "@/interfaces";

interface ContextMenuProps {
  data: Array<ContextMenuItemData>;
  x: number;
  y: number;
}

export default function ContextMenu({ data, x, y }: ContextMenuProps) {
  const [clicked, setClicked] = useState(false);
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleClick = () => setClicked(false);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <ul
      className="bg-custom-green-150 sm:min-w-40 py-3 rounded-xl absolute"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      {data.map((item, index) => (
        <ContextMenuItem data={item} />
      ))}
    </ul>
  );
}
