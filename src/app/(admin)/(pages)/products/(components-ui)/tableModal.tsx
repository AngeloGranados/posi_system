'use client'

import { useModal } from "@/hooks/useModal"
import { orderBy, orderByAscDesc, Product, tableThProducts } from "@/types/produts"
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
    const [orderBy, setOrderBy] = useState<orderBy | null>("ByASC")
    const [orderField, setOrderField] = useState<orderByAscDesc | null>("id")
    const [filterlike, setFilterlike] = useState('')

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()

    const tableThProducts: tableThProducts[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Producto" },
        { name: "price", value: "Precio" },
        { name: "stock", value: "Stock" },
        { name: "description_short", value: "Descripción" },
        { name: "is_active", value: "Estado" },
        { name: "actions", value: "Acciones" },
    ]

    useEffect(() => {
        async function fetchProductsFiltered() {
            try {
                const response = await getProductsFilter({ orderBy, orderField, limit, page });
                setProductsList(response.products);
                setPageTotal(response.total);
            }catch (error) {
                console.error("Error fetching products:", error);
            }
        }

        fetchProductsFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    const pageTotalToTable = Math.ceil(pageTotal / limit);

    async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>, product: Product, images: File[]) {
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
                const result = await updateProduct(product);
                setProductsList(prev => prev.map(p => (p.id === result.id ? result : p)));
            } else {
                const result = await createProduct(product, images);
                setProductsList(prev => [...prev, result]);
            }
            closeModal();
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    async function handleDeleteProduct(productId: number) {
        try{ 
            await deleteProduct(productId);
            setProductsList(prev => prev.filter(p => p.id !== productId));
        }catch(error){
            console.error("Error deleting product:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDesc) {
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
            <TablePage 
                titleTable="Productos"
                buttonText="Agregar un producto"
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
                                <TableCell className="px-3 py-4 text-lef">{
                                    product.is_active ? 
                                    <Badge variant="solid" color="success">Activo</Badge> : 
                                    <Badge variant="solid" color="error">Inactivo</Badge>
                                    }</TableCell>
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
                            <TableCell className="text-center py-4" colSpan={12}>   
                                <div className="w-full h-50">
                                    <Skeleton width={'100%'} height={'100%'} />
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                }
            </TablePage>
        </>
    );
}