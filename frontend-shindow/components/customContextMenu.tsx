import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useExplorer } from "./explorerProvider";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { clamp, toggleScroll } from "@/utils/utils";
import { FaRegCopy } from "react-icons/fa";
import { IoCutOutline } from "react-icons/io5";
import { FaRegPaste } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
/**
 * This function controls open and closes the customContextMenu.
 * It is called when a click is detected so if the menu is open and the click was not in the menu, it is closed
 * Otherwise, if the menu isn't open and the click is the right then the menu state changes.
 *
 * Also calls the fucntion 'toggleScroll' to enable or disable the scroll depending if the menu is
 * open or not.
 * @param e - The mouse event
 * @param isContextMenuOpen - A boolean being true if the context menu is open
 * @param setContextMenuOpen - A setter for the isContextMenuOpen boolean
 * @param ref - A reference of the div returned by this component
 * @returns
 */
export const toggleContextMenuState = (
  e: React.MouseEvent,
  isContextMenuOpen: boolean,
  setContextMenuOpen: Dispatch<SetStateAction<boolean>>,
  ref: RefObject<HTMLDivElement | null>
) => {
  const clickOnMenu = ref.current?.contains(e.target as Node);

  if (!clickOnMenu && isContextMenuOpen) {
    setContextMenuOpen(false);
    toggleScroll(true);
    return;
  }

  if (e.button !== 2 || isContextMenuOpen) return;

  toggleScroll(false);
  setContextMenuOpen(!isContextMenuOpen);
};

interface CustomContextMenuProps {
  setContextMenuRef: Dispatch<SetStateAction<RefObject<HTMLDivElement | null>>>;
}

export default function CustomContextMenu({
  setContextMenuRef,
}: CustomContextMenuProps) {
  const { isContextMenuOpen, mousePosition, selectedResources } = useExplorer();
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const [contextMenuDimensions, setContextMenuDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const {
    setNewDirectoryMenuOpen,
    setContextMenuOpen,
    setCopyOpen,
    setCutOpen,
    setPasteOpen,
    setDeleteOpen,
    clipBoard,
  } = useExplorer();

  // When the component it's mounted the dimensions in pixels are updated
  // in the provider state
  useEffect(() => {
    if (!contextMenuRef || !contextMenuRef.current) return;

    const { width, height } = contextMenuRef.current.getBoundingClientRect();
    setContextMenuDimensions({ width, height });
    setContextMenuRef(contextMenuRef);
  }, []);

  /**
   * Calculates and returns the position of the context menu based on the mouse position.
   * The position is adjusted to keep the menu within the visible bounds of the window.
   * If window is not available it return zero for x and y coords
   * @returns - The x,y position of the context menu
   */
  const getContextMenuPosition = () => {
    if (typeof window === "undefined") return { x: 0, y: 0 };

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

  const menuOptions = [
    {
      label: "New Directory ...",
      onClick: () => {
        setNewDirectoryMenuOpen(true);
        setContextMenuOpen(false);
      },
      icon: MdOutlineCreateNewFolder,
      disabled: !!selectedResources.size,
    },
    {
      label: "Copy",
      onClick: () => {
        setCopyOpen(true);
        setContextMenuOpen(false);
      },
      icon: FaRegCopy,
      disabled: !selectedResources.size,
    },
    {
      label: "Cut",
      onClick: () => {
        setCutOpen(true);
        setContextMenuOpen(false);
      },
      icon: IoCutOutline,
      disabled: !selectedResources.size,
    },
    {
      label: "Paste",
      onClick: () => {
        setPasteOpen(true);
        setContextMenuOpen(false);
      },
      icon: FaRegPaste,
      disabled: !clipBoard.size || selectedResources.size,
    },
    {
      label: "Delete",
      onClick: () => {
        setDeleteOpen(true);
        setContextMenuOpen(false);
      },
      icon: MdDeleteOutline,
      disabled: !selectedResources.size,
    },
  ];

  return (
    <div
      style={{
        left: `${getContextMenuPosition().x}px`,
        top: `${getContextMenuPosition().y}px`,
      }}
      className={`fixed bg-custom-green-150 z-50 flex flex-col rounded-md overflow-hidden ${
        !contextMenuRef.current
          ? "opacity-0 pointer-events-none"
          : isContextMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none hidden"
      }`}
      ref={contextMenuRef}
    >
      {menuOptions.map((option, index) => {
        const Icon = option.icon;

        return (
          <div
            onClick={option.onClick}
            className={`flex justify-start items-center hover:bg-white/10 p-3 cursor-pointer ${
              option.disabled
                ? "text-gray-400 pointer-events-none"
                : "text-white pointer-events-auto"
            }`}
            key={`custom_menu_option_${index}`}
          >
            <Icon className="text-2xl" />
            {
              <span
                className="mx-3 text-sm whitespace-nowrap"
                style={{ userSelect: "none" }}
              >
                {option.label}
              </span>
            }
          </div>
        );
      })}
    </div>
  );
}
