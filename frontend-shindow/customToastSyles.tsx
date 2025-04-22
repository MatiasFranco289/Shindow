import { IoMdCheckmarkCircleOutline } from "react-icons/io";
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
      const audio = new Audio("/audio/notification.wav");
      audio.play();
    },
  },
};
