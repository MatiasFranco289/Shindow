import { useExplorer } from "./explorerProvider";
import { useNavigation } from "./navigationProvider";
import NewDirectory from "./newDirectory";

interface CustomContextMenuLogicProps {
  refresh: () => void; // Function to refresh resources in the current path
}

export default function CustomContextMenuLogic({
  refresh,
}: CustomContextMenuLogicProps) {
  const { isNewDirectoryMenuOpen } = useExplorer();
  const { goTo } = useNavigation();

  return (
    <div>{isNewDirectoryMenuOpen && <NewDirectory refresh={refresh} />}</div>
  );
}
