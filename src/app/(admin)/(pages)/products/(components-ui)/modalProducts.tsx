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

interface ModalProductProps {
    isOpen: boolean;
    closeModal: () => void;
    selected: Product | null;
}

export default function ModalProduct({ isOpen, closeModal, selected } : ModalProductProps) {

    const emptyProduct: Product = {
        id: 0,
        name: "",
        slug: "",
        description_short: "",
        description_long: "",
        image: "", 
        price: 0,
        category_id: 0,
        idbrand: 0,
        stock: 0,
        discount: 0,
        rating: 0,
        reviews: 0,
        is_active: true,
        created_at: "",
        updated_at: ""
    };

    // Si selected existe, usarlo; si no, usar emptyProduct
    const [FormDataProduct, setFormDataProduct] = useState<Product>(selected || emptyProduct);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [extraImageFiles, setExtraImageFiles] = useState<FileList | null>(null);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      setFormDataProduct(selected || emptyProduct);
    },[selected, isOpen]);

    const handleCloseModal = () => {
        setFormDataProduct(emptyProduct);
        setImageFile(null);
        setExtraImageFiles(null);
        closeModal();
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
        setImageFile(file);
    }

    const handleExtraImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setExtraImageFiles(files);
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
            <form className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Producto` : `Agregar Producto`}
                </h5>
              </div>
              <div className="mt-8">
                <div className="flex md:flex-row flex-col gap-4">
                  <div className="mt-4 flex-1">
                    <Label htmlFor="name">Nombre:</Label>
                    <InputField
                      id="input-name"
                      name="name"
                      value={FormDataProduct ? FormDataProduct.name : ""}
                      onChange={handleDataChange}
                    />
                  </div>
                  <div className="mt-4 flex-1">
                    <Label htmlFor="slug">Slug:</Label>
                    <InputField
                      id="input-slug"
                      name="slug"
                      value={FormDataProduct ? FormDataProduct.slug : ""}
                      onChange={handleDataChange}
                    />
                  </div>
                </div>
                <div className="flex md:flex-row flex-col gap-4 mt-4">
                  <div className="mt-4 flex-1">
                    <Label htmlFor="price">Precio:</Label>
                    <InputField
                      id="input-price"
                      name="price"
                      value={FormDataProduct ? FormDataProduct.price : ""}
                      onChange={handleDataChange}
                    />
                  </div>
                  <div className="mt-4 flex-1">
                    <Label htmlFor="category">Categoria:</Label>
                    <Select
                      name="category_id"
                      value={FormDataProduct ? FormDataProduct.category_id?.toString() : ""}
                      onChange={handleDataChange}
                      options={optionsCategory}
                    />
                  </div>
                  <div className="mt-4 flex-1">
                    <Label htmlFor="idbrand">Marca:</Label>
                    <Select
                      name="idbrand"
                      value={FormDataProduct ? FormDataProduct.idbrand?.toString() : ""}
                      onChange={handleDataChange}
                      options={optionsCategory}
                    />
                  </div>
                </div>
                <div className="flex md:flex-row flex-col gap-4 mt-4">
                  <div className="mt-4 flex-1">
                    <Label htmlFor="description_short">Descripción corta:</Label>
                    <TextArea 
                        name="description_short"
                        value={FormDataProduct ? FormDataProduct.description_short : ""}
                        onChange={handleDataChange}
                    />
                  </div>
                </div>
                <div className="flex md:flex-row flex-col gap-4 mt-4">
                  <div className="mt-4 flex-1">
                    <Label htmlFor="description_long">Descripción larga:</Label>
                    <TextArea 
                        name="description_long"
                        value={FormDataProduct ? FormDataProduct.description_long : ""}
                        onChange={handleDataChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-4 mt-4">
                <div className="mt-4">
                  <Label htmlFor="price">Precio:</Label>
                  <InputField
                    id="input-price"
                    name="price"
                    value={FormDataProduct ? FormDataProduct.price : ""}
                    onChange={handleDataChange}
                  />
                </div>
                <div className="mt-4">
                  <Label htmlFor="stock">Stock:</Label>
                  <InputField
                    id="input-stock"
                    name="stock"
                    value={FormDataProduct ? FormDataProduct.stock : ""}
                    onChange={handleDataChange}
                  />
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-4 mt-4">
                <div className="mt-4">
                  <Label htmlFor="discount">Descuento:</Label>
                  <InputField
                    id="input-discount"
                    name="discount"
                    type="number"
                    value={FormDataProduct ? FormDataProduct.discount : 0}
                    onChange={handleDataChange}
                  />
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-4 mt-8">
                <div className="mt-4 flex-1 flex flex-col items-center gap-4">
                    {
                      imageFile && (
                        <Image
                          src={URL.createObjectURL(imageFile)}
                          alt="Product Image"
                          width={200}
                          height={200}
                        />
                      )
                    }
                  <Label htmlFor="image">Imagen principal:</Label>
                  <FileInput
                    onChange={handleImageChange}
                  />
                </div>
                <div className="mt-4 flex-1 flex flex-col items-center gap-4">
                  <Label htmlFor="extra-images">Imágenes adicionales:</Label>
                  <FileInput
                    onChange={handleExtraImagesChange}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {extraImageFiles && extraImageFiles.length > 0 &&
                      Array.from(extraImageFiles).map((file: File, idx: number) => (
                        <Image
                          key={idx}
                          src={URL.createObjectURL(file)}
                          alt={`Extra ${idx + 1}`}
                          width={80}
                          height={80}
                          className="rounded border"
                        />
                      ))}
                  </div>
                  <div>
                    <Button >Agregar</Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                >
                  {selected ? "Update Changes" : "Add Event"}
                </button>
              </div>
            </form>
        </Modal>

    )
}