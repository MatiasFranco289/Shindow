import { useExplorer } from "./explorerProvider";
import NewDirectory from "./newDirectory";

export default function CustomContextMenuLogic() {
  const { isNewDirectoryMenuOpen } = useExplorer();

  return <div>{isNewDirectoryMenuOpen && <NewDirectory />}</div>;
}
