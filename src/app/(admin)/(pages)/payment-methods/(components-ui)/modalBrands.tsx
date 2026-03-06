'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import { PaymentMethods } from "@/types/paymentMethods";
import TextArea from "@/components/form/input/TextArea";
import Image from "next/image";
import FileInput from "@/components/form/input/FileInput";


interface ModalPaymentMethodsProps {
    isOpen: boolean;
    closeModal: () => void;
    selected: PaymentMethods | null;
    setSelected: (PaymentMethods: PaymentMethods | null) => void;
    handleCreatePaymentMethods: (e: React.FormEvent<HTMLFormElement>, PaymentMethods: PaymentMethods) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalPaymentMethods({ isOpen, closeModal, selected, setSelected, handleCreatePaymentMethods, alertProps } : ModalPaymentMethodsProps) {

    const emptyPaymentMethods: PaymentMethods = {
        name: "",
        code: "",
        account_name: "",
        account_number: "",
        image_url: new File([], ""),
        description: ""
    };

    // Si selected existe, usarlo; si no, usar emptyPaymentMethods
    const [FormDataPaymentMethods, setFormDataPaymentMethods] = useState<PaymentMethods>(selected || emptyPaymentMethods);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        setFormDataPaymentMethods(selected || emptyPaymentMethods);
      }
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataPaymentMethods(emptyPaymentMethods);
      setSelected(null);
      alertProps.closeAlert();
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
        setFormDataPaymentMethods((prevData) => (
          {
            ...prevData,
            image_url: file
          }
        ))
      }
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataPaymentMethods((prevData) => {      
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
            <form onSubmit={(e) => handleCreatePaymentMethods(e, FormDataPaymentMethods)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Método de Pago` : `Agregar Método de Pago`}
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
                      <Label htmlFor="name">Nombre:</Label>
                      <InputField
                        id="input-name"
                        name="name"
                        value={FormDataPaymentMethods ? FormDataPaymentMethods.name : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="code">Code:</Label>
                      <InputField
                        id="input-code"
                        name="code"
                        value={FormDataPaymentMethods ? FormDataPaymentMethods.code : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="account_name">Nombre de cuenta:</Label>
                      <InputField
                        id="input-account_name"
                        name="account_name"
                        value={FormDataPaymentMethods ? FormDataPaymentMethods.account_name : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="account_number">Nro de cuenta:</Label>
                      <InputField
                        id="input-account_number"
                        name="account_number"
                        value={FormDataPaymentMethods ? FormDataPaymentMethods.account_number : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="description">Descripcion:</Label>
                      <TextArea 
                        name="description"
                        value={FormDataPaymentMethods ? FormDataPaymentMethods.description : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <div className="mt-4">
                    <Image
                      width={200}
                      height={200}
                      src={
                        FormDataPaymentMethods.image_url && FormDataPaymentMethods.image_url instanceof File && FormDataPaymentMethods.image_url.size > 0 ? URL.createObjectURL(FormDataPaymentMethods.image_url) :
                           selected?.image_url ? (process.env.NEXT_PUBLIC_URL_IMAGES ?? "") + selected.image_url :
                           "/images/error/404_image.png"
                      }
                      unoptimized={process.env.NODE_ENV ? true : false}
                      alt="Imagen de método de pago"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Imagen:</Label>
                    <FileInput
                      name="image_url"
                      onChange={handleImageChange}
                    />
                  </div>
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