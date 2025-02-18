import { useExplorer } from "./explorerProvider";
import NewDirectory from "./newDirectory";

interface CustomContextMenuLogic {
  goTo: (resourceName: string) => void;
}

export default function CustomContextMenuLogic({
  goTo,
}: CustomContextMenuLogic) {
  const { isNewDirectoryMenuOpen } = useExplorer();

  return <div>{isNewDirectoryMenuOpen && <NewDirectory goTo={goTo} />}</div>;
}
