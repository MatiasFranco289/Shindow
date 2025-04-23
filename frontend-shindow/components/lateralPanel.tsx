import { useRef } from "react";
import { useExplorer } from "./explorerProvider";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

export default function LateralPanel() {
  const { isLateralPanelOpen, setLateralPanelOpen } = useExplorer();

  const logout = () => {
    //
  };

  return isLateralPanelOpen ? (
    <div
      className="bg-custom-green-50 absolute left-0 top-full w-80 flex flex-col justify-between"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div
        className="absolute right-[-30px] bg-custom-green-150 py-3 rounded-r-xl cursor-pointer
      hover:scale-105 duration-200"
        onClick={() => {
          setLateralPanelOpen(false);
        }}
      >
        <MdKeyboardArrowLeft className="text-3xl" />
      </div>

      <div className="p-4">
        <div className="mt-2">
          <p>Currently logged as</p>
          <p className="text-2xl font-semibold ">root</p>
        </div>

        <div className="space-y-1 flex flex-col p-4">
          <a
            href="https://www.shindow.mfranco289.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white hover:scale-[101%] duration-200 cursor-pointer"
          >
            Website
          </a>
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=MQZ3SCHEFD9HC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white hover:scale-[101%] duration-200 cursor-pointer"
          >
            Help with your donation
          </a>
          <a
            href="mailto:matias.franco289@gmail.com"
            className="text-white/80 hover:text-white hover:scale-[101%] duration-200 cursor-pointer"
          >
            Contact
          </a>
          <p className="text-white/80 hover:text-white hover:scale-[101%] duration-200 cursor-pointer">
            Logout
          </p>
        </div>

        <div className="max-h-48 h-48">
          <p className="text-xl font-semibold">Changelog</p>

          <ul className="list-disc p-4 overflow-y-scroll overflow-x-clip space-y-1 break-words h-full w-full">
            <li>Shindow was just released!</li>
          </ul>
        </div>

        <div className="max-h-48 h-48">
          <p className="text-xl font-semibold">Next version features</p>

          <ul className="list-disc p-4 overflow-y-scroll overflow-x-clip space-y-1 break-words h-full w-full">
            <li>Download resources</li>
            <li>Another things</li>
            <li>Cositas se vienen</li>
            <li>Icon personalization</li>
            <li>Icon personalization</li>
            <li>Icon personalization</li>
            <li>Icon personalization</li>
            <li>Icon personalization</li>
            <li>Icon personalization</li>
            <li>Icon personalization</li>
          </ul>
        </div>
      </div>

      <div className="p-4 text-sm">
        <h2 className="text-3xl font-bold">SHINDOW</h2>
        <p>Version 1.0</p>
      </div>
    </div>
  ) : (
    <div
      className="absolute left-[-8px] top-full bg-custom-green-150 py-3 rounded-r-xl 
    hover:left-0 w-8 flex justify-end duration-200 cursor-pointer"
      onClick={() => {
        setLateralPanelOpen(true);
      }}
    >
      <MdKeyboardArrowRight className="text-3xl" />
    </div>
  );
}
