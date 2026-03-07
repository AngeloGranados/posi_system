'use client'

import { useModal } from "@/hooks/useModal"
import { orderByAscDescProduct, orderByProduct, Product, tableThProduct } from "@/types/produts"
import ModalProduct from "./modalProducts";
import { useEffect, useState } from "react";
import { createProduct, deleteProduct, getProductsFilter, updateProduct } from "@/services/produtsServices";
import useAlert from "@/hooks/useAlert";
import TablePage from "@/components/tables/TablePage";
import { TableRow, TableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import { formatPrice } from "../../../../../../util";
import Badge from "@/components/ui/badge/Badge";
import EditIcon from "../../../../../../public/images/icons/edit-icon";
import Button from "@/components/ui/button/Button";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productsList, setProductsList] = useState<Product[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByProduct | null>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescProduct | null>("id")
    const [filterlike, setFilterlike] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()

    const tableThProducts: tableThProduct[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Producto" },
        { name: "price", value: "Precio" },
        { name: "stock", value: "Stock" },
        { name: "description_short", value: "Descripción" },
        { name: "is_active", value: "Estado" },
        { name: "actions", value: "Acciones" },
    ]

    useEffect(() => {
        fetchProductsFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    async function fetchProductsFiltered() {
        setLoading(true);
        try {
            const response = await getProductsFilter({ orderBy, orderField, limit, page });
            setProductsList(response.products);
            setPageTotal(response.total);
        }catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }

    const pageTotalToTable = Math.ceil(pageTotal / limit);

    async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>, product: Product, images: File[] | string[], productAttributes: { key: number; value: string }[]) {
        event.preventDefault();

        let error = null;

        const requiredFields: (keyof Product)[] = ["name", "slug", "description_short", "description_long", "price", "category_id", "idbrand", "stock", "image"];

        for (const field of requiredFields) {
            if (field !== "stock" && field !== "discount") {
                if (!product[field] || (product[field] as string).toString().trim() === "") {
                    error = `El campo ${field} es obligatorio.`;
                    break;
                }
            }

            if (field === "price" && product[field] <= 0) {
                error = `El campo ${field} debe ser un número positivo.`;
                break;
            }

            if (field === "image" && selectedProduct === null) {
                if (!(product[field] instanceof File) || product[field].size === 0) {
                    error = `El campo ${field} es obligatorio.`;
                    break;
                }
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            return;
        }

        try {
            if (selectedProduct) {
                await updateProduct(product);
            } else {
                await createProduct(product, images, productAttributes);
            }
            await fetchProductsFiltered();
            closeModal();
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    async function handleDeleteProduct(productId: number) {
        try{ 
            await deleteProduct(productId);
            await fetchProductsFiltered();
        }catch(error){
            console.error("Error deleting product:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescProduct) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: Product | null) => {
        setSelectedProduct(data);
        openModal();
    };

    return (
        <>
            <ModalProduct 
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedProduct} 
                handleCreateProduct={handleCreateProduct} 
                selected={selectedProduct} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Product>
                titleTable=""
                buttonText="Agregar un Producto"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThProducts} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={page}
                setPage={setPage}
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
                                                <span className="text-[14px] font-bold">{product.name}</span>
                                                <small className="text-gray-500">{product.slug}</small>
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
                                            <Button onClick={() => handleDeleteProduct(product.id as number)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
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