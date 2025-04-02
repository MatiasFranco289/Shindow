import { normalizeName } from "@/utils/utils";
import CircularProgressBar from "./circularProgressBar";
import { IoCloudUploadOutline } from "react-icons/io5";
import { GrStorage } from "react-icons/gr";
import { useEffect, useRef } from "react";
import { UploadClipboardItem } from "@/interfaces";

interface UploadCardProps {
  status: "queued" | "serverUpload" | "sshUpload";
  progress: number;
  totalSize: number;
  unit: "kb" | "mb" | "gb" | "tb";
  uploadClipboardItem: UploadClipboardItem;
}

export default function UploadCard({
  status,
  progress,
  totalSize,
  unit,
  uploadClipboardItem,
}: UploadCardProps) {
  const currentUploadedSize = totalSize * (progress / 100);

  const statusMessage = {
    queued: "In Queue",
    serverUpload: "Transferring to remote",
    sshUpload: "Transferring to server",
    complete: "Upload completed",
  };

  useEffect(() => {
    uploadClipboardItem.enterAnimationPlayed = true;
  }, []);

  return (
    <div
      className={`${
        uploadClipboardItem.status === "queued"
          ? "bg-custom-green-100/80"
          : "bg-custom-green-100"
      } rounded-2xl px-4 pt-4 pb-2 w-full duration-150 my-2 ${
        !uploadClipboardItem.enterAnimationPlayed && "animate-appear"
      }
      ${uploadClipboardItem.status === "complete" && "animate-dissapear"}`}
    >
      <div className="flex items-center">
        <CircularProgressBar
          size={60}
          progress={uploadClipboardItem.progress}
          strokeWidth={5}
          isUploadActive={uploadClipboardItem.status !== "queued"}
        />

        <div className="ml-6  w-full">
          <h2>{normalizeName(uploadClipboardItem.file.name, 31)}</h2>

          {/* Icons */}
          <div className="flex justify-between mt-2 ">
            <div className="flex items-center font-bold">
              <IoCloudUploadOutline className="text-3xl" />
              <p className="ml-1">{uploadClipboardItem.progress + "%"}</p>
            </div>

            <div className="flex items-center font-bold">
              <GrStorage className="text-2xl" />

              <div className="flex">
                <p className="ml-1">{currentUploadedSize}</p>
                <p className="mx-1 text-white/40">/</p>
                <p className="text-white/40">
                  {totalSize + " " + unit.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-center text-sm mt-2">
        <p className="text-white/40">
          {statusMessage[uploadClipboardItem.status]}
        </p>
      </div>
    </div>
  );
}
