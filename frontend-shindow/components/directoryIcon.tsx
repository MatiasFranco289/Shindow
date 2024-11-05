import DirectoryDefaultSvg from "@/resources/svg/directoryDefaultSvg";
import { Dispatch, SetStateAction } from "react";

interface DirectoryIconProps {
  name: string;
  shortName: string;
  isSelected: boolean;
  setSelectedResourceName: Dispatch<SetStateAction<string>>;
  updatePath: (resourceName: string) => void;
}

export default function DirectoryIcon({
  name,
  shortName,
  isSelected,
  setSelectedResourceName,
  updatePath,
}: DirectoryIconProps) {
  /**
   * This function is called when the resource lost the focus
   * and sets the selectedResourceName to an empty string
   */
  const onDeselect = () => {
    if (isSelected) {
      setSelectedResourceName("");
    }
  };

  return (
    <div
      className={`w-48 rounded-xl cursor-default m-2 p-6 active:bg-white/20 ${
        isSelected ? "bg-white/10 hover:bg-white/15" : "hover:bg-white/5"
      }`}
      onClick={() => setSelectedResourceName(name)}
      onDoubleClick={() => updatePath(name)}
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
