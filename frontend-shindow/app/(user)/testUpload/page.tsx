"use client";
import React, { useState } from "react";
import { AxiosProgressEvent } from "axios";
import axiosInstance from "@/utils/axiosInstance";

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
        "http://localhost:5000/api/resources/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percent);
            }
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
