import CopyResources from "./copyResources";
import CutResources from "./CutResources";
import { useExplorer } from "./explorerProvider";
import NewDirectory from "./newDirectory";

interface CustomContextMenuLogicProps {
  refresh: () => void; // Function to refresh resources in the current path
}

export default function CustomContextMenuLogic({
  refresh,
}: CustomContextMenuLogicProps) {
  const { isNewDirectoryMenuOpen, isCopyOpen, isCutOpen } = useExplorer();

  return (
    <div>
      <div>{isNewDirectoryMenuOpen && <NewDirectory refresh={refresh} />}</div>
      <div>{isCopyOpen && <CopyResources />}</div>
      <div>{isCutOpen && <CutResources />}</div>
    </div>
  );
}
