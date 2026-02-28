'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import useAlert from "@/hooks/useAlert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import { Categories } from "@/types/categories";

interface ModalCategoryProps {
    isOpen: boolean;
    closeModal: () => void;
    selected: Categories | null;
    setSelected: (Category: Categories | null) => void;
    handleCreateCategory: (e: React.FormEvent<HTMLFormElement>, Category: Categories) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalCategory({ isOpen, closeModal, selected, setSelected, handleCreateCategory, alertProps } : ModalCategoryProps) {

    const emptyCategory: Categories = {
        name: "",
        slug: "",
        image_url: new File([], ""),
        description: ""
    };

    // Si selected existe, usarlo; si no, usar emptyCategory
    const [FormDataCategory, setFormDataCategory] = useState<Categories>(selected || emptyCategory);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        setFormDataCategory(selected || emptyCategory);
      }
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataCategory(emptyCategory);
      setSelected(null);
      alertProps.closeAlert();
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataCategory((prevData) => {   
            if( name === "category_id" || name === "idbrand"){
                const numericValue = parseInt(value);
                return {
                    ...prevData,
                    [name]: isNaN(numericValue) ? 0 : numericValue
                };
            }

            if(name === "price" || name === "stock" || name === "discount") {
                const numericValue = parseFloat(value);
                return {
                    ...prevData,
                    [name]: isNaN(numericValue) ? 0 : numericValue
                };
            }
            
            return {
                ...prevData,
                [name]: value
            };
        });
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormDataCategory((prevData) => ({
            ...prevData,
            image_url: file ? file : prevData.image_url 
        }));
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            className="max-w-[700px] p-6 lg:p-10"
          >
            <form onSubmit={(e) => handleCreateCategory(e, FormDataCategory)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
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
                        id="input-name"
                        name="name"
                        value={FormDataCategory ? FormDataCategory.name : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                    <Label htmlFor="slug">Slug:</Label>
                    <InputField
                      id="input-slug"
                      name="slug"
                      value={FormDataCategory ? FormDataCategory.slug : ""}
                      onChange={handleDataChange}
                    />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <Label htmlFor="description">Descripción:</Label>
                    <TextArea 
                        className="text-color-black"
                        name="description"
                        value={FormDataCategory ? FormDataCategory.description : ""}
                        onChange={handleDataChange}
                    />
                  </FormGroupInput>
                </FormRow>
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <div className="mt-4 flex-1 flex flex-col items-center gap-4">
                    {
                      <Image
                         src={
                           FormDataCategory.image_url && FormDataCategory.image_url instanceof File && FormDataCategory.image_url.size > 0 ? URL.createObjectURL(FormDataCategory.image_url) :
                           selected?.image_url ? (process.env.NEXT_PUBLIC_URL_IMAGES ?? "") + selected.image_url :
                           "/images/error/404_image.png"
                         }
                         alt="Category Image"
                         width={200}
                         unoptimized={process.env.NODE_ENV ? true : false}
                         height={200}
                       />
                    }
                  <Label htmlFor="image">Imagen principal:</Label>
                  <FileInput
                    name="image"
                    onChange={handleImageChange}
                  />
                </div>
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