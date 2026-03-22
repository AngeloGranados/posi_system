'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useCallback, useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import Select from "@/components/form/Select";
import { InputContainerProduct } from "@/components/form/form-elements/InputContainerProduct";
import { getProductById, getProductsFilter } from "@/services/produtsServices";
import { Product } from "@/types/produts";
import debounce from "debounce";
import Image from "next/image";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import { ImagesProducts } from "@/types/images_products";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import { getAttributesFiltered, getAttributesProductsFiltered } from "@/services/attributesServices";
import { parse } from "path";


interface ModalImagesProductsProps {
    isOpen: boolean;
    loading: boolean;
    errorInput: string | null;
    setErrorInput: (field: string | null) => void;
    closeModal: () => void;
    selected: ImagesProducts | null;
    setSelected: (ImagesProducts: ImagesProducts | null) => void;
    handleCreateImagesProducts: (e: React.FormEvent<HTMLFormElement>, ImagesProducts: ImagesProducts) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalImagesProducts({ errorInput, setErrorInput, loading, isOpen, closeModal, selected, setSelected, handleCreateImagesProducts, alertProps } : ModalImagesProductsProps) {

    const [products, setProducts] = useState<Product[]>([]);
    const [productsFilter, setProductsFilter] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [attributeValuesOptions, setAttributeValuesOptions] = useState<{label: string, value: string}[]>([]);

    const [loadingProducts, setLoadingProducts] = useState(false);
    const emptyImagesProducts: ImagesProducts = {
        product_id: "",
        image_url: selected?.image_url || new File([], ""),
        alt_text: "",
        sort_order: 0,
        attribute_value: ""
    };

    // Si selected existe, usarlo; si no, usar emptyImagesProducts
    const [FormDataImagesProducts, setFormDataImagesProducts] = useState<ImagesProducts>(selected || emptyImagesProducts);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if (!isOpen) return; 

      if(!selected){
        handleClearForm();
      }else{
        setFormDataImagesProducts(selected || emptyImagesProducts);
        handleFetchProductsById(selected.product_id as string);
        handleFetchAttributeValues(selected.product_id as string);
      }
    },[selected, isOpen]);

    async function handleFetchAttributeValues(productId: string) {
      try {
        const response = await getAttributesProductsFiltered({ product_id: productId, ByImageAttributeValues: true });
        const attributeValuesOptions = response.data.map((attr) => (
          {
            label: attr.attribute_value ? attr.attribute_value : "",
            value: attr.attribute_value ? attr.attribute_value : ""
          }
        ))
        setAttributeValuesOptions(attributeValuesOptions);
      } catch (error) {
        console.error("Error fetching attribute values:", error);
      }
    }

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataImagesProducts(emptyImagesProducts);
      setSelected(null);
      setProducts([]);
      setProductsFilter("");
      setSelectedProduct(null);
      alertProps.closeAlert();
      setErrorInput(null);
    }

    const debounceFetch = useCallback(debounce((value) => {
      fetchProducts(value);
    }, 500), []);

    useEffect(() => {
      if(productsFilter) {
        debounceFetch(productsFilter);
      }

      return () => {
        debounceFetch.clear();
      }
    }, [productsFilter])

    async function handleFetchProductsById(productId: string) {
      setLoadingProducts(true);
      try {
        const response = await getProductById(productId);
        setSelectedProduct(response);
      }catch (error) {
        console.error("Error fetching product by ID:", error);
      }finally {
        setLoadingProducts(false);
      }
    }

    async function fetchProducts(filterLike: string) {
        setLoadingProducts(true);
        try {
          const response = await getProductsFilter({ filterlike: filterLike });
          setProducts(response.products);
        }catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoadingProducts(false);
        }
    }

    function handleProductInputChange(producto: Product) {
        setFormDataImagesProducts((prevData) => ({
            ...prevData,
            product_id: producto.id as string
        }));
        setSelectedProduct(producto);
        handleFetchAttributeValues(producto.id as string);
        setProductsFilter("");
    }

    function handleDeleteProductSelection() {
        setFormDataImagesProducts((prevData) => ({
            ...prevData,
            product_id: ""
        }));
        setSelectedProduct(null);
        setAttributeValuesOptions([]);
    }

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataImagesProducts((prevData) => {  

            if(name === "sort_order") {
              return {
                ...prevData,
                [name]: Number(value)
              }
            }

            return {
                ...prevData,
                [name]: value
            };
        });
    }

    function handleImageChange(files: File[]) {
        const file = files[0];
        setFormDataImagesProducts((prevData) => ({
          ...prevData,
          image_url: file ? file : prevData.image_url
        }
        ))
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            className="max-w-[700px] p-6 lg:p-10"
          >
            <form onSubmit={(e) => handleCreateImagesProducts(e, FormDataImagesProducts)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Imagen` : `Agregar Imagen`}
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
                  {
                    selectedProduct ? (
                      <div className="relative w-full mt-5">
                        <div className="flex items-center gap-5 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                          <div className="w-[60px] h-[60px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                              <Image unoptimized={process.env.NODE_ENV ? true : false} src={selectedProduct.image ? `${process.env.NEXT_PUBLIC_URL_IMAGES}${selectedProduct.image}` : "/images/error/404_image.png"} width={100} height={100} alt="Imagen de producto" />
                          </div>
                          <div className="flex flex-1 flex-col">
                              <span>{selectedProduct.name}</span>
                              <small>{selectedProduct.category_name}</small>
                          </div>
                          <div>
                              <button onClick={handleDeleteProductSelection} type="button" className="flex items-center gap-5 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                <DeleteIcon fill="red" width={20} height={20} />
                              </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <FormGroupInput>
                          <Label htmlFor="product">Producto:</Label>
                          <div className="relative">
                            <InputField
                              className={errorInput === "product_id" ? "border-red-500" : ""}
                              id="input-product"
                              name="product_id"
                              value={productsFilter}
                              placeholder="Buscar producto por ID"
                              onChange={(e) => setProductsFilter(e.target.value)}
                            />
                            <InputContainerProduct products={products} handleProductInputChange={handleProductInputChange} is_open={productsFilter != ""} loading={loadingProducts} />
                          </div>
                      </FormGroupInput>
                    )
                  }
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="alt_text">Alt:</Label>
                      <InputField 
                        className={errorInput === "alt_text" ? "border-red-500" : ""}
                        step={0.01}
                        name="alt_text"
                        value={FormDataImagesProducts.alt_text ? FormDataImagesProducts.alt_text : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="sort_order">Numero de Orden ["0" es la principal]:</Label>
                      <InputField 
                        className={errorInput === "sort_order" ? "border-red-500" : ""}
                        name="sort_order"
                        type="number"
                        value={FormDataImagesProducts.sort_order !== null && FormDataImagesProducts.sort_order !== undefined ? String(FormDataImagesProducts.sort_order) : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  {
                    selectedProduct && (
                      <FormGroupInput>
                          <Label htmlFor="attribute_value">Valor del Atributo:</Label>
                          <Select 
                            onChange={handleDataChange}
                            value={FormDataImagesProducts.attribute_value ? FormDataImagesProducts.attribute_value : ""}
                            name="attribute_value"
                            options={attributeValuesOptions}
                          />
                      </FormGroupInput>
                    )
                  }
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                    <DropzoneComponent
                      onDrop={handleImageChange}
                      image={FormDataImagesProducts.image_url}
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