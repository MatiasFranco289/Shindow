import { useEffect, useRef } from "react";
import { useExplorer } from "./explorerProvider";

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
      setUploadClipboad(files);
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
