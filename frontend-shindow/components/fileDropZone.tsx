import { useDropzone } from "react-dropzone";
import axiosInstance from "@/utils/axiosInstance";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); //TODO:constant

interface FileDropZoneProps {
  uploadPath: string;
  refreshPage: (path: string) => void;
}

export default function FileDropZone({
  uploadPath,
  refreshPage,
}: FileDropZoneProps) {
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [readyToUpload, setReadyToUpload] = useState<boolean>(true);
  const { acceptedFiles, getRootProps } = useDropzone({
    onDrop: (droppedFiles) => {
      console.log(droppedFiles);
      console.log(droppedFiles);
      handleSubmit(droppedFiles);
    },
  });

  const handleSubmit = async (files: File[]) => {
    if (!files) {
      return;
    }

    files.forEach(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
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
    });
  };

  useEffect(() => {
    // Listen to the upload progress event
    socket.on("upload-progress", (data) => {
      console.log(data.progress);
      setProgress(data.progress);
    });

    socket.on("upload-complete", (data) => {
      setMessage(`El archivo ${data.fileName} se ha subido correctamente.`);
      setReadyToUpload(true);
      /* setProgress(100);  */
    });

    return () => {
      socket.off("upload-progress");
      socket.off("upload-complete");
    };
  }, []);

  return (
    <section className="container bg-red-800 z-50">
      <div {...getRootProps({ className: "dropzone" })}>
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <h1 className="text-9xl">{progress}</h1>
      </aside>
    </section>
  );
}
