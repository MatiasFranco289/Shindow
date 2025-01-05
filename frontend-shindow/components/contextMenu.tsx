import React, { useState, useEffect } from "react";
import ContextMenuItem from "./contextMenuItem";
import { ContextMenuItemData } from "@/interfaces";

interface ContextMenuProps {
  data: Array<ContextMenuItemData>;
}

export default function ContextMenu({ data }: ContextMenuProps) {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        alert("ME HICIERON CLICK EN: " + e.pageX + " " + e.pageY);
      }}
    >
      {data.map((item) => {
        return <div> Hola </div>;
      })}
    </div>
  );
}
