import { toggleScroll } from "@/utils/utils";
import { useEffect } from "react";
import { useExplorer } from "./explorerProvider";
import { useNavigation } from "./navigationProvider";
import { ClipboardItem } from "@/interfaces";

export default function CutResources() {
  const { setCutOpen, setClipBoard, selectedResources } = useExplorer();
  const { actualPath } = useNavigation();

  useEffect(() => {
    const cutResources: Array<ClipboardItem> = Array.from(
      selectedResources
    ).map((resource) => {
      return {
        path: actualPath + resource.name,
        method: "cut",
        resource: resource,
      };
    });

    setClipBoard(new Set(cutResources));
    toggleScroll(true);
    setCutOpen(false);
  }, []);

  return null;
}
