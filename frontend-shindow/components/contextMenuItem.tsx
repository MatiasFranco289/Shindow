import { ContextMenuItemData } from "@/interfaces";
import React, { useState, useEffect } from "react";

interface ContextMenuItemProps {
  data: ContextMenuItemData;
}

export default function ContextMenuItem({ data }: ContextMenuItemProps) {
  return <div>Context Menu Item</div>;
}
