'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import { Attributes } from "@/types/attributes";
import Select from "@/components/form/Select";
import { getCategories } from "@/services/categoriesServices";


interface ModalAttributesProps {
    isOpen: boolean;
    loading: boolean;
    errorInput: string | null;
    setErrorInput: (field: string | null) => void;
    closeModal: () => void;
    selected: Attributes | null;
    setSelected: (Attributes: Attributes | null) => void;
    handleCreateAttributes: (e: React.FormEvent<HTMLFormElement>, Attributes: Attributes) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalAttributes({ errorInput, setErrorInput,loading, isOpen, closeModal, selected, setSelected, handleCreateAttributes, alertProps } : ModalAttributesProps) {

    const emptyAttributes: Attributes = {
        category_id: "",
        attribute_name: "",
        attribute_unit: ""
    };

    const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

    // Si selected existe, usarlo; si no, usar emptyAttributes
    const [FormDataAttributes, setFormDataAttributes] = useState<Attributes>(selected || emptyAttributes);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        setFormDataAttributes(selected || emptyAttributes);
        handleFetchCategories();
      }
    },[selected, isOpen]);

    async function handleFetchCategories() {
      try {
        const response = await getCategories();
        const optionCategories = response.map((category) => ({
          value: category.id as string,
          label: category.name as string
        }))
        setCategories(optionCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataAttributes(emptyAttributes);
      setSelected(null);
      alertProps.closeAlert();
      setErrorInput(null);
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataAttributes((prevData) => {  

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
            <form onSubmit={(e) => handleCreateAttributes(e, FormDataAttributes)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Atributo` : `Agregar Atributo`}
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
                      <Label htmlFor="category_id">Categoria:</Label>
                      <Select 
                        className={errorInput === "category_id" ? "border-red-500" : ""}
                        value={FormDataAttributes ? FormDataAttributes.category_id : ""}
                        name="category_id"
                        onChange={handleDataChange}
                        options={categories}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="attribute_name">Nombre del Atributo:</Label>
                      <InputField
                        className={errorInput === "attribute_name" ? "border-red-500" : ""}
                        id="input-attribute_name"
                        name="attribute_name"
                        value={FormDataAttributes ? FormDataAttributes.attribute_name : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="attribute_unit">Unidad del Atributo:</Label>
                      <InputField
                        className={errorInput === "attribute_unit" ? "border-red-500" : ""}
                        id="input-attribute_unit"
                        name="attribute_unit"
                        value={FormDataAttributes ? FormDataAttributes.attribute_unit : ""}
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