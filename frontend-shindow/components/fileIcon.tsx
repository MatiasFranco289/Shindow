import FileDefaultSvg from "@/resources/svg/fileDefaultSvg";
import { RefObject, useEffect, useRef } from "react";
import { useExplorer } from "./explorerProvider";
import KeyboardController from "@/utils/KeyboardController";

interface FileIconProps {
  name: string;
  shortName: string;
  isSelected: boolean;
  handleAddRef: (ref: RefObject<HTMLDivElement>) => void;
}

export default function FileIcon({
  name,
  shortName,
  isSelected,
  handleAddRef,
}: FileIconProps) {
  const {
    isContextMenuOpen,
    selectedResourceNames,
    setSelectedResourceNames,
    setActiveResourceNames,
    activeResourceNames,
  } = useExplorer();
  // This controls whether any mouse button is held down over the directory.
  const isActive = Array.from(activeResourceNames).find(
    (activeName) => activeName === name
  );
  const iconRef = useRef<HTMLDivElement>(null);
  const bgColor = isActive
    ? "bg-white/20"
    : isSelected
    ? "bg-white/10 hover:bg-white/15"
    : "hover:bg-white/5";

  useEffect(() => {
    handleAddRef(iconRef);
  }, []);

  /**
   * This function is called when you click the directory using any mouse button.
   * If the context menu is open it does nothing.
   * Updates the selected resource names adding this resource name to the set or overlapping the set
   * depending if the ctrl key is pressed or not.
   * Add the name of this directory the the set of activeResourceNames.
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isContextMenuOpen) return;

    const alreadySelected = selectedResourceNames.has(name);
    const keyboardController = KeyboardController.GetInstance(window);
    const ctrlPressed = keyboardController.isCtrlPressed();

    // When more than one resource is selected and you click over an already selected
    // resource without press the ctrl then all the selected resources becomes active
    if (selectedResourceNames.size > 0 && !ctrlPressed && alreadySelected) {
      selectedResourceNames.forEach((selectedResourceNames) => {
        const newActiveResourceNames = activeResourceNames;
        newActiveResourceNames.add(selectedResourceNames);
        setActiveResourceNames(newActiveResourceNames);
      });
    }

    // If you click an already selected resource to open the context menu
    // it's not necessary to do nothing because it is already selected
    if (alreadySelected && e.button === 2) return;

    // If ctrl is pressed the name is added to the Set
    if (ctrlPressed) {
      setSelectedResourceNames(selectedResourceNames.add(name));
    } else {
      // If ctrl isn't pressed the name overlaps the set instead of be added
      const newSelectedResourceNames = new Set<string>();
      newSelectedResourceNames.add(name);

      setSelectedResourceNames(newSelectedResourceNames);
    }

    setActiveResourceNames(activeResourceNames.add(name));
  };

  return (
    <div
      className={`w-48 rounded-xl cursor-default m-2 p-6 ${bgColor}`}
      onMouseDown={handleMouseDown}
      tabIndex={0}
      ref={iconRef}
    >
      <div className="text-center flex justify-center h-36 w-36">
        <FileDefaultSvg />
      </div>

      <p className="text-xl text-center break-all select-none">{shortName}</p>
    </div>
  );
}
