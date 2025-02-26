import { Resource } from "@/interfaces";
import CopyResources from "./copyResources";
import CutResources from "./CutResources";
import { useExplorer } from "./explorerProvider";
import NewDirectory from "./newDirectory";
import PasteResources from "./pasteResources";

interface CustomContextMenuLogicProps {
  refresh: () => void; // Function to refresh resources in the current path
  resourceList: Array<Resource>;
}

export default function CustomContextMenuLogic({
  refresh,
  resourceList,
}: CustomContextMenuLogicProps) {
  const { isNewDirectoryMenuOpen, isCopyOpen, isCutOpen, isPasteOpen } =
    useExplorer();

  return (
    <div>
      <div>{isNewDirectoryMenuOpen && <NewDirectory refresh={refresh} />}</div>
      <div>{isCopyOpen && <CopyResources />}</div>
      <div>{isCutOpen && <CutResources />}</div>
      <div>
        {isPasteOpen && (
          <PasteResources resourceList={resourceList} refresh={refresh} />
        )}
      </div>
    </div>
  );
}
