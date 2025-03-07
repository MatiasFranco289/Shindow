import DirectoryDefaultSvg from "@/resources/svg/directoryDefaultSvg";
import { useExplorer } from "./explorerProvider";
import { RefObject, useEffect, useRef, useState } from "react";
import KeyboardController from "@/utils/KeyboardController";
import { useNavigation } from "./navigationProvider";
import { compareResources, getLastFromPath } from "@/utils/utils";
import { Resource } from "@/interfaces";

interface DirectoryIconProps {
  resourceData: Resource;
  isSelected: boolean;
  handleAddRef: (ref: RefObject<HTMLDivElement>) => void;
}

export default function DirectoryIcon({
  resourceData,
  isSelected,
  handleAddRef,
}: DirectoryIconProps) {
  const {
    isContextMenuOpen,
    selectedResources,
    setSelectedResources,
    setActiveResources,
    activeResources,
    clipBoard,
  } = useExplorer();
  const { goTo } = useNavigation();

  // This controls whether any mouse button is held down over the directory.
  const isActive = Array.from(activeResources).find((activeResource) =>
    compareResources(activeResource, resourceData)
  );
  const [isCut, setIsCut] = useState<boolean>();
  const iconRef = useRef<HTMLDivElement>(null);

  const bgColor = isActive
    ? "bg-white/20"
    : isSelected
    ? "bg-white/10 hover:bg-white/15"
    : "hover:bg-white/5";

  useEffect(() => {
    handleAddRef(iconRef);
  }, []);

  useEffect(() => {
    setIsCut(isResourceCut());
  }, [clipBoard, resourceData.name]);

  /**
   * Iterates over each item in the clipboard and verify if the name of this resource
   * is in the clipboard as a cut resource.
   *
   * @returns - A boolean, being true if the item was cut.
   */
  const isResourceCut = () => {
    const isCut = Array.from(clipBoard).find((item) => {
      const filename = getLastFromPath(item.path);
      return item.method === "cut" && filename === resourceData.name;
    });

    return !!isCut;
  };

  /**
   * This function is called when you click the directory using any mouse button.
   * If the context menu is open it does nothing.
   * Updates the selected resource names adding this resource name to the set or overlapping the set
   * depending if the ctrl key is pressed or not.
   * Add the name of this directory the the set of activeResourceNames.
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isContextMenuOpen) return;

    const alreadySelected = Array.from(selectedResources).find((resource) =>
      compareResources(resource, resourceData)
    );
    const keyboardController = KeyboardController.GetInstance(window);
    const ctrlPressed = keyboardController.isCtrlPressed();

    // When more than one resource is selected and you click over an already selected
    // resource without press the ctrl then all the selected resources becomes active
    if (selectedResources.size > 0 && !ctrlPressed && alreadySelected) {
      selectedResources.forEach((selectedResource) => {
        const newActiveResources = activeResources;
        newActiveResources.add(selectedResource);
        setActiveResources(newActiveResources);
      });
    }

    // If you click an already selected resource to open the context menu
    // it's not necessary to do nothing because it is already selected
    if (alreadySelected && e.button === 2) return;

    // If ctrl is pressed the name is added to the Set
    if (ctrlPressed) {
      setSelectedResources(selectedResources.add(resourceData));
    } else {
      // If ctrl isn't pressed the name overlaps the set instead of be added

      const newSelectedResources = new Set<Resource>();
      newSelectedResources.add(resourceData);
      setSelectedResources(newSelectedResources);
    }

    setActiveResources(activeResources.add(resourceData));
  };

  return (
    <div
      className={`w-48 rounded-xl cursor-default m-2 p-6 ${bgColor}`}
      onMouseDown={(e) => handleMouseDown(e)}
      onDoubleClick={() => goTo(resourceData)}
      tabIndex={0}
      ref={iconRef}
    >
      <div
        className={`text-center flex justify-center h-36 w-36 ${
          isCut ? "opacity-60" : "opacity-100"
        }`}
      >
        <DirectoryDefaultSvg />
      </div>

      <p className="text-xl text-center break-all select-none whitespace-pre-wrap">
        {resourceData.shortName}
      </p>
    </div>
  );
}
