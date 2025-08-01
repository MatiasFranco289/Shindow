import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { MdClose } from "react-icons/md";

interface ToastClose {
  closeToast: () => void;
}

export const customToastStyles = {
  success: {
    className: "bg-custom-green-150 text-white p-4",
    icon: (
      <div>
        <IoMdCheckmarkCircleOutline className="text-2xl" />
      </div>
    ),
    closeButton: ({ closeToast }: ToastClose) => (
      <div
        className="absolute top-0 right-0 p-2 cursor-pointer"
        onClick={closeToast}
      >
        <MdClose />
      </div>
    ),
    onOpen: () => {
      const audio = new Audio("/audio/notificationSuccess.wav");
      audio.play();
    },
  },
  error: {
    className: "bg-custom-green-150 text-white p-4",
    icon: (
      <div>
        <MdErrorOutline className="text-2xl" />
      </div>
    ),
    closeButton: ({ closeToast }: ToastClose) => (
      <div
        className="absolute top-0 right-0 p-2 cursor-pointer"
        onClick={closeToast}
      >
        <MdClose />
      </div>
    ),
    onOpen: () => {
      const audio = new Audio("/audio/notificationError.wav");
      audio.play();
    },
  },
};
