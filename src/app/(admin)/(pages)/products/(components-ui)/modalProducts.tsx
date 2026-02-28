'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import { Product } from "@/types/produts";
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

interface ModalProductProps {
    isOpen: boolean;
    closeModal: () => void;
    selected: Product | null;
    setSelected: (product: Product | null) => void;
    handleCreateProduct: (e: React.FormEvent<HTMLFormElement>, product: Product, images: File[]) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalProduct({ isOpen, closeModal, selected, setSelected, handleCreateProduct, alertProps } : ModalProductProps) {

    const emptyProduct: Product = {
        name: "",
        slug: "",
        description_short: "",
        description_long: "",
        image: selected?.image || new File([], ""),
        price: 0,
        category_id: 0,
        idbrand: 0,
        stock: 0,
        discount: 0,
    };

    // Si selected existe, usarlo; si no, usar emptyProduct
    const [FormDataProduct, setFormDataProduct] = useState<Product>(selected || emptyProduct);

    // images
    const [imageExtrasFiles, setImageExtrasFiles] = useState<File[]>([]);
    const [extraImageFileSelected, setExtraImageFileSelected] = useState<File | null>(null);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        setFormDataProduct(selected || emptyProduct);
      }
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataProduct(emptyProduct);
      setImageExtrasFiles([]);
      setExtraImageFileSelected(null);
      setSelected(null);
      alertProps.closeAlert();
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataProduct((prevData) => {   
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
        setFormDataProduct((prevData) => ({
            ...prevData,
            image: file ? file : prevData.image 
        }));
    }

    const handleExtraImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setExtraImageFileSelected(file);
    }

    function handleAddImagesGallery() {
      if (extraImageFileSelected) {
        setImageExtrasFiles((prevData) => (
          [
            ...prevData || [],
            extraImageFileSelected
          ]
        ))

        setExtraImageFileSelected(null);
      }
    }

    const optionsCategory = [
        { value: "1", label: "Category 1" },
        { value: "2", label: "Category 2" },
        { value: "3", label: "Category 3" },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            className="max-w-[700px] p-6 lg:p-10"
          >
            <form onSubmit={(e) => handleCreateProduct(e, FormDataProduct, imageExtrasFiles)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Producto` : `Agregar Producto`}
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
                        value={FormDataProduct ? FormDataProduct.name : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                    <Label htmlFor="slug">Slug:</Label>
                    <InputField
                      id="input-slug"
                      name="slug"
                      value={FormDataProduct ? FormDataProduct.slug : ""}
                      onChange={handleDataChange}
                    />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <Label htmlFor="category">Categoria:</Label>
                    <Select
                      name="category_id"
                      value={FormDataProduct ? FormDataProduct.category_id?.toString() : ""}
                      onChange={handleDataChange}
                      options={optionsCategory}
                    />
                  </FormGroupInput>
                  <FormGroupInput>
                    <Label htmlFor="idbrand">Marca:</Label>
                    <Select
                      name="idbrand"
                      value={FormDataProduct ? FormDataProduct.idbrand?.toString() : ""}
                      onChange={handleDataChange}
                      options={optionsCategory}
                    />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <Label htmlFor="description_short">Descripción corta:</Label>
                    <TextArea 
                        className="text-color-black"
                        name="description_short"
                        value={FormDataProduct ? FormDataProduct.description_short : ""}
                        onChange={handleDataChange}
                    />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <Label htmlFor="description_long">Descripción larga:</Label>
                    <TextArea 
                        className="text-color-black"
                        name="description_long"
                        value={FormDataProduct ? FormDataProduct.description_long : ""}
                        onChange={handleDataChange}
                    />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <Label htmlFor="price">Precio:</Label>
                    <InputField
                      id="input-price"
                      name="price"
                      value={FormDataProduct ? FormDataProduct.price : ""}
                      onChange={handleDataChange}
                    />
                  </FormGroupInput>
                  <FormGroupInput>
                    <Label htmlFor="stock">Stock:</Label>
                    <InputField
                      id="input-stock"
                      name="stock"
                      value={FormDataProduct ? FormDataProduct.stock : ""}
                      onChange={handleDataChange}
                    />
                  </FormGroupInput>
                  {!selected && (
                    <FormGroupInput>
                      <Label htmlFor="discount">Descuento:</Label>
                      <InputField
                        id="input-discount"
                        name="discount"
                        type="number"
                        value={FormDataProduct ? FormDataProduct.discount : 0}
                        onChange={handleDataChange}
                      />
                    </FormGroupInput>
                  )}

                </FormRow>
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <div className="mt-4 flex-1 flex flex-col items-center gap-4">
                    {
                      <Image
                         src={
                           FormDataProduct.image && FormDataProduct.image instanceof File && FormDataProduct.image.size > 0 ? URL.createObjectURL(FormDataProduct.image) :
                           selected?.image ? (process.env.NEXT_PUBLIC_URL_IMAGES ?? "") + selected.image :
                           "/images/error/404_image.png"
                         }
                         alt="Product Image"
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
                {!selected && (
                  <div className="mt-4 flex-1 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imageExtrasFiles && imageExtrasFiles.length > 0 &&
                        imageExtrasFiles.map((image: File, idx: number) => (
                          <Image
                            key={idx}
                            src={URL.createObjectURL(image)}
                            alt={`Extra ${idx + 1}`}
                            width={80}
                            height={80}
                            className="rounded border"
                          />
                        ))}
                    </div>
                    <Label htmlFor="extra-images">Agregar Imágenes adicionales:</Label>
                    <FileInput
                      onChange={handleExtraImageChange}
                    />
                    <div>
                      <Button onClick={handleAddImagesGallery}>Agregar Imagen</Button>
                    </div>
                  
                  </div>
                )}
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