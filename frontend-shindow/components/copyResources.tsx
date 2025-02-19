import { useEffect } from "react";
import { useExplorer } from "./explorerProvider";
import { useNavigation } from "./navigationProvider";
import { toggleScroll } from "@/utils/utils";
import { ClipboardItem } from "@/interfaces";

export default function CopyResources() {
  const { setCopyOpen, selectedResourceNames, setClipBoard } = useExplorer();
  const { actualPath } = useNavigation();

  useEffect(() => {
    const copiedResourcesPath: Array<ClipboardItem> = Array.from(
      selectedResourceNames
    ).map((resourceName) => {
      return {
        path: actualPath + resourceName,
        method: "copied",
      };
    });

    setClipBoard(new Set(copiedResourcesPath));
    toggleScroll(true);
    setCopyOpen(false);
  }, []);

  return null;
}
