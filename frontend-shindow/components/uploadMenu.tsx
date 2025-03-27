import { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

export default function UploadMenu() {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div
      className={`p-1 rounded-md ${
        isOpen ? "bg-white/20" : "hover:bg-white/10"
      }`}
      onClick={() => {
        setOpen(!isOpen);
      }}
    >
      <MdOutlineFileUpload className="text-3xl" />
    </div>
  );
}
