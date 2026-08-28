'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import { BlogCategories } from "@/types/BlogCategories";

interface ModalBlogCategoriesProps {
    isOpen: boolean;
    loading: boolean;
    errorInput: string | null;
    setErrorInput: (field: string | null) => void;
    closeModal: () => void;
    selected: BlogCategories | null;
    setSelected: (BlogCategories: BlogCategories | null) => void;
    handleCreateBlogCategories: (e: React.FormEvent<HTMLFormElement>, BlogCategories: BlogCategories) => Promise<void>;
    isPrincipal: boolean;
    setIsPrincipal: (isPrincipal: boolean) => void;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalBlogCategories({ setErrorInput, errorInput, loading, isOpen, closeModal, selected, setSelected, handleCreateBlogCategories, alertProps, isPrincipal, setIsPrincipal } : ModalBlogCategoriesProps) {

    const emptyBlogCategories: BlogCategories = {
        name: "",
        slug: "",
        description: ""
    };

    // Si selected existe, usarlo; si no, usar emptyBlogCategories
    const [FormDataBlogCategories, setFormDataBlogCategories] = useState<BlogCategories>(emptyBlogCategories);

   
    useEffect(() => {
      if(!isOpen) return;

      if(!selected){
        handleClearForm();
      }else{
        setFormDataBlogCategories(selected || emptyBlogCategories);
      }
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataBlogCategories(emptyBlogCategories);
      setSelected(null);
      alertProps.closeAlert();
      setErrorInput(null);
      setIsPrincipal(true);
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataBlogCategories((prevData) => {
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
            <form onSubmit={(e) => handleCreateBlogCategories(e, FormDataBlogCategories)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Categoria` : `Agregar Categoria`}
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
                        value={FormDataBlogCategories ? FormDataBlogCategories.name : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                    <Label htmlFor="slug">Slug:</Label>
                    <InputField
                      className={errorInput === "slug" ? "border-red-500" : ""}
                      id="input-slug"
                      name="slug"
                      value={FormDataBlogCategories ? FormDataBlogCategories.slug : ""}
                      onChange={handleDataChange}
                    />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <Label htmlFor="description">Descripción:</Label>
                    <TextArea 
                        className={errorInput === "description" ? "border-red-500" : ""}
                        name="description"
                        value={FormDataBlogCategories ? FormDataBlogCategories.description : ""}
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
                  className={`btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-400 sm:w-auto ${loading ? "opacity-50 cursor-not-allowed bg-red-400" : ""}`}
                >
                  {loading ? "..cargando" : selected ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
        </Modal>

    )
}