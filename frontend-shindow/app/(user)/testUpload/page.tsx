"use client";
import axiosInstance from "@/utils/axiosInstance";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

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
        "http://localhost:5000/api/resources/upload?remotePath=/home/vago-dev1",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: Infinity,
        }
      );
      setMessage("Archivo subido exitosamente");
      setProgress(0); // Resetear progreso después de la carga
    } catch (error) {
      setMessage(`Error al subir el archivo: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    // Escuchar el evento de progreso de carga
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
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Subir archivo</button>
      </form>

      {file && <p>Archivo seleccionado: {file.name}</p>}
      {progress > 0 && <p>Progreso: {progress}%</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadFile;
