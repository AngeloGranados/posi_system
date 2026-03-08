'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import { Users } from "@/types/users";
import Select from "@/components/form/Select";


interface ModalUsersProps {
    isOpen: boolean;
    closeModal: () => void;
    selected: Users | null;
    setSelected: (Users: Users | null) => void;
    handleCreateUsers: (e: React.FormEvent<HTMLFormElement>, Users: Users) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalUsers({ isOpen, closeModal, selected, setSelected, handleCreateUsers, alertProps } : ModalUsersProps) {

    const emptyUsers: Users = {
        email : "",
        password_hash : "",
        nombres : "",
        apellidos : "",
        telefono : "",
        type : ""
    };

    // Si selected existe, usarlo; si no, usar emptyUsers
    const [FormDataUsers, setFormDataUsers] = useState<Users>(selected || emptyUsers);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        setFormDataUsers(selected || emptyUsers);
      }
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataUsers(emptyUsers);
      setSelected(null);
      alertProps.closeAlert();
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataUsers((prevData) => {      
            return {
                ...prevData,
                [name]: value
            };
        });
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            className="max-w-[700px] p-6 lg:p-10"
          >
            <form onSubmit={(e) => handleCreateUsers(e, FormDataUsers)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Usuario` : `Agregar Usuario`}
                </h5>
              </div>
              <div className="mt-8">
                { alertProps.showAlert && (
                  <Alert
                    title={alertProps.alertTitle}
                    variant={alertProps.alertVariant}
                    message={alertProps.alertMessage}
                  />
                )}
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="nombres">Nombre:</Label>
                      <InputField
                        id="nombres"
                        name="nombres"
                        value={FormDataUsers ? FormDataUsers.nombres : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="apellidos">Apellidos:</Label>
                      <InputField
                        id="apellidos"
                        name="apellidos"
                        value={FormDataUsers ? FormDataUsers.apellidos : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="description">Email:</Label>
                      <InputField
                        type="email"
                        name="email"
                        value={FormDataUsers ? FormDataUsers.email : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="password_hash">Contraseña:</Label>
                      <InputField
                        type="password"
                        name="password_hash"
                        value={FormDataUsers ? FormDataUsers.password_hash : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="telefono">Teléfono:</Label>
                      <InputField
                        name="telefono"
                        value={FormDataUsers ? FormDataUsers.telefono : 0}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="type">Tipo:</Label>
                      <Select
                        name="type"
                        value={FormDataUsers ? FormDataUsers.type : ""}
                        onChange={handleDataChange}
                        options={[
                          { value: "admin", label: "Admin" },
                          { value: "customer", label: "Customer" },
                        ]}
                      />
                  </FormGroupInput>
                </FormRow>
              </div>
              <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                >
                  {selected ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
        </Modal>

    )
}