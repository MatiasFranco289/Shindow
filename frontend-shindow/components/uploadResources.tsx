import { useEffect, useRef } from "react";
import { useExplorer } from "./explorerProvider";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { UPLOAD_RESOURCE_ENDPOINT } from "@/constants";
import { useNavigation } from "./navigationProvider";
import io from "socket.io-client";
import { UploadClipboardItem } from "@/interfaces";
import { toast } from "react-toastify";
import { customToastStyles } from "@/customToastSyles";

interface UploadResourcesProps {
  refresh: () => void;
}

export default function UploadResources({ refresh }: UploadResourcesProps) {
  const { uploadClipboard, setUploadMenuOpen, setUploadClipboad } =
    useExplorer();
  const { history, historyIndex } = useNavigation();
  const environmentManager = EnvironmentManager.getInstance();
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const backBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_BACK_BASE_URL"
  );
  const socket = io(backBaseUrl, { autoConnect: false });

  useEffect(() => {
    socket.connect();

    setUploadMenuOpen(true);
    uploadResourcesFromClipboard();
    trackUploadProgress();

    return () => {
      socket.off("upload-start");
      socket.off("upload-progress");
      socket.off("upload-complete");
      socket.disconnect();
    };
  }, []);

  const clearUploadFromClipboard = (): Promise<null> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const newUploadClipboard = uploadClipboard;
        newUploadClipboard.splice(0, 1);
        setUploadClipboad(newUploadClipboard);

        resolve(null);
      }, 1000);
    });
  };

  /**
   * Track the current upload and updates it's status and progress
   * in the uploadClipboard state.
   * When the upload is finished, it calls the function 'clearUploadFromClipboard' to
   * delete the completed upload from the uplaod clipboard.
   */
  const trackUploadProgress = () => {
    let lastProgress = 0;
    let resourceInServer = false;
    let complete = false;

    socket.on("upload-start", () => {
      lastProgress = 0;
      resourceInServer = false;
      complete = false;
    });

    socket.on("upload-progress", (data) => {
      if (complete) return;
      if (lastProgress === data.progress) return;

      if (!resourceInServer && data.progress >= 50) {
        resourceInServer = true;
      }

      updateUploadClipboard(
        resourceInServer ? "sshUpload" : "serverUpload",
        data.progress
      );

      lastProgress = data.progress;
    });

    socket.on("upload-complete", () => {
      complete = true;
      updateUploadClipboard("complete", 100);

      toast.success(
        `The upload of the resource ${uploadClipboard[0].file.name} has finished successfully.`,
        customToastStyles.success
      );
    });
  };

  /**
   * Iterates over each item in the uploadClipboard starting the upload and
   * updating the status of the item to 'serverUpload'.
   * It will await until the previous upload is complete before init a new one.
   *
   * @returns
   */
  const uploadResourcesFromClipboard = async () => {
    for (let _i = 0; uploadClipboard.length > 0; _i++) {
      const resourceToUpload = uploadClipboard[0];
      updateUploadClipboard("serverUpload", 0);

      try {
        const response = await getUploadRequest(resourceToUpload);
        refresh();
        await clearUploadFromClipboard();
      } catch (err) {
        console.log(err);
      }
    }
  };

  /**
   * Receives an UploadClipboardItem and returns the promise to upload
   * the given resource.
   *
   * @param resourceToUpload - A UploadClipboardItem.
   * @returns - A promise to be resolved.
   */
  const getUploadRequest = async (resourceToUpload: UploadClipboardItem) => {
    const formData = new FormData();
    formData.append("file", resourceToUpload.file);

    const currentPath = history[historyIndex].path;
    const queryParam = "?remotePath=" + currentPath;
    const url = apiBaseUrl + UPLOAD_RESOURCE_ENDPOINT + queryParam;

    return axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: Infinity,
    });
  };

  /**
   * Changes the properties of the first element in the uploadClipboard
   * and then updates the uploadClipboard status.
   *
   * @param status - The new status for the UploadClipboardItem.
   * @param progress: - The new progress for the UploadClipboardItem.
   */
  const updateUploadClipboard = (
    status: UploadClipboardItem["status"],
    progress: number
  ) => {
    const updatedUploadClipboard = [...uploadClipboard];

    updatedUploadClipboard[0] = {
      ...updatedUploadClipboard[0],
      status: status,
      progress: progress,
    };

    setUploadClipboad(updatedUploadClipboard);
  };

  return null;
}
