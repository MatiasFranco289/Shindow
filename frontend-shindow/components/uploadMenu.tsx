import { Resource } from "@/interfaces";
import axiosInstance from "@/utils/axiosInstance";
import path from "path";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); //TODO:constant

interface UploadMenuProps {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  uploadPath: string;
  refreshPage: (path: string) => void;
}

export default function UploadMenu({
  setMenuOpen,
  uploadPath,
  refreshPage,
}: UploadMenuProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = "hidden"; //Disables scrolling
    return () => {
      document.body.style.overflow = ""; //Enables scrolling when the component is unmounted
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post(
        "http://localhost:5000/api/resources/upload?remotePath=" + uploadPath,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: Infinity,
        }
      );
      setMessage("File uploaded succesfully"); //TODO: change this into a constant
      setProgress(0); // Resetear progreso después de la carga
      refreshPage("");
    } catch (error) {
      setMessage(`Error uploading file: ${(error as Error).message}`); //TODO: constant?
    }
  };

  useEffect(() => {
    // Listen to the upload progress event
    socket.on("upload-progress", (data) => {
      console.log(data.progress);
      setProgress(data.progress);
    });

    socket.on("upload-complete", (data) => {
      setMessage(`El archivo ${data.fileName} se ha subido correctamente.`);
      /* setProgress(100);  */
    });

    return () => {
      socket.off("upload-progress");
      socket.off("upload-complete");
    };
  }, []);

  return (
    <div
      className={`w-screen min-h-screen fixed z-50 top-0 left-0 bg-black/20 flex justify-center items-center backdrop-blur-sm duration-200 opacity-100 pointer-events-auto`}
    >
      <div
        onClick={() => setMenuOpen(false)}
        className={`w-screen min-h-screen fixed z-40 top-0 left-0`}
      ></div>
      <div className="bg-custom-green-100 p-5 z-50 rounded-xl">
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button
            className="bg-custom-green-150 rounded-xl p-2 px-3"
            type="submit"
          >
            Upload file
          </button>
        </form>

        {file && <p>Selected file: {file.name}</p>}
        {progress > 0 && <p>Progress: {progress}%</p>}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
