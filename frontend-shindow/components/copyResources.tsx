import { useEffect } from "react";
import { useExplorer } from "./explorerProvider";
import { toggleScroll } from "@/utils/utils";
import { ClipboardItem } from "@/interfaces";

export default function CopyResources() {
  const { setCopyOpen, selectedResources, setClipBoard } = useExplorer();

  useEffect(() => {
    const copiedResources: Array<ClipboardItem> = Array.from(
      selectedResources
    ).map((resource) => {
      return {
        resource: resource,
        method: "copied",
      };
    });

    setClipBoard(new Set(copiedResources));
    toggleScroll(true);
    setCopyOpen(false);
  }, []);

  return null;
}
