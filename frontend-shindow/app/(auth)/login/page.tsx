"use client";
import LoginForm from "@/components/loginForm";
import CustomModal from "@/components/customModal";
import { useState } from "react";

export default function Login() {
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  return (
    <div className="w-full min-h-screen bg-custom-green-100 flex justify-center items-center">
      <LoginForm
        setErrorModalOpen={setErrorModalOpen}
        setModalMessage={setModalMessage}
      />

      <CustomModal
        isModalOpen={errorModalOpen}
        setModalOpen={setErrorModalOpen}
        title="Login failed!"
        message={modalMessage}
        type="ERROR"
      />
    </div>
  );
}
