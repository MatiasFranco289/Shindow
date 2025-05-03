import { useExplorer } from "./explorerProvider";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { BiDonateHeart } from "react-icons/bi";
import { IoMailOpenOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import {
  LOGOUT_ENDPOINT,
  SHINDOW_CONTACT_MAIL,
  SHINDOW_DONATIONS_URL,
  SHINDOW_WEBSITE_URL,
} from "@/constants";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import logoutErrorHandler from "@/errorHandlers/logoutErrorHandler";
import { useRouter } from "next/navigation";

export default function LateralPanel() {
  const { isLateralPanelOpen, setLateralPanelOpen } = useExplorer();
  const { setIsLoading, setErrorModalMessage, setErrorModalOpen } =
    useExplorer();
  const environmentManager = EnvironmentManager.getInstance();
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const router = useRouter();

  const logout = () => {
    setIsLoading(true);

    axiosInstance
      .post(`${apiBaseUrl}${LOGOUT_ENDPOINT}`)
      .then((res) => {
        localStorage.clear();
        router.push("/");
      })
      .catch((err) => {
        console.error(
          `The following error has occurred while trying to logout: `
        );
        console.error(err);

        setErrorModalMessage(logoutErrorHandler(err));
        setErrorModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const redirectTo = (url: string) => {
    window.open(url, "_blank");
  };

  return isLateralPanelOpen ? (
    <div
      className="bg-custom-green-50 absolute left-0 top-full w-80 p-4 flex flex-col"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div
        className="absolute right-[-32px] top-0 bg-custom-green-150 py-4 rounded-r-xl 
        w-8 flex justify-end cursor-pointer z-50"
        onClick={() => {
          setLateralPanelOpen(false);
        }}
      >
        <MdKeyboardArrowLeft className="text-3xl" />
      </div>

      {/* User info */}
      <div className="bg-custom-green-100 rounded-xl p-4">
        <p className="text-white/50">Currently logged as</p>
        <h2 className="text-2xl font-bold">
          {localStorage.getItem("username")}
        </h2>
      </div>

      <div className="flex flex-col justify-between flex-1">
        {/* Superior */}
        <div className="mt-4 ">
          <div
            className="flex items-center cursor-pointer hover:bg-white/20 p-4 rounded-lg duration-200"
            onClick={() => {
              redirectTo(SHINDOW_WEBSITE_URL);
            }}
          >
            <BiWorld className="text-2xl" />
            <p className="ml-3">Website</p>
          </div>

          <div
            className="flex items-center cursor-pointer hover:bg-white/20 p-4 rounded-lg duration-200"
            onClick={() => {
              redirectTo(SHINDOW_DONATIONS_URL);
            }}
          >
            <BiDonateHeart className="text-2xl" />
            <p className="ml-3">Donations</p>
          </div>

          <div
            className="flex items-center cursor-pointer hover:bg-white/20 p-4 rounded-lg duration-200"
            onClick={() => {
              window.location.href = `mailto:${SHINDOW_CONTACT_MAIL}`;
            }}
          >
            <IoMailOpenOutline className="text-2xl" />
            <p className="ml-3">Contact</p>
          </div>
        </div>

        {/* Bottom */}
        <div>
          <button
            className="flex mb-8 hover:bg-white/20 w-full p-4 rounded-lg duration-200"
            onClick={logout}
          >
            <MdLogout className="text-2xl" />
            <p className="ml-3">Logout</p>
          </button>

          {/* Sepatator */}
          <div className="w-full border-b border-white/20 my-4" />

          {/* Logo */}
          <div className="p-2">
            <h2 className="text-xl font-bold">SHINDOW</h2>
            <p className="text-white/50">Version 1.0</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="absolute left-[-8px] top-full bg-custom-green-150 py-4 rounded-r-xl 
    hover:left-0 w-8 flex justify-end duration-200 cursor-pointer"
      onClick={() => {
        setLateralPanelOpen(true);
      }}
    >
      <MdKeyboardArrowRight className="text-3xl" />
    </div>
  );
}
