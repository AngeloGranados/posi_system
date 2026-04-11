'use client'

import { useModal } from "@/hooks/useModal"
import { FilterParams, orderByAscDescProduct, orderByProduct, Product, tableThProduct } from "@/types/produts"
import ModalProduct from "./modalProducts";
import React, { useCallback, useEffect, useState } from "react";
import { changeStatusProduct, createProduct, deleteProduct, getProductsFilter, updateProduct } from "@/services/produtsServices";
import useAlert from "@/hooks/useAlert";
import TablePage from "@/components/tables/TablePage";
import { TableRow, TableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import { formatPrice } from "../../../../../../util";
import Badge from "@/components/ui/badge/Badge";
import EditIcon from "../../../../../../public/images/icons/edit-icon";
import Button from "@/components/ui/button/Button";
import debounce from "debounce";
import ChangeStatusIcon from "../../../../../../public/images/icons/changeStatus-icon";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "@/components/form/Select";
import FiltersComponent from "./filtersComponentProducts";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productsList, setProductsList] = useState<Product[]>([]);

    // filters
    const [filters, setFilters] = useState<FilterParams>({
        categoryId: null,
        page: 1,
        limit: 100,
        orderBy: "ByDESC" as orderByProduct,
        orderField: "id" as orderByAscDescProduct,
        filterlike: "",
        byStatus: "active"
    });

    const [pageTotal, setPageTotal] = useState(1)
    const [inputSearch, setInputSearch] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)
    const swalAlert = withReactContent(Swal);

    const tableThProducts: tableThProduct[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Producto" },
        { name: "price", value: "Precio" },
        { name: "stock", value: "Stock" },
        { name: "category_name", value: "Categoría" },
        { name: "description_short", value: "Descripción" },
        { name: "is_active", value: "Estado" },
        { name: "actions", value: "Acciones" },
    ]

    useEffect(() => {
        fetchProductsFiltered()
    }, [filters]);

    async function fetchProductsFiltered() {
        setLoading(true);
        try {
            const response = await getProductsFilter(filters);
            setProductsList(response.products);
            setPageTotal(response.total);
        }catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }

    const pageTotalToTable = Math.ceil(pageTotal / filters.limit);

    async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>, product: Product, images: File[] | string[], productAttributes: { key: string; value: string }[]) {
        event.preventDefault();

        let error = null;
        let fieldError = null;

        const requiredFields: (keyof Product)[] = ["name", "sku", "slug", "description_short", "description_long", "price", "category_id", "idbrand", "stock", "image"];

        for (const field of requiredFields) {
            if (field !== "stock" && field !== "discount" && field !== "price") {
                if (!product[field] || (product[field] as string).toString().trim() === "") {
                    error = `Todos los campos son obligatorios.`;
                    fieldError = field;
                    break;
                }
            }

            if (field === "price" && product[field] <= 0) {
                error = `El campo ${field} debe ser un número positivo.`;
                fieldError = field;
                break;
            }

            if (field === "image" && selectedProduct === null) {
                if (!(product[field] instanceof File) || product[field].size === 0) {
                    error = `La imagen principal es obligatoria.`;
                    fieldError = field;
                    break;
                }
            }
        }

        if (productAttributes.length > 0) {
            if (productAttributes.some(attr => !attr.value || attr.value.trim() === "") || productAttributes.some(attr => !attr.key || attr.key === "")) {
                error = "Todos los atributos deben tener un valor.";
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            setErrorInput(fieldError);
            return;
        }

        try {
            setLoading(true);
            if (selectedProduct) {
                await updateProduct(product, images, productAttributes);
            } else {
                await createProduct(product, images, productAttributes);
            }
            await fetchProductsFiltered();
            closeAlert();
            closeModal();
        } catch (error) {
            triggerAlert("Error", error instanceof Error ? error.message : "Error desconocido", "error");
            const firstInput = document.querySelector('#alert') as HTMLElement | null;
            if (firstInput) {
                firstInput.focus();
            }
        } finally {
            setLoading(false);
        }
    }

    // async function handleDeleteProduct(productId: string) {
    //     try{ 
    //         await deleteProduct(productId);
    //         await fetchProductsFiltered();
    //     }catch(error){
    //         console.error("Error deleting product:", error);
    //     }
    // } 

    async function handleChangeStatusProduct(productId: string, newStatus: boolean) {

        swalAlert.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas ${newStatus ? "activar" : "desactivar"} este producto?`,
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await changeStatusProduct(productId, newStatus);
                    swalAlert.fire('¡Hecho!', `El producto ha sido ${newStatus ? "activado" : "desactivado"}.`, 'success');
                    await fetchProductsFiltered();
                } catch (error) {
                    console.error("Error changing product status:", error);
                }
            }
        });
    }

    async function handleOrderByAscDesc(field: orderByAscDescProduct) {
        if(filters.orderField === field){
            setFilters({ ...filters, orderBy: filters.orderBy === "ByASC" ? "ByDESC" : "ByASC" });
        } else {
            setFilters({ ...filters, orderField: field, orderBy: "ByASC" });
        }
    }

    const handleOpenModal = (data: Product | null) => {
        setSelectedProduct(data);
        openModal();
    };

    const debounceOnchangeFilterLike = useCallback(debounce((value: string) => {
        setFilters({ ...filters, filterlike: value });
    }, 500), []);

    const handleOnchangeFilterLike = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
        debounceOnchangeFilterLike(e.target.value);
    }

    function handleCategoryChange(categoryId: string | null) {
        setFilters({ ...filters, categoryId: categoryId ? `${categoryId}` : "" });
    }

    function handleStatusChange(status: 'active' | 'inactive') {
        setFilters({ ...filters, byStatus: status });
    }

    return (
        <>
            <ModalProduct 
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedProduct} 
                handleCreateProduct={handleCreateProduct} 
                selected={selectedProduct} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Product>
                titleTable=""
                filters={<FiltersComponent onCategoryChange={handleCategoryChange} onStatusChange={handleStatusChange} />}
                showSearch={true}
                setSearch={handleOnchangeFilterLike}
                search={inputSearch}
                buttonText="Agregar un Producto"
                orderField={filters.orderField} 
                orderBy={filters.orderBy} 
                tableThPage={tableThProducts} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={filters.page}
                setPage={(page) => setFilters({ ...filters, page })}
            >
                {
                    loading ? (
                        <TableRow>
                            <TableCell className="text-center py-4" colSpan={12}>   
                                <div className="w-full h-50">
                                    <Skeleton width={'100%'} height={'100%'} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        productsList && productsList.length > 0 ? (
                            productsList.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="px-3 py-3 text-left">#{product.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex items-center space-x-4">
                                            <div className="mb-2">
                                                {
                                                    product.image && (
                                                    <Image
                                                        width={64}
                                                        height={64}
                                                        unoptimized={process.env.NODE_ENV ? true : false}
                                                        src={`${process.env.NEXT_PUBLIC_URL_IMAGES ?? ""}${typeof product.image === "string" ? product.image : product.image}`}
                                                        alt={product.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    )
                                                }
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[17px] font-bold">{product.name}</span>
                                                <small className="text-gray-800">{product.slug}</small>
                                                <small className="text-gray-500">{product.sku}</small>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">{formatPrice(product.price)}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 object-cover rounded ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                                            {product.stock}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">{product.category_name}</TableCell>
                                    <TableCell className="px-3 my-4 line-clamp text-gray-700">{product.description_short}</TableCell>
                                    <TableCell className="px-3 py-4 text-lef">
                                        {
                                            product.is_active ? 
                                            <Badge variant="solid" color="success">Activo</Badge> : 
                                            <Badge variant="solid" color="error">Inactivo</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(product)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleChangeStatusProduct(product.id as string, !product.is_active)} variant="outline" className="text-red-500"><ChangeStatusIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>No se encontraron productos.</TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}