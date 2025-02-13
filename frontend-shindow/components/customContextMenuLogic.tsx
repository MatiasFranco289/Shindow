import { useExplorer } from "./explorerProvider";
import { useNavigation } from "./navigationProvider";
import NewDirectory from "./newDirectory";

export default function CustomContextMenuLogic() {
  const { isNewDirectoryMenuOpen } = useExplorer();
  const { goTo } = useNavigation();

  return <div>{isNewDirectoryMenuOpen && <NewDirectory goTo={goTo} />}</div>;
}
