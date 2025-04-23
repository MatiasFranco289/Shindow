import { useEffect, useRef } from "react";
import { useExplorer } from "./explorerProvider";
import { UploadClipboardItem } from "@/interfaces";

export default function FileManager() {
  const { setUploadClipboad } = useExplorer();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!fileInputRef.current) return;

    fileInputRef.current.click();
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (files) {
      const filesToUpload: Array<UploadClipboardItem> = Array.from(files).map(
        (file) => {
          return {
            id: crypto.randomUUID(),
            file: file,
            enterAnimationPlayed: false,
            status: "queued",
            progress: 0,
          };
        }
      );

      setUploadClipboad(filesToUpload);
    }
  }

  return (
    <div className="hidden">
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        multiple
      />
    </div>
  );
}
