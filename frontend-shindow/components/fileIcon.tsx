import { contextMenuItemsFile } from "@/constants";
import { ContextMenuItemData } from "@/interfaces";
import FileDefaultSvg from "@/resources/svg/fileDefaultSvg";
import { Dispatch, SetStateAction } from "react";

interface FileIconProps {
  name: string;
  shortName: string;
  isSelected: boolean;
  setSelectedResourceName: Dispatch<SetStateAction<string>>;
  setContextMenuItems: (itesm: Array<ContextMenuItemData>) => void;
}

export default function FileIcon({
  name,
  shortName,
  isSelected,
  setSelectedResourceName,
  setContextMenuItems,
}: FileIconProps) {
  /**
   * This function is called when the resource lost the focus
   * and sets the selectedResourceName to an empty string
   */
  const onDeselect = () => {
    if (isSelected) {
      setSelectedResourceName("");
    }
  };

  const handleRightClick = () => {
    setSelectedResourceName(name);
    setContextMenuItems(contextMenuItemsFile);
  };

  return (
    <div
      className={`relative z-10 w-48 rounded-xl cursor-default m-2 p-6 active:bg-white/20 ${
        isSelected ? "bg-white/10 hover:bg-white/15" : "hover:bg-white/5"
      }`}
      onClick={() => setSelectedResourceName(name)}
      onContextMenu={handleRightClick}
      onBlur={onDeselect}
      tabIndex={0}
    >
      <div className="text-center flex justify-center h-36 w-36">
        <FileDefaultSvg />
      </div>

      <p className="text-xl text-center break-all select-none">{shortName}</p>
    </div>
  );
}
