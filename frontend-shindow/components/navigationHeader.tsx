import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useNavigation } from "./navigationProvider";
import { normalizePath } from "@/utils/utils";

export interface NavigationHeaderProps {
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
}

export default function NavigationHeader({
  goBack,
  goForward,
  canGoForward,
}: NavigationHeaderProps) {
  const { actualPath } = useNavigation();

  return (
    <div className="w-full bg-custom-green-50 flex justify-center p-5 fixed z-20 top-0 left-0">
      {/* Buttons */}
      <div className="absolute left-6 flex text-3xl space-x-4">
        {/* Back btn */}
        <div
          className={`p-1 rounded-md ${
            actualPath !== "/" &&
            " hover:bg-white/10 active:bg-white/15 duration-200"
          }`}
          onClick={goBack}
        >
          <IoChevronBack
            className={`${
              actualPath !== "/" ? "text-white" : "text-white/25"
            } rounded-md`}
          />
        </div>

        {/* Next btn */}
        <div
          className={`p-1 rounded-md ${
            canGoForward && "hover:bg-white/10 active:bg-white/15 duration-200"
          }`}
          onClick={goForward}
        >
          <IoChevronForward
            className={`${
              canGoForward ? "text-white" : "text-white/25"
            } rounded-md`}
          />
        </div>
      </div>

      <div className="bg-custom-green-100 w-3/6 p-1 pl-2 rounded-lg">
        <p>{normalizePath(actualPath)}</p>
      </div>
    </div>
  );
}
