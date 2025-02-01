import { Dispatch, SetStateAction } from "react";
import { useExplorer } from "./explorerProvider";

/**
 * This function controls open and closes the customContextMenu.
 * It is called when a click is detected so if the menu is open it is closed.
 * Otherwise, if the menu isn't open and the click is the right then the menu state changes.
 * @param e - The mouse event
 * @param isContextMenuOpen - A boolean being true if the context menu is open
 * @param setContextMenuOpen - A setter for the isContextMenuOpen boolean
 * @returns
 */
export const toggleContextMenuState = (
  e: React.MouseEvent,
  isContextMenuOpen: boolean,
  setContextMenuOpen: Dispatch<SetStateAction<boolean>>
) => {
  if (isContextMenuOpen) {
    setContextMenuOpen(false);
    return;
  }

  if (e.button !== 2 || isContextMenuOpen) return;

  setContextMenuOpen(!isContextMenuOpen);
};

export default function CustomContextMenu() {
  const { isContextMenuOpen, mousePosition } = useExplorer();

  return (
    isContextMenuOpen && (
      <div
        style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}
        className="w-[100px] h-[100px] absolute bg-red-300 z-50"
      >
        Menu
      </div>
    )
  );
}
