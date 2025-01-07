import { ContextMenuItemData } from "@/interfaces";
import React, { useState, useEffect } from "react";

interface ContextMenuItemProps {
  data: ContextMenuItemData;
}

export default function ContextMenuItem({ data }: ContextMenuItemProps) {
  return (
    <li
      onClick={data.function}
      className="flex gap-x-2 align-middle px-3 py-2 hover:bg-custom-green-200 cursor-pointer"
    >
      {data.icon}
      {data.title}
    </li>
  );
}
