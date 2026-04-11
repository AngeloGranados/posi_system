'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import { Brands } from "@/types/brands";
import TextArea from "@/components/form/input/TextArea";
import DropzoneComponent from "@/components/form/form-elements/DropZone";

interface ModalBrandsProps {
    isOpen: boolean;
    loading: boolean;
    setErrorInput: (field: string | null) => void; 
    errorInput: string | null;
    closeModal: () => void;
    selected: Brands | null;
    setSelected: (Brands: Brands | null) => void;
    handleCreateBrands: (e: React.FormEvent<HTMLFormElement>, Brands: Brands) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalBrands({ setErrorInput, errorInput, loading, isOpen, closeModal, selected, setSelected, handleCreateBrands, alertProps } : ModalBrandsProps) {

    const emptyBrands: Brands = {
        name: "",
        label: "",
        description: "",
        image_url: new File([], ""),
        slug: ""
    };

    // Si selected existe, usarlo; si no, usar emptyBrands
    const [FormDataBrands, setFormDataBrands] = useState<Brands>(selected || emptyBrands);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        setFormDataBrands(selected || emptyBrands);
      }
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataBrands(emptyBrands);
      setSelected(null);
      alertProps.closeAlert();
      setErrorInput(null);
    }

    const handleImageChange = (files: File[]) => {
      if (files && files.length > 0) {
        const file = files[0];
        setFormDataBrands((prevData) => ({
          ...prevData,
          image_url: file
        }))
      }
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataBrands((prevData) => {      
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
            <form onSubmit={(e) => handleCreateBrands(e, FormDataBrands)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Marca` : `Agregar Marca`}
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
                        className={errorInput === "name" ? "border-red-500" : ""}
                        id="input-name"
                        name="name"
                        value={FormDataBrands.name ? FormDataBrands.name : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="label">Etiqueta:</Label>
                      <InputField
                        className={errorInput === "label" ? "border-red-500" : ""}
                        id="input-label"
                        name="label"
                        value={FormDataBrands.label ? FormDataBrands.label : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                    <Label htmlFor="slug">Slug:</Label>
                    <InputField
                      className={errorInput === "slug" ? "border-red-500" : ""}
                      id="input-slug"
                      name="slug"
                      value={FormDataBrands.slug ? FormDataBrands.slug : ""}
                      onChange={handleDataChange}
                    />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="description">Descripcion:</Label>
                      <TextArea
                        className={errorInput === "description" ? "border-red-500" : ""}
                        name="description"
                        value={FormDataBrands.description ? FormDataBrands.description : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <DropzoneComponent
                      onDrop={handleImageChange}
                      image={FormDataBrands.image_url}
                      ImageDefault={`brands/${selected?.image_url}`}
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
                  className={`btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-400 sm:w-auto ${loading ? "opacity-50 cursor-not-allowed bg-red-500" : ""}`}
                >
                  {loading ? "..cargando" : selected ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
        </Modal>

    )
}