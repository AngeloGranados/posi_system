'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import { Blog } from "@/types/blog";
import TextArea from "@/components/form/input/TextArea";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import DatePicker from "@/components/form/date-picker";
import { getNowDate } from "../../../../../../util";
import Checkbox from "@/components/form/input/Checkbox";
import CheckboxComponents from "@/components/form/form-elements/CheckboxComponents";
import Select from "@/components/form/Select";
import { getBlogCategories } from "@/services/BlogCategoriesServices";
import { BlogCategories } from "@/types/BlogCategories";

interface ModalBlogProps {
    isOpen: boolean;
    loading: boolean;
    setErrorInput: (field: string | null) => void; 
    errorInput: string | null;
    closeModal: () => void;
    selected: Blog | null;
    setSelected: (Blog: Blog | null) => void;
    handleCreateBlog: (e: React.FormEvent<HTMLFormElement>, Blog: Blog) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalBlog({ setErrorInput, errorInput, loading, isOpen, closeModal, selected, setSelected, handleCreateBlog, alertProps } : ModalBlogProps) {

    const emptyBlog: Blog = {
        title: "",
        slug: "",
        category_id: 0,
        duration: 0,
        summary: "",
        content: "",
        image_url: new File([], ""),
        author: "",
        published_at: "",
        is_published: false
    };

    // Si selected existe, usarlo; si no, usar emptyBlog
    const [FormDataBlog, setFormDataBlog] = useState<Blog>(selected || emptyBlog);

    const [BlogCategoriesOptions, setBlogCategoriesOptions] = useState<{ value: string; label: string }[]>([]);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        setFormDataBlog(selected || emptyBlog);
      }

      handleFetchBlogCategories();
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataBlog(emptyBlog);
      setSelected(null);
      alertProps.closeAlert();
      setErrorInput(null);
    }

    async function handleFetchBlogCategories() {
      try {
        const BlogCategories = await getBlogCategories();
        const formattedCategories = BlogCategories.data.map((cat: BlogCategories) => ({
          value: cat.id as string,
          label: cat.name,
        }));
        setBlogCategoriesOptions(formattedCategories);
      }catch (error) {
        console.error("Error fetching BlogCategories:", error);
      }
    }

    const handleImageChange = (files: File[]) => {
      if (files && files.length > 0) {
        const file = files[0];
        setFormDataBlog((prevData) => ({
          ...prevData,
          image_url: file
        }))
      }
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataBlog((prevData) => { 

            if (name === "duration") {
                const durationValue = Number(value);
                if (!isNaN(durationValue)) {
                    return {
                        ...prevData,
                        [name]: durationValue
                    };
                }
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
            <form onSubmit={(e) => handleCreateBlog(e, FormDataBlog)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Post` : `Agregar Post`}
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
                      <Label htmlFor="title">Titulo:</Label>
                      <InputField
                        className={errorInput === "title" ? "border-red-500" : ""}
                        id="input-title"
                        name="title"
                        placeholder="Ej: Nuevo lanzamiento de producto"
                        value={FormDataBlog.title ? FormDataBlog.title : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                    <Label htmlFor="slug">Slug:</Label>
                    <InputField
                      className={errorInput === "slug" ? "border-red-500" : ""}
                      id="input-slug"
                      placeholder="Ej: nuevo-lanzamiento-de-producto"
                      name="slug"
                      value={FormDataBlog.slug ? FormDataBlog.slug : ""}
                      onChange={handleDataChange}
                    />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="category">Categoria:</Label>
                      <Select
                        className={`${errorInput === "category_id" ? "border-red-500" : ""}`}
                        name="category_id"
                        value={FormDataBlog.category_id ? FormDataBlog.category_id : ""}
                        onChange={handleDataChange}
                        options={BlogCategoriesOptions}
                      />
                    </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="content">Contenido (codigo HTML)*:</Label>
                      <TextArea
                        className={errorInput === "content" ? "border-red-500" : ""}
                        name="content"
                        placeholder="Ej: Este es el contenido del blog"
                        value={FormDataBlog.content ? FormDataBlog.content : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="summary">Resumen:</Label>
                      <TextArea
                        className={errorInput === "summary" ? "border-red-500" : ""}
                        name="summary"
                        placeholder="Ej: Este es el resumen del blog"
                        value={FormDataBlog.summary ? FormDataBlog.summary : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="duration">Duración (Seg)*:</Label>
                      <InputField
                        className={errorInput === "duration" ? "border-red-500" : ""}
                        id="input-duration"
                        name="duration"
                        type="number"
                        placeholder="Ej: 5"
                        value={FormDataBlog.duration ? FormDataBlog.duration : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="author">Autor:</Label>
                      <InputField
                        className={errorInput === "author" ? "border-red-500" : ""}
                        id="input-author"
                        name="author"
                        placeholder="Ej: Juan Pérez"
                        value={FormDataBlog.author ? FormDataBlog.author : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="published_at">Fecha de publicación:</Label>
                      <DatePicker 
                        id="valid_from"
                        placeholder="Selecciona la fecha de publicación"
                        defaultDate={FormDataBlog.published_at || getNowDate()}
                        onChange={(dates, currentDateString) => {
                          console.log("Fecha seleccionada:", currentDateString);
                          setFormDataBlog((prev) => ({
                            ...prev,
                            published_at: currentDateString ? currentDateString : prev.published_at,
                          }));
                        }}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                    <Checkbox 
                        id="is_published"
                        name="is_published"
                        label="Publicado"
                        checked={FormDataBlog.is_published == 1 ? true : false}
                        onChange={(checked) => setFormDataBlog((prev) => ({
                          ...prev,
                          is_published: checked
                        }))}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <DropzoneComponent
                      onDrop={handleImageChange}
                      image={FormDataBlog.image_url}
                      ImageDefault={`blog/${selected?.image_url}`}
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