import { useEffect } from "react";
import { useExplorer } from "./explorerProvider";
import { useNavigation } from "./navigationProvider";
import { toggleScroll } from "@/utils/utils";

export default function CopyResources() {
  const { setCopyOpen, selectedResourceNames, setClipBoard, clipBoard } =
    useExplorer();
  const { actualPath } = useNavigation();

  useEffect(() => {
    const copiedResourcesPath = Array.from(selectedResourceNames).map(
      (resourceName) => {
        return actualPath + resourceName;
      }
    );

    setClipBoard(new Set(copiedResourcesPath));
    toggleScroll(true);
    setCopyOpen(false);
  }, []);

  return null;
}
