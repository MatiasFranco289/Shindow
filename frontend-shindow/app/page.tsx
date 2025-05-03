"use client";
import LoginForm from "@/components/loginForm";
import CustomModal from "@/components/customModal";
import { useState } from "react";

export default function Login() {
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");

  return (
    <div className="w-full min-h-screen bg-custom-green-100 flex justify-center items-center p-6">
      <LoginForm
        setErrorModalOpen={setErrorModalOpen}
        setModalMessage={setModalMessage}
        setModalTitle={setModalTitle}
      />

      <CustomModal
        isModalOpen={errorModalOpen}
        setModalOpen={setErrorModalOpen}
        title={modalTitle}
        message={modalMessage}
        type="ERROR"
      />
    </div>
  );
}
