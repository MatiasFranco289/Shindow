import { ContextMenuItemData } from "@/interfaces";
import DirectoryDefaultSvg from "@/resources/svg/directoryDefaultSvg";
import { Dispatch, SetStateAction } from "react";
import { FaRegCopy, FaPaste, FaTrash, FaUpload } from "react-icons/fa6";

interface DirectoryIconProps {
  name: string;
  shortName: string;
  isSelected: boolean;
  setSelectedResourceName: Dispatch<SetStateAction<string>>;
  updatePath: (resourceName: string) => void;
  setContextMenuItems: (items: Array<ContextMenuItemData>) => void;
  showUploadMenu: (show: SetStateAction<boolean>) => void;
  updateUploadPath: (resourceName: string) => void;
}

export default function DirectoryIcon({
  name,
  shortName,
  isSelected,
  setSelectedResourceName,
  updatePath,
  setContextMenuItems,
  showUploadMenu,
  updateUploadPath,
}: DirectoryIconProps) {
  const contextMenuItemsDirectory: Array<ContextMenuItemData> = [
    {
      icon: <FaRegCopy />,
      title: "Copy",
      function: () => {
        alert("Copy folder");
      },
    },
    {
      icon: <FaPaste />,
      title: "Paste",
      function: () => {
        alert("paste into folder");
      },
    },
    {
      icon: <FaTrash />,
      title: "Delete",
      function: () => {
        alert("delete folder (you sure?)");
      },
    },
    {
      icon: <FaUpload />,
      title: "Upload",
      function: () => {
        updateUploadPath(name);
        showUploadMenu(true);
      },
    },
  ];

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
    setContextMenuItems(contextMenuItemsDirectory);
  };

  return (
    <div
      className={`relative z-10 w-48 rounded-xl cursor-default m-2 p-6 active:bg-white/20 ${
        isSelected ? "bg-white/10 hover:bg-white/15" : "hover:bg-white/5"
      }`}
      onClick={() => setSelectedResourceName(name)}
      onDoubleClick={() => updatePath(name)}
      onContextMenu={handleRightClick}
      onBlur={onDeselect}
      tabIndex={0}
    >
      <div className="text-center flex justify-center h-36 w-36">
        <DirectoryDefaultSvg />
      </div>

      <p className="text-xl text-center break-all select-none">{shortName}</p>
    </div>
  );
}
