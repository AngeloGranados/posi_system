'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import TextArea from "@/components/form/input/TextArea";
import { ShippingMethods } from "@/types/shippingMethods";


interface ModalShippingMethodsProps {
    isOpen: boolean;
    loading: boolean;
    closeModal: () => void;
    selected: ShippingMethods | null;
    setSelected: (ShippingMethods: ShippingMethods | null) => void;
    handleCreateShippingMethods: (e: React.FormEvent<HTMLFormElement>, ShippingMethods: ShippingMethods) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalShippingMethods({ loading, isOpen, closeModal, selected, setSelected, handleCreateShippingMethods, alertProps } : ModalShippingMethodsProps) {

    const emptyShippingMethods: ShippingMethods = {
        name: "",
        code: "",
        description: "",
        estimated_days_min: 0,
        estimated_days_max: 0,
        price: 0,
    };

    // Si selected existe, usarlo; si no, usar emptyShippingMethods
    const [FormDataShippingMethods, setFormDataShippingMethods] = useState<ShippingMethods>(selected || emptyShippingMethods);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        setFormDataShippingMethods(selected || emptyShippingMethods);
      }
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataShippingMethods(emptyShippingMethods);
      setSelected(null);
      alertProps.closeAlert();
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataShippingMethods((prevData) => {      

            if(name === "estimated_days_min" || name === "estimated_days_max"){
                return {
                    ...prevData,
                    [name]: Number(value) 
                };
            }

            if(name === "price"){
                return {
                    ...prevData,
                    [name]: parseFloat(value) 
                };
            }

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
            <form onSubmit={(e) => handleCreateShippingMethods(e, FormDataShippingMethods)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Método de Envío` : `Agregar Método de Envío`}
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
                        value={FormDataShippingMethods ? FormDataShippingMethods.name : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="code">Code:</Label>
                      <InputField
                        id="input-code"
                        name="code"
                        value={FormDataShippingMethods ? FormDataShippingMethods.code : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="description">Descripcion:</Label>
                      <TextArea 
                        name="description"
                        value={FormDataShippingMethods ? FormDataShippingMethods.description : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="description">Tiempo estimado (min):</Label>
                      <InputField 
                        type="number"
                        name="estimated_days_min"
                        value={FormDataShippingMethods ? FormDataShippingMethods.estimated_days_min : 0}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="description">Tiempo estimado (max):</Label>
                      <InputField 
                        type="number"
                        name="estimated_days_max"
                        value={FormDataShippingMethods ? FormDataShippingMethods.estimated_days_max : 0}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="description">Precio:</Label>
                      <InputField 
                        type="number"
                        name="price"
                        value={FormDataShippingMethods ? FormDataShippingMethods.price : 0}
                        onChange={handleDataChange}
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
                  disabled={loading}
                  className={`btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto ${loading ? "opacity-50 cursor-not-allowed bg-brand-600" : ""}`}
                >
                  {loading ? "..cargando" : selected ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
        </Modal>

    )
}