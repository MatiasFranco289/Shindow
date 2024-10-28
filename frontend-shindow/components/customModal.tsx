import { Dispatch, ReactElement, SetStateAction } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

interface CustomModalProps {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  message: string;
  type: "SUCCESS" | "ERROR";
}

export default function CustomModal({
  isModalOpen,
  setModalOpen,
  title,
  message,
  type,
}: CustomModalProps) {
  const icons: Record<typeof type, ReactElement> = {
    SUCCESS: <IoMdCheckmarkCircleOutline className="text-6xl text-green-600" />,
    ERROR: <MdErrorOutline className="text-6xl text-red-600" />,
  };
  return (
    <div
      className={`w-screen min-h-screen fixed top-0 left-0 bg-black/20 flex justify-center items-center backdrop-blur-sm duration-200
        ${
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`bg-custom-green-100 p-6 rounded-lg w-3/12 flex flex-col justify-center items-center ${
          isModalOpen ? "opacity-100" : "opacity-0"
        } duration-500`}
      >
        {icons[type]}
        <h1 className="text-3xl font-semibold">{title}</h1>

        <p className="mt-8 mb-5 text-center text-xl text-gray-400">{message}</p>

        <button
          type="submit"
          className={`border border-gray-400 w-3/12 text-4xl font-semibold p-3 rounded-xl flex justify-center duration-200 text-gray-400
            hover:text-gray-200 hover:border-gray-200 active:border-white active:text-white`}
          onClick={() => setModalOpen(false)}
        >
          Ok
        </button>
      </div>
    </div>
  );
}
