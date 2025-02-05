import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useExplorer } from "./explorerProvider";
import { IconType } from "react-icons";
import { clamp, toggleScroll } from "@/utils/utils";
/**
 * This function controls open and closes the customContextMenu.
 * It is called when a click is detected so if the menu is open it is closed.
 * Otherwise, if the menu isn't open and the click is the right then the menu state changes.
 *
 * Also calls the fucntion 'toggleScroll' to enable or disable the scroll depending if the menu is
 * open or not.
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
    toggleScroll(true);
    return;
  }

  if (e.button !== 2 || isContextMenuOpen) return;

  toggleScroll(false);
  setContextMenuOpen(!isContextMenuOpen);
};

interface CustomContextMenuProps {
  options: Array<{
    label: string;
    callback: () => void;
    icon: IconType;
  }>;
}

export default function CustomContextMenu({ options }: CustomContextMenuProps) {
  const { isContextMenuOpen, mousePosition } = useExplorer();
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const [contextMenuDimensions, setContextMenuDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  // When the component it's mounted the dimensions in pixels are updated
  // in the provider state
  useEffect(() => {
    if (!contextMenuRef || !contextMenuRef.current) return;

    const { width, height } = contextMenuRef.current.getBoundingClientRect();
    setContextMenuDimensions({ width, height });
  }, []);

  /**
   * Calculates and returns the position of the context menu based on the mouse position.
   * The position is adjusted to keep the menu within the visible bounds of the window.
   * If window is not available it return zero for x and y coords
   * @returns - The x,y position of the context menu
   */
  const getContextMenuPosition = () => {
    if (!window) return { x: 0, y: 0 };

    const windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const limits = {
      x: windowSize.width - contextMenuDimensions.width,
      y: windowSize.height - contextMenuDimensions.height,
    };

    const contextMenuPosition = {
      x: clamp(mousePosition.x, 0, limits.x),
      y:
        mousePosition.y < limits.y
          ? mousePosition.y
          : mousePosition.y - contextMenuDimensions.height,
    };

    return contextMenuPosition;
  };

  return (
    <div
      style={{
        left: `${getContextMenuPosition().x}px`,
        top: `${getContextMenuPosition().y}px`,
      }}
      className={`fixed bg-custom-green-150 z-50 flex flex-col rounded-md overflow-hidden ${
        isContextMenuOpen ? "opacity-100" : "opacity-0"
      }`}
      ref={contextMenuRef}
    >
      {options.map((option, index) => {
        const Icon = option.icon;

        return (
          <div
            onClick={option.callback}
            className="flex justify-start items-center hover:bg-white/10 p-3 cursor-pointer"
            key={`custom_menu_option_${index}`}
          >
            <Icon className="text-2xl" />
            {<span className="mx-3 text-sm">{option.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
