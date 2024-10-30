import DirectoryDefaultSvg from "@/resources/svg/directoryDefaultSvg";
import { Dispatch, SetStateAction } from "react";

interface DirectoryIconProps {
  name: string;
  isSelected: boolean;
  setSelectedResourceName: Dispatch<SetStateAction<string>>;
}

export default function DirectoryIcon({
  name,
  isSelected,
  setSelectedResourceName,
}: DirectoryIconProps) {
  return (
    <div
      className={`w-48 rounded-xl cursor-default m-2 p-6 ${
        isSelected ? "bg-white/15 hover:bg-white/20" : "hover:bg-white/10"
      }`}
      onClick={() => setSelectedResourceName(name)}
    >
      <div className="flex justify-center">
        <DirectoryDefaultSvg />
      </div>

      <p className="text-xl text-center break-all">{name}</p>
    </div>
  );
}
