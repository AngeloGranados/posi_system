'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import { Categories } from "@/types/categories";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Checkbox from "@/components/form/input/Checkbox";
import Select from "@/components/form/Select";
import { getCategories, getCategoriesFiltered } from "@/services/categoriesServices";

interface ModalCategoryProps {
    isOpen: boolean;
    loading: boolean;
    errorInput: string | null;
    setErrorInput: (field: string | null) => void;
    closeModal: () => void;
    selected: Categories | null;
    setSelected: (Category: Categories | null) => void;
    handleCreateCategory: (e: React.FormEvent<HTMLFormElement>, Category: Categories) => Promise<void>;
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

export default function ModalCategory({ setErrorInput, errorInput, loading, isOpen, closeModal, selected, setSelected, handleCreateCategory, alertProps, isPrincipal, setIsPrincipal } : ModalCategoryProps) {

    const emptyCategory: Categories = {
        name: "",
        slug: "",
        image_url: new File([], ""),
        description: "",
        parent_id: null
    };

    // Si selected existe, usarlo; si no, usar emptyCategory
    const [FormDataCategory, setFormDataCategory] = useState<Categories>(emptyCategory);
    const [categoriesOptions, setCategoriesOptions] = useState<{ value: string; label: string }[]>([]);

   
    useEffect(() => {
      if(!isOpen) return;

      if(!selected){
        handleClearForm();
      }else{
        setFormDataCategory(selected || emptyCategory);
        setIsPrincipal(selected ? selected.parent_id === null : true);
      }
      fetchCategoriesOptions();
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataCategory(emptyCategory);
      setSelected(null);
      alertProps.closeAlert();
      setErrorInput(null);
      setIsPrincipal(true);
    }

    async function fetchCategoriesOptions() {
      try {
        const response = await getCategoriesFiltered({ parent_id: 'null', limit: 1000 });
        const options = response.data.map((category) => ({
          value: category.id as string,
          label: category.name
        }));
        setCategoriesOptions(options);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataCategory((prevData) => {
            return {
                ...prevData,
                [name]: value
            };
        });
    }

    const handleImageChange = (files: File[]) => {
        const file = files[0];
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
                        className={errorInput === "name" ? "border-red-500" : ""}
                        id="input-name"
                        name="name"
                        value={FormDataCategory ? FormDataCategory.name : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                    <Label htmlFor="slug">Slug:</Label>
                    <InputField
                      className={errorInput === "slug" ? "border-red-500" : ""}
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
                        className={errorInput === "description" ? "border-red-500" : ""}
                        name="description"
                        value={FormDataCategory ? FormDataCategory.description : ""}
                        onChange={handleDataChange}
                    />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <Label htmlFor="description">Tipo:</Label>
                    <Checkbox 
                      label="Principal"
                      id="is_principal"
                      name="is_principal"
                      onChange={() => {
                        setIsPrincipal(true)
                        setFormDataCategory((prevData) => ({
                          ...prevData,
                          parent_id: null
                        }))
                      }}
                      checked={isPrincipal}
                    />
                    <Checkbox 
                      label="Subcategoría"
                      id="is_subcategory"
                      name="is_principal"
                      onChange={() => setIsPrincipal(false)}
                      checked={!isPrincipal}
                    />
                  </FormGroupInput>
                  {
                    !isPrincipal ? (
                      <FormGroupInput>
                        <Label htmlFor="parent_id">Categoría Padre:</Label>
                        <Select 
                          name="parent_id"
                          value={FormDataCategory.parent_id || ""}
                          onChange={handleDataChange}
                          options={categoriesOptions}
                        />
                      </FormGroupInput>
                    ) : null
                  }
                </FormRow>
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <FormRow>
                  <FormGroupInput>
                    <DropzoneComponent
                      onDrop={handleImageChange}
                      image={FormDataCategory.image_url}
                      ImageDefault={selected?.image_url}
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