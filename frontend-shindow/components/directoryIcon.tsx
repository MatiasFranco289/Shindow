import DirectoryDefaultSvg from "@/resources/svg/directoryDefaultSvg";
import { Dispatch, SetStateAction } from "react";

interface DirectoryIconProps {
  name: string;
  isSelected: boolean;
  setSelectedResourceName: Dispatch<SetStateAction<string>>;
  updatePath: (resourceName: string) => void;
}

export default function DirectoryIcon({
  name,
  isSelected,
  setSelectedResourceName,
  updatePath,
}: DirectoryIconProps) {
  return (
    <div
      className={`w-48 rounded-xl cursor-default m-2 p-6 active:bg-white/20 ${
        isSelected ? "bg-white/10 hover:bg-white/15" : "hover:bg-white/5"
      }`}
      onClick={() => setSelectedResourceName(name)}
      onDoubleClick={() => updatePath(name)}
    >
      <div className="text-center flex justify-center h-36 w-36">
        <DirectoryDefaultSvg />
      </div>

      <p className="text-xl text-center break-all select-none">{name}</p>
    </div>
  );
}
