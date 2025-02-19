import { toggleScroll } from "@/utils/utils";
import { useEffect } from "react";
import { useExplorer } from "./explorerProvider";
import { useNavigation } from "./navigationProvider";
import { ClipboardItem } from "@/interfaces";

export default function CutResources() {
  const { setCutOpen, setClipBoard, selectedResourceNames } = useExplorer();
  const { actualPath } = useNavigation();

  useEffect(() => {
    const cutResourcesPath: Array<ClipboardItem> = Array.from(
      selectedResourceNames
    ).map((resourceName) => {
      return {
        path: actualPath + resourceName,
        method: "cut",
      };
    });

    setClipBoard(new Set(cutResourcesPath));
    toggleScroll(true);
    setCutOpen(false);
  }, []);

  return null;
}
