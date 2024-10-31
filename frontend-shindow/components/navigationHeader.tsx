import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export interface NavigationHeaderProps {
  actualPath: string;
  goBack: () => void;
}

export default function NavigationHeader({
  actualPath,
  goBack,
}: NavigationHeaderProps) {
  return (
    <div className="w-full bg-custom-green-50 flex justify-center p-5 fixed top-0 left-0">
      {/* Buttons */}
      <div className="absolute left-6 flex text-3xl space-x-4" onClick={goBack}>
        {/* Back btn */}
        <div
          className={`p-1 rounded-md ${
            actualPath !== "/" && " hover:bg-white/10 active:bg-white/15"
          }`}
        >
          <IoChevronBack
            className={`${
              actualPath !== "/" ? "text-white rounded-md" : "text-white/25"
            }`}
          />
        </div>

        {/* Next btn */}
        <div className="p-1">
          <IoChevronForward className="text-white/25" />
        </div>
      </div>

      <div className="bg-custom-green-100 w-3/6 p-1 pl-2 rounded-lg">
        <p>{actualPath}</p>
      </div>
    </div>
  );
}
