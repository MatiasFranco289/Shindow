import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaRegUser, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { IoIosKey } from "react-icons/io";
import { CiTextAlignJustify } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import EnvironmentManager from "@/utils/EnvironmentManager";
import CryptoJS from "crypto-js";
import FileManager from "@/utils/FileManager";
import loginValidationSchema from "@/validations/login";
import axiosInstance from "@/utils/axiosInstance";
import { CLIENT_DEFAULT_ERROR_MESSAGE, LOGIN_ENDPOINT } from "@/constants";
import { ApiResponse } from "@/interfaces";
import loginErrorHandler from "@/errorHandlers/loginErrorHandler";
import { useRouter } from "next/navigation";

interface LoginFormValues {
  username: string;
  password: string;
  keyName: string;
  keyContent: string;
  passphrase: string;
}

interface LoginFormProps {
  setErrorModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalMessage: Dispatch<SetStateAction<string>>;
}

export default function LoginForm({
  setErrorModalOpen,
  setModalMessage,
}: LoginFormProps) {
  const router = useRouter();
  const environmentManager = EnvironmentManager.getInstance();
  const fileManager = new FileManager();
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const secret =
    environmentManager.GetEnvironmentVariable("NEXT_PUBLIC_SECRET");
  const loginEndpoint = `${apiBaseUrl}${LOGIN_ENDPOINT}`;
  const initialValues: LoginFormValues = {
    username: "",
    password: "",
    keyName: "",
    keyContent: "",
    passphrase: "",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const labelStyles = "text-2xl font-normal";
  const fieldStyles = (errors: boolean) => {
    return `bg-custom-green-100 w-full h-12 ${
      errors ? "border-red-600" : "border-gray-500"
    } border rounded-lg pl-11 text-2xl font-normal focus:outline-none ${
      errors ? "focus:border-red-500" : "focus:border-gray-400"
    } placeholder-gray-500`;
  };

  // TODO: Proteger rutas (Agregar provider)
  // TODO: Documentar tema del secret y variables de entorno
  // TODO: Responsive

  /**
   * This function emulated a user click over the hidden input stored in the reference in order
   * to open the user file manager and let him choose a file.
   */
  const handleChooseFileClicked = (
    isFileSelected: boolean,
    setFieldValue: CallableFunction
  ) => {
    if (isFileSelected) {
      // If there is already a file selected i remove it
      setFieldValue("keyName", "");
      setFieldValue("keyContent", "");
    } else {
      // If there are no file selected, then i open the file manager to select a file
      if (inputFileRef.current) {
        inputFileRef.current.click();
      }
    }
  };

  const handleFileSelected = async (setFieldValue: CallableFunction) => {
    const input = inputFileRef.current as HTMLInputElement;
    const file = input.files?.[0] as File;
    const fileName = file.name;
    const fileSize = file.size;
    const maxFileSize = parseInt(
      environmentManager.GetEnvironmentVariable("NEXT_PUBLIC_KEY_FILE_MAX_SIZE")
    );

    if (fileSize > maxFileSize) {
      // TODO: Handle error here
      console.log("Ta muy grande mano");
      return;
    }

    // TODO: Handle file read error here
    const fileContent = await fileManager.ReadFile(file);
    const encryptedContent = CryptoJS.AES.encrypt(
      fileContent,
      secret
    ).toString();

    setFieldValue("keyName", fileName);
    setFieldValue("keyContent", encryptedContent);
  };

  const handleFormSubmit = (formValues: LoginFormValues) => {
    setIsLoading(true);

    const bodyRequest = {
      username: formValues.username,
      password: formValues.password,
      privateKey: formValues.keyContent,
      passphrase: CryptoJS.AES.encrypt(
        formValues.passphrase,
        secret
      ).toString(),
    };

    axiosInstance
      .post(loginEndpoint, bodyRequest)
      .then((_response) => {
        router.push("/explorer");
      })
      .catch((err) => {
        console.error(
          `The following error has occurred while trying to login: `
        );

        if (err.response?.data) {
          const response: ApiResponse<null> = err.response.data;
          const responseCode = response.status_code;
          setModalMessage(loginErrorHandler(responseCode));
          console.error(response);
        } else {
          setModalMessage(CLIENT_DEFAULT_ERROR_MESSAGE);
          console.error(err);
        }

        setErrorModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      onSubmit={(values) => handleFormSubmit(values)}
    >
      {({ setFieldValue, values, errors }) => (
        <Form
          className={`bg-custom-green-50 w-[500px] rounded-lg p-8 space-y-6 ${
            isLoading ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          <div className="w-full text-center">
            <h1 className="text-6xl">SHINDOW</h1>
          </div>

          {/* This input is used to simulate a click when the user want's to select a key file*/}
          <input
            type="file"
            className="hidden"
            ref={inputFileRef}
            onChange={() => handleFileSelected(setFieldValue)}
          />

          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className={labelStyles}>
              Username *
            </label>

            <div className="w-full relative mt-1">
              <Field
                name="username"
                type="text"
                className={fieldStyles(!!errors.username) + " pr-2"}
                placeholder="Type your username"
              />

              <div className="absolute top-0 left-2 h-full flex items-center">
                <FaRegUser className="text-3xl" />
              </div>
            </div>

            <div className="ml-1 mt-1 relative ">
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-600 absolute text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className={labelStyles}>
              Password
            </label>

            <div className="w-full relative mt-1">
              <Field
                name="password"
                type={`${showPassword ? "text" : "password"}`}
                className={fieldStyles(false) + " pr-10"}
                placeholder="********"
              />

              <div className="absolute top-0 left-2 h-full flex items-center">
                <IoLockClosedOutline className="text-3xl" />
              </div>

              <div
                className="absolute top-0 right-2 h-full flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaRegEyeSlash className="text-3xl" />
                ) : (
                  <FaRegEye className="text-3xl" />
                )}
              </div>
            </div>
          </div>

          {/* Key */}
          <div className="flex flex-col">
            <label htmlFor="keyName" className={labelStyles}>
              Key
            </label>

            <div className="flex justify-between">
              <div className="w-7/12 relative mt-1">
                <Field
                  name="keyName"
                  type="text"
                  readOnly={true}
                  placeholder="No file selected"
                  className="bg-custom-green-100 w-full h-12 border-gray-500 border rounded-lg pl-11 text-2xl font-normal 
                focus:outline-none focus:border-gray-400 placeholder-gray-500 flex items-center cursor-pointer"
                />

                <div className="absolute left-2 top-0 h-full flex items-center">
                  <IoIosKey className="text-3xl" />
                </div>
              </div>

              <div className=" w-4/12">
                <button
                  className="border border-gray-400 text-white w-full h-full rounded-lg hover:border-gray-200 
                  hover:text-gray-200 active:border-white active:text-white duration-200"
                  type="button"
                  onClick={() =>
                    handleChooseFileClicked(!!values.keyName, setFieldValue)
                  }
                >
                  {`${!values.keyName ? "Choose File" : "Clear selection"}`}
                </button>
              </div>
            </div>
          </div>

          {/* Passphrase */}
          <div className="flex flex-col">
            <label htmlFor="passphrase" className={labelStyles}>
              Passphrase
            </label>

            <div className="w-full relative mt-1">
              <Field
                name="passphrase"
                type={`${showPassphrase ? "text" : "password"}`}
                className={fieldStyles(false) + " pr-10"}
                placeholder="********"
              />

              <div className="absolute top-0 left-2 h-full flex items-center">
                <CiTextAlignJustify className="text-3xl" />
              </div>

              <div
                className="absolute top-0 right-2 h-full flex items-center cursor-pointer"
                onClick={() => setShowPassphrase(!showPassphrase)}
              >
                {showPassphrase ? (
                  <FaRegEyeSlash className="text-3xl" />
                ) : (
                  <FaRegEye className="text-3xl" />
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center pt-8">
            <button
              type="submit"
              className={`border border-gray-400 text-gray-400 hover:border-gray-200 hover:text-gray-200
                active:border-white active:text-white ${
                  isLoading ? "w-3/12" : "w-11/12"
                } text-4xl font-semibold p-6 rounded-xl flex justify-center duration-200`}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "LOGIN"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
