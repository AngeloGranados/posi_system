"use client";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { LoginAdmin } from "@/services/loginServices";
import Link from "next/link";
import React, { useState } from "react";
import InputField from "@/components/form/input/InputField";
import { useRouter } from "next/navigation";
import Alert from "../ui/alert/Alert";
import useAlert from "@/hooks/useAlert";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { showAlert, triggerAlert, alertTitle, alertMessage, alertVariant, closeAlert } = useAlert();

  const [FormDataLogin, setFormDataLogin] = useState({
    email: "",
    contrasena: ""
  });

  const router = useRouter();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormDataLogin((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmitLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!FormDataLogin.email || !FormDataLogin.contrasena) {
      triggerAlert("Error", "Por favor, completa todos los campos obligatorios.", "error");
      return;
    }

    try {
      await LoginAdmin(FormDataLogin.email, FormDataLogin.contrasena);
      closeAlert();
      router.push("/");
    } catch (error) {
      triggerAlert("Error", error instanceof Error ? error.message : "Error desconocido", "error");
    }
  }
  
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Iniciar Sesión
            </h1>
          </div>
          <div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
            </div>
            <form onSubmit={handleSubmitLogin}>
              <div className="mb-5">
                {showAlert && (
                  <Alert
                    title={alertTitle}
                    message={alertMessage}
                    variant={alertVariant}
                  />
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <InputField
                     value={FormDataLogin.email} onChange={handleInputChange}
                     type="email"
                     name="email"
                     placeholder="Ingresa tu correo electrónico"
                  />
                </div>
                <div>
                  <Label>
                    Contraseña <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <InputField
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={FormDataLogin.contrasena}
                      name="contrasena"
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div> */}
                <div>
                  <button type="submit" className="btn btn-primary flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
                    Sign in
                  </button>
                </div>
              </div>
            </form>
{/* 
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
