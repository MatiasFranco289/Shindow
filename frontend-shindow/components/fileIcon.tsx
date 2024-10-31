import FileDefaultSvg from "@/resources/svg/fileDefaultSvg";
import { Dispatch, SetStateAction } from "react";

interface FileIconProps {
  name: string;
  isSelected: boolean;
  setSelectedResourceName: Dispatch<SetStateAction<string>>;
}

export default function FileIcon({
  name,
  isSelected,
  setSelectedResourceName,
}: FileIconProps) {
  return (
    <div
      className={`w-48 rounded-xl cursor-default m-2 p-6 active:bg-white/20 ${
        isSelected ? "bg-white/10 hover:bg-white/15" : "hover:bg-white/5"
      }`}
      onClick={() => setSelectedResourceName(name)}
    >
      <div className="text-center flex justify-center h-36 w-36">
        <FileDefaultSvg />
      </div>

      <p className="text-xl text-center break-all select-none">{name}</p>
    </div>
  );
}
