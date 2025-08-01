import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingOverlayProps {
  isOpen: boolean;
}

export default function LoadingOverlay({ isOpen }: LoadingOverlayProps) {
  return (
    isOpen && (
      <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black/15 flex justify-center items-center backdrop-blur-sm duration-200">
        <AiOutlineLoading3Quarters className="text-8xl animate-spin" />
      </div>
    )
  );
}
