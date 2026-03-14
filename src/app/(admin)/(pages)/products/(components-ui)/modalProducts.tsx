'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import { CategoryAttribute, ImagesProduct, Product, ProductAttribute } from "@/types/produts";
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
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import ImagesDropzone from "@/components/form/form-elements/ImagesDropZone";
import AddIcon from "../../../../../../public/images/icons/add-icon";
import { getAttributesByProductId, getCategoryAttributesByCategoryId, getImagesByProductId } from "@/services/produtsServices";
import { getCategories } from "@/services/categoriesServices";
import { Categories } from "@/types/categories";
import { getBrands } from "@/services/brandsServices";
import { Brands } from "@/types/brands";

interface ModalProductProps {
    isOpen: boolean;
    loading?: boolean;
    errorInput: string | null;
    setErrorInput: (field: string | null) => void;
    closeModal: () => void;
    selected: Product | null;
    setSelected: (product: Product | null) => void;
    handleCreateProduct: (e: React.FormEvent<HTMLFormElement>, product: Product, images: File[] | string[], productAttributes: { key: string; value: string }[]) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalProduct({ setErrorInput, loading, isOpen, closeModal, selected, setSelected, handleCreateProduct, alertProps, errorInput } : ModalProductProps) {

    const emptyProduct: Product = {
        name: "",
        sku: "",
        slug: "",
        description_short: "",
        description_long: "",
        image: selected?.image || new File([], ""),
        price: 0,
        category_id: "",
        idbrand: "",
        stock: 0,
        discount: 0,
    };

    // Options para selects
    const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
    const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);

    // Si selected existe, usarlo; si no, usar emptyProduct
    const [FormDataProduct, setFormDataProduct] = useState<Product>(emptyProduct);
    const [productAttributes, setProductAttributes] = useState<{ key: string; value: string }[]>([]);
    const [categoryAttributes, setCategoryAttributes] = useState<{ value: string; label: string }[]>([]);

    // images
    const [imageExtrasFiles, setImageExtrasFiles] = useState<File[] | string[]>(Array(4).fill(null));

    useEffect(() => {
      if (!isOpen) return;

      if (selected) {
        setFormDataProduct(selected);
        handleImagesByProductId(selected.id || "");
        handlegetAttributesByProductId(selected.id || "");
      } else {
        handleClearForm();
      }
      handleFetchCategories();
      handleFetchBrands();
    }, [isOpen, selected]);

    useEffect(() => {
      if(FormDataProduct.category_id) {
        handlegetCategoryAttributesByCategoryId(FormDataProduct.category_id);
      }
    }, [FormDataProduct.category_id]);

    async function handlegetCategoryAttributesByCategoryId(categoryId: string) {
      try {
        const attributes = await getCategoryAttributesByCategoryId(categoryId);
        const formattedAttributes = attributes.map((attr: CategoryAttribute) => ({
          value: attr.id as string,
          label: attr.attribute_name,
        }));
        setCategoryAttributes(formattedAttributes);
      }catch (error) {
        console.error("Error fetching category attributes:", error);
      }
    }

    async function handleFetchCategories() {
      try {
        const categories = await getCategories();
        const formattedCategories = categories.map((cat: Categories) => ({
          value: cat.id as string,
          label: cat.name,
        }));
        setCategories(formattedCategories);
      }catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    async function handleFetchBrands() {
      try {
        const brands = await getBrands();
        const formattedBrands = brands.map((brand: Brands) => ({
          value: brand.id as string,
          label: brand.name,
        }));
        setBrands(formattedBrands);
      }catch (error) {
        console.error("Error fetching brands:", error);
      }
    }

    async function handleImagesByProductId(productId: string) {
      try {
        const images = await getImagesByProductId(productId);
        const imageFiles = images.map((img: ImagesProduct, index) => {
          return img.image_url;
        });

        const imagesUnWhithImageMain = images
          .filter((img: ImagesProduct) => img.sort_order !== 0)
          .map((img: ImagesProduct) => img.image_url);
        setImageExtrasFiles(imagesUnWhithImageMain);
      }catch (error) {
        console.error("Error fetching images for product ID:", productId, error);
      }
    }

    async function handlegetAttributesByProductId(productId: string) {
      try {
        const attributes = await getAttributesByProductId(productId);
        const formattedAttributes = attributes.map((attr: ProductAttribute) => ({
          key: attr.id as string,
          value: attr.attribute_value,
        }));
        setProductAttributes(formattedAttributes);
      }catch (error) {
        console.error("Error fetching attributes for product ID:", productId, error);
      }
    }

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataProduct(emptyProduct);
      setImageExtrasFiles(Array(4).fill(null));
      setProductAttributes([]);
      setSelected(null);
      alertProps.closeAlert();
      setErrorInput(null);
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataProduct((prevData) => {   
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

    const handleAttributesChange = (index: number, field: "key" | "value", e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let { value } = e.target;

      setProductAttributes((prevAttributes) => (
        prevAttributes.map((attr, idx) => {
          if (idx === index) {
            if(field === "key") {
              return { ...attr, key: value };
            } else {
              return { ...attr, value };
            }
          }
          return attr;
        })
      ))
    }

    const handleAddAttribute = () => {
      setProductAttributes((prevAttributes) => [
        ...prevAttributes,
        { key: "", value: "" }
      ]);
    }

    const handleImageChange = (files: File[]) => {
        const file = files[0];
        setFormDataProduct((prevData) => ({
            ...prevData,
            image: file ? file : prevData.image 
        }));
    }

    function handleDeleteAttribute(index: number) {
      setProductAttributes((prevAttributes) => prevAttributes.filter((_, i) => i !== index));
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            className="max-w-[1200px] p-6 lg:p-10"
          >
            <form onSubmit={(e) => handleCreateProduct(e, FormDataProduct, imageExtrasFiles, productAttributes)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Producto` : `Agregar Producto`}
                </h5>
              </div>
              <div className="mt-4">
                { alertProps.showAlert && (
                  <Alert
                    title={alertProps.alertTitle}
                    variant={alertProps.alertVariant}
                    message={alertProps.alertMessage}
                  />
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                <div>
                  <FormRow>
                    <FormGroupInput>
                        <Label htmlFor="name">Nombre del Producto:</Label>
                        <InputField
                          className={`${errorInput === "name" ? "border-red-500" : ""}`}
                          id="input-name"
                          name="name"
                          value={FormDataProduct ? FormDataProduct.name : ""}
                          onChange={handleDataChange}
                        />
                    </FormGroupInput>
                  </FormRow>
                  <FormRow>
                    <FormGroupInput>
                      <Label htmlFor="slug">Slug:</Label>
                      <InputField
                        className={`${errorInput === "slug" ? "border-red-500" : ""}`}
                        id="input-slug"
                        name="slug"
                        value={FormDataProduct ? FormDataProduct.slug : ""}
                        onChange={handleDataChange}
                      />
                    </FormGroupInput>
                    <FormGroupInput>
                      <Label htmlFor="sku">Sku:</Label>
                      <InputField
                        className={`${errorInput === "sku" ? "border-red-500" : ""}`}
                        id="input-sku"
                        name="sku"
                        value={FormDataProduct ? FormDataProduct.sku : ""}
                        onChange={handleDataChange}
                      />
                    </FormGroupInput>
                  </FormRow>
                  <FormRow>
                    <FormGroupInput>
                      <Label htmlFor="category">Categoria:</Label>
                      <Select
                        className={`${errorInput === "category_id" ? "border-red-500" : ""}`}
                        name="category_id"
                        value={FormDataProduct ? FormDataProduct.category_id : ""}
                        onChange={handleDataChange}
                        options={categories}
                      />
                    </FormGroupInput>
                    <FormGroupInput>
                      <Label htmlFor="idbrand">Marca:</Label>
                      <Select
                        className={`${errorInput === "idbrand" ? "border-red-500" : ""}`}
                        name="idbrand"
                        value={FormDataProduct ? FormDataProduct.idbrand : ""}
                        onChange={handleDataChange}
                        options={brands}
                      />
                    </FormGroupInput>
                  </FormRow>
                  <FormRow>
                    <FormGroupInput>
                      <Label htmlFor="description_short">Descripción corta:</Label>
                      <TextArea 
                          className={`${errorInput === "description_short" ? "border-red-500" : ""}`}
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
                          className={`${errorInput === "description_long" ? "border-red-500" : ""}`}
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
                          className={`${errorInput === "price" ? "border-red-500" : ""}`}
                          id="input-price"
                          name="price"
                          value={FormDataProduct ? FormDataProduct.price : ""}
                          onChange={handleDataChange}
                        />
                      </FormGroupInput>
                      <FormGroupInput>
                        <Label htmlFor="stock">Stock:</Label>
                        <InputField
                          className={`${errorInput === "stock" ? "border-red-500" : ""}`}
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
                            className={`${errorInput === "discount" ? "border-red-500" : ""}`}
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
                <div>
                  <div>
                    {categoryAttributes.length > 0 && FormDataProduct.category_id ? (<Button onClick={handleAddAttribute} className="mt-4 w-full bg-blue-100"><AddIcon width={20} height={20} fill="white"/> Añadir atributo</Button>) : null}
                      {
                        categoryAttributes && productAttributes.map((attr, index) => (
                          <FormRow key={index}>
                            <FormGroupInput>
                                <Label htmlFor="key">Atributo:</Label>
                                <Select 
                                  onChange={e => handleAttributesChange(index, "key", e)}
                                  name="key"
                                  value={attr.key}
                                  options={categoryAttributes}
                                />
                            </FormGroupInput>
                            <FormGroupInput>
                                <Label htmlFor="value">Valor:</Label>
                                <InputField
                                  id="input-value"
                                  name="value"
                                  value={attr.value}
                                  onChange={e => handleAttributesChange(index, "value", e)}
                                />
                            </FormGroupInput>
                            <button
                              type="button"
                              onClick={() => handleDeleteAttribute(index)}
                            >
                              <DeleteIcon className="mb-4" fill="red" width={20} height={20} />
                            </button>
                          </FormRow>
                        ))
                      }
                    </div>
                    <div className="flex flex-col gap-4 mt-8">
                      <FormRow>
                        <FormGroupInput>
                          <DropzoneComponent
                            onDrop={handleImageChange}
                            image={FormDataProduct.image}
                            ImageDefault={selected?.image}
                          />
                        </FormGroupInput>
                      </FormRow>
                      <ImagesDropzone
                        imageExtrasFiles={imageExtrasFiles}
                        setImageExtrasFiles={setImageExtrasFiles}
                      />
                    </div>
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