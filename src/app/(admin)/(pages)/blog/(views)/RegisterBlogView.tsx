'use client';

import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import { Blog, templateType } from "@/types/blog";
import TextArea from "@/components/form/input/TextArea";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import DatePicker from "@/components/form/date-picker";
import Checkbox from "@/components/form/input/Checkbox";
import Select from "@/components/form/Select";
import { getBlogCategories } from "@/services/BlogCategoriesServices";
import { BlogCategories } from "@/types/BlogCategories";
import { getNowDate } from "../../../../../../util";
import ModalTemplates from "../(components-ui)/modalTemplates";
import Image from "next/image";
import { DEFAULT_CONFIG } from "../../../../../../config";
import { ArrowLeftIcon, Edit2Icon } from "lucide-react";

interface RegisterBlogProps {
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

export default function RegisterBlogView({
    isOpen,
    loading,
    setErrorInput,
    errorInput,
    closeModal,
    selected,
    setSelected,
    handleCreateBlog,
    alertProps
}: RegisterBlogProps) {

    const emptyBlog: Blog = {
        title: "",
        slug: "",
        category_id: 0,
        duration: 0,
        summary: "",
        content: [],
        image_url: new File([], ""),
        author: "",
        published_at: "",
        is_published: false
    };

    const [openModalTemplate, setOpenModalTemplate] = useState<boolean>(false);

    const TEMPLATES_OPTIONS = [
        {
          "type_plantilla" : "parrafo_top-img_bottom",
          "container_style" : "flex flex-col-reverse",
          "parrafo_style" : "w-full h-[50%]",
          "parrafo_content" : null,
          "imagen_content" : null,
          "imagen_style" : "w-full h-[50%]"
        },
        {
          "type_plantilla" : "img_top-parrafo_bottom",          
          "container_style" : "flex flex-col",
          "parrafo_style" : "w-full h-[50%]",
          "parrafo_content" : null,
          "imagen_content" : null,
          "imagen_style" : "w-full h-[50%]"
        },
        {
          "type_plantilla" : "parrafo_right_top-img_left_full",          
          "container_style" : "flex flex-row",
          "parrafo_style" : "w-[50%] h-[50%]",
          "parrafo_content" : null,
          "imagen_content" : null,
          "imagen_style" : "w-[50%] h-full"
        },
        {
          "type_plantilla" : "parrafo_left_bottom-img_right_full",          
          "container_style" : "flex flex-row-reverse",
          "parrafo_style" : "self-end w-[50%] h-[50%]",
          "parrafo_content" : null,
          "imagen_content" : null,
          "imagen_style" : "w-[50%] h-full"
        },
        {
          "type_plantilla" : "img_left_full-parrafo_right_top",          
          "container_style" : "flex flex-row",
          "parrafo_style" : "w-[50%] h-[50%]",
          "parrafo_content" : null,
          "imagen_content" : null,
          "imagen_style" : "w-[50%] h-full"
        },
        {
          "type_plantilla" : "img_left_full-parrafo_right_center",          
          "container_style" : "flex flex-row",
          "parrafo_style" : "w-[50%] h-[50%] self-center",
          "parrafo_content" : null,
          "imagen_content" : null,
          "imagen_style" : "w-[50%] h-full"
        },
        {
          "type_plantilla" : "img_right_center-parrafo_left_center",          
          "container_style" : "flex flex-row-reverse items-center",
          "parrafo_style" : "w-[50%] h-[50%]",
          "parrafo_content" : null,
          "imagen_content" : null,
          "imagen_style" : "w-[50%] h-[50%]"
        },
        {
          "type_plantilla" : "img_right_full-parrafo_left_center",          
          "container_style" : "flex flex-row-reverse",
          "parrafo_style" : "w-[50%] h-[50%] self-center",
          "parrafo_content" : null,
          "imagen_content" : null,
          "imagen_style" : "w-[50%] h-full"
        },
        {
          "type_plantilla" : "parrafo_left_top-img_right_bottom",          
          "container_style" : "flex flex-col-reverse",
          "parrafo_style" : "w-[50%] h-full",
          "parrafo_content" : null,
          "imagen_content" : null,    
          "imagen_style" : "w-[50%] h-full self-end"
        },
        {
          "type_plantilla" : "parrafo_right_bottom-img_left_top",          
          "container_style" : "flex flex-col",
          "parrafo_style" : "w-[50%] h-full self-end",
          "parrafo_content" : null,
          "imagen_content" : null,
          "imagen_style" : "w-[50%] h-full"
        }
    ]

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

    const buttonEditTemplate = () => {
        setFormDataBlog((prevData) => ({
            ...prevData,
            content: []
        }));
        setOpenModalTemplate(true);
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

    const handleAddTemplate = (template: templateType) => {
        setFormDataBlog((prevData) => ({
            ...prevData,
            content: prevData.content ? [...prevData.content, template] : [template]
        }));
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
        <div>
            <form onSubmit={(e) => handleCreateBlog(e, FormDataBlog)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
              <button type="button" onClick={() => closeModal()}><ArrowLeftIcon className="w-6 h-6 mb-5" /></button>
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
                <div className="my-4">
                  <h3>Contenido (codigo HTML)*:</h3>
                  <div className="mt-4 border border-gray-300 p-4 w-[800px] mx-auto">
                    {selected && <button type="button" onClick={buttonEditTemplate} className="bg-[#afafff] rounded p-2 flex item-center ml-auto mb-5"><Edit2Icon className="w-4 h-4 fill-[#000]"></Edit2Icon></button>} 
                    {
                      FormDataBlog.content && FormDataBlog.content.length > 0 ? (
                        <div className="flex flex-col gap-10"> 
                          {FormDataBlog.content.map((template) => (
                            <div key={template.type_plantilla}>
                              <div className={`w-full ${template.container_style}`}>
                                <div className={`min-w-0 max-w-full overflow-hidden p-4 ${template.imagen_style}`}>
                                  <Image
                                    unoptimized={process.env.NODE_ENV ? true : false}
                                    src={`${template.imagen_content && typeof template.imagen_content !== "string" ? URL.createObjectURL(template.imagen_content as File) : `${DEFAULT_CONFIG.imagesRoot}blog/${template.imagen_content}`}`}
                                    width={500}
                                    height={300}
                                    alt="Imagen del blog"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className={`min-w-0 max-w-full overflow-hidden break-words whitespace-normal p-4 ${template.parrafo_style}`}>
                                  <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: template.parrafo_content ? template.parrafo_content : "Parrafo" }}></div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button type="button" onClick={() => { setOpenModalTemplate(true); }} className="px-4 py-2 bg-blue-500 mt-20 mx-auto block text-white rounded hover:bg-blue-600 w-full">
                            +
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button type="button" onClick={() => setOpenModalTemplate(true)} className="w-full text-center p-10 border border-gray-300 hover:border-gray-500 cursor-pointer">
                            <span>Inicia el contenido del Blog</span>
                          </button>
                        </div>
                      )
                    }
                  </div>
                </div>
                <ModalTemplates setFormTemplates={handleAddTemplate} openModalTemplate={openModalTemplate} setOpenModalTemplate={setOpenModalTemplate} templatesOptions={TEMPLATES_OPTIONS} />
                {/* Este es el modal para seleccionar una plantilla de una seccion */}
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
                    <div className="w-[800px] h-[400px] overflow-auto">
                      <DropzoneComponent
                        onDrop={handleImageChange}
                        image={FormDataBlog.image_url}
                        ImageDefault={`${DEFAULT_CONFIG.imagesRoot}blog/${selected?.image_url}`}
                      />
                    </div>
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
        </div>
    );
}